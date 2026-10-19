import { Pool, PoolClient } from 'pg';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { LeadRecord, CreateLeadResult } from './types';

// Singleton PostgreSQL pool
let pgPool: Pool | null = null;
let pgInitialized = false;

function getPgPool(): Pool | null {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    return null;
  }

  if (!pgPool) {
    const isLocal = connectionString.includes('localhost') || connectionString.includes('127.0.0.1');
    pgPool = new Pool({
      connectionString,
      ssl: isLocal ? false : { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });
  }

  return pgPool;
}

/**
 * Ensures table and indexes exist in PostgreSQL.
 * Uses direct connection (DATABASE_URL_UNPOOLED) if available per Neon best practices.
 */
async function ensurePgSchema(pool: Pool): Promise<void> {
  if (pgInitialized) return;

  const unpooledUrl = process.env.DATABASE_URL_UNPOOLED;
  let client: PoolClient;
  let tempPool: Pool | null = null;

  if (unpooledUrl) {
    const isLocal = unpooledUrl.includes('localhost') || unpooledUrl.includes('127.0.0.1');
    tempPool = new Pool({
      connectionString: unpooledUrl,
      ssl: isLocal ? false : { rejectUnauthorized: false },
      connectionTimeoutMillis: 5000,
    });
    client = await tempPool.connect();
  } else {
    client = await pool.connect();
  }

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS leads (
        id TEXT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        phone_normalized VARCHAR(20) NOT NULL,
        interest_type VARCHAR(50) NOT NULL,
        comment TEXT,
        product_context VARCHAR(200),
        utm_source VARCHAR(100),
        utm_medium VARCHAR(100),
        utm_campaign VARCHAR(150),
        utm_content VARCHAR(150),
        utm_term VARCHAR(150),
        gclid VARCHAR(150),
        yclid VARCHAR(150),
        fbclid VARCHAR(150),
        landing_page_url VARCHAR(500),
        referrer_url VARCHAR(500),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_leads_phone_created ON leads(phone_normalized, created_at DESC);
    `);
    pgInitialized = true;
  } finally {
    client.release();
    if (tempPool) {
      await tempPool.end();
    }
  }
}

// ==========================================
// Local Persistent Storage (Dev / Test Fallback)
// ==========================================
const LOCAL_STORAGE_DIR = path.join(process.cwd(), '.data');
const LOCAL_STORAGE_FILE = path.join(LOCAL_STORAGE_DIR, 'leads.json');

// In-memory mutex for local concurrent requests
const localLocks = new Map<string, Promise<void>>();

function ensureLocalStorage(): void {
  if (!fs.existsSync(LOCAL_STORAGE_DIR)) {
    fs.mkdirSync(LOCAL_STORAGE_DIR, { recursive: true });
  }
  if (!fs.existsSync(LOCAL_STORAGE_FILE)) {
    fs.writeFileSync(LOCAL_STORAGE_FILE, JSON.stringify([]), 'utf-8');
  }
}

function readLocalLeads(): LeadRecord[] {
  ensureLocalStorage();
  try {
    const data = fs.readFileSync(LOCAL_STORAGE_FILE, 'utf-8');
    return JSON.parse(data) as LeadRecord[];
  } catch {
    return [];
  }
}

function writeLocalLeads(leads: LeadRecord[]): void {
  ensureLocalStorage();
  fs.writeFileSync(LOCAL_STORAGE_FILE, JSON.stringify(leads, null, 2), 'utf-8');
}

/**
 * Creates a lead in PostgreSQL with advisory lock & 10-minute duplicate check
 */
async function createLeadPostgres(
  pool: Pool,
  leadData: Omit<LeadRecord, 'id' | 'created_at'>
): Promise<CreateLeadResult> {
  await ensurePgSchema(pool);
  const client: PoolClient = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Transaction-level advisory lock based on phone hash
    // Guarantees parallel requests for the same phone number serialize safely
    await client.query('SELECT pg_advisory_xact_lock(hashtext($1))', [leadData.phone_normalized]);

    // 2. Check for duplicate within the last 10 minutes
    const tenMinutesAgoCheck = await client.query(
      `SELECT id, created_at FROM leads 
       WHERE phone_normalized = $1 
         AND created_at >= NOW() - INTERVAL '10 minutes'
       LIMIT 1`,
      [leadData.phone_normalized]
    );

    if (tenMinutesAgoCheck.rows.length > 0) {
      await client.query('ROLLBACK');
      return {
        success: false,
        error: 'Заявка с этого номера уже отправлена за последние 10 минут. Менеджер скоро свяжется с вами!',
        code: 'DUPLICATE_RECENT',
      };
    }

    // 3. Insert new lead
    const id = crypto.randomUUID();
    const insertRes = await client.query(
      `INSERT INTO leads (
        id, name, phone_normalized, interest_type, comment, product_context,
        utm_source, utm_medium, utm_campaign, utm_content, utm_term,
        gclid, yclid, fbclid, landing_page_url, referrer_url, created_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, NOW()
      ) RETURNING id, name, phone_normalized, interest_type, comment, product_context,
                  utm_source, utm_medium, utm_campaign, utm_content, utm_term,
                  gclid, yclid, fbclid, landing_page_url, referrer_url,
                  created_at AT TIME ZONE 'UTC' as created_at`,
      [
        id,
        leadData.name,
        leadData.phone_normalized,
        leadData.interest_type,
        leadData.comment,
        leadData.product_context,
        leadData.utm_source,
        leadData.utm_medium,
        leadData.utm_campaign,
        leadData.utm_content,
        leadData.utm_term,
        leadData.gclid,
        leadData.yclid,
        leadData.fbclid,
        leadData.landing_page_url,
        leadData.referrer_url,
      ]
    );

    await client.query('COMMIT');

    const row = insertRes.rows[0];
    const createdLead: LeadRecord = {
      ...row,
      created_at: new Date(row.created_at).toISOString(),
    };

    return {
      success: true,
      lead: createdLead,
    };
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('PostgreSQL lead creation error:', err);
    return {
      success: false,
      error: 'Не удалось сохранить заявку. Пожалуйста, попробуйте еще раз через минуту.',
      code: 'DATABASE_ERROR',
    };
  } finally {
    client.release();
  }
}

/**
 * Creates a lead in local persistent file storage (fallback when no DATABASE_URL)
 */
async function createLeadLocal(
  leadData: Omit<LeadRecord, 'id' | 'created_at'>
): Promise<CreateLeadResult> {
  const phone = leadData.phone_normalized;

  // Local concurrency mutex queue
  while (localLocks.has(phone)) {
    await localLocks.get(phone);
  }

  let releaseLock: () => void = () => {};
  const lockPromise = new Promise<void>((resolve) => {
    releaseLock = resolve;
  });
  localLocks.set(phone, lockPromise);

  try {
    const leads = readLocalLeads();
    const tenMinutesAgoMs = Date.now() - 10 * 60 * 1000;

    // Check duplicate in last 10 minutes
    const duplicate = leads.find((l) => {
      if (l.phone_normalized !== phone) return false;
      const createdAtMs = new Date(l.created_at).getTime();
      return createdAtMs >= tenMinutesAgoMs;
    });

    if (duplicate) {
      return {
        success: false,
        error: 'Заявка с этого номера уже отправлена за последние 10 минут. Менеджер скоро свяжется с вами!',
        code: 'DUPLICATE_RECENT',
      };
    }

    const newLead: LeadRecord = {
      id: crypto.randomUUID(),
      name: leadData.name,
      phone_normalized: leadData.phone_normalized,
      interest_type: leadData.interest_type,
      comment: leadData.comment,
      product_context: leadData.product_context,
      utm_source: leadData.utm_source,
      utm_medium: leadData.utm_medium,
      utm_campaign: leadData.utm_campaign,
      utm_content: leadData.utm_content,
      utm_term: leadData.utm_term,
      gclid: leadData.gclid,
      yclid: leadData.yclid,
      fbclid: leadData.fbclid,
      landing_page_url: leadData.landing_page_url,
      referrer_url: leadData.referrer_url,
      created_at: new Date().toISOString(),
    };

    leads.push(newLead);
    writeLocalLeads(leads);

    return {
      success: true,
      lead: newLead,
    };
  } finally {
    localLocks.delete(phone);
    releaseLock();
  }
}

/**
 * Main public entry point: saves a new lead
 */
export async function saveLead(
  leadData: Omit<LeadRecord, 'id' | 'created_at'>
): Promise<CreateLeadResult> {
  const pool = getPgPool();
  if (pool) {
    return createLeadPostgres(pool, leadData);
  }

  return createLeadLocal(leadData);
}

/**
 * Helper to get latest leads (used in testing and debugging)
 */
export async function getRecentLeads(limit = 10): Promise<LeadRecord[]> {
  const pool = getPgPool();
  if (pool) {
    await ensurePgSchema(pool);
    const res = await pool.query(
      `SELECT id, name, phone_normalized, interest_type, comment, product_context,
              utm_source, utm_medium, utm_campaign, utm_content, utm_term,
              gclid, yclid, fbclid, landing_page_url, referrer_url,
              created_at AT TIME ZONE 'UTC' as created_at
       FROM leads 
       ORDER BY created_at DESC 
       LIMIT $1`,
      [limit]
    );
    return res.rows.map((row) => ({
      ...row,
      created_at: new Date(row.created_at).toISOString(),
    }));
  }

  const leads = readLocalLeads();
  return leads.slice(-limit).reverse();
}

/**
 * Helper to clear test leads (used exclusively for tests)
 */
export async function clearAllLeads(): Promise<void> {
  const pool = getPgPool();
  if (pool) {
    await pool.query('DELETE FROM leads');
  } else {
    writeLocalLeads([]);
  }
}
