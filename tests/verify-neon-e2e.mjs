import { Pool } from 'pg';

async function testLead() {
  const body = {
    name: 'Алексей Тестовый',
    phone: '+375 (29) 999-88-77',
    interest_type: 'order',
    comment: 'Заказ 2 кг Эфиопия Иргачефф и 1 кг Колумбия Уила',
    product_context: 'Эфиопия Иргачефф (2 шт), Колумбия Уила (1 шт)',
    utm_source: 'yandex_direct',
    utm_medium: 'cpc',
    utm_campaign: 'coffee_minsk_roast',
    landing_page_url: 'http://localhost:3000',
    referrer_url: 'https://yandex.by',
  };

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  // Pre-cleanup in case of earlier test runs
  await pool.query('DELETE FROM leads WHERE phone_normalized = $1', ['+375299998877']);

  console.log('1. Sending POST to http://localhost:3000/api/lead ...');
  const response = await fetch('http://localhost:3000/api/lead', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const resJson = await response.json();
  console.log('API Response status:', response.status);
  console.log('API Response body:', JSON.stringify(resJson, null, 2));

  if (!resJson.success || !resJson.leadId) {
    throw new Error('API lead submission failed!');
  }

  console.log('\n2. Verifying record directly in Neon PostgreSQL for lead ID:', resJson.leadId);
  const dbRes = await pool.query('SELECT * FROM leads WHERE id = $1', [resJson.leadId]);
  console.log('Found row in Neon DB:');
  console.log(dbRes.rows[0]);

  if (dbRes.rows.length === 0) {
    throw new Error('Lead was NOT found in Neon DB!');
  }

  console.log('\n3. Testing duplicate rate limit (same phone within 10 minutes) via API:');
  const dupResponse = await fetch('http://localhost:3000/api/lead', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const dupJson = await dupResponse.json();
  console.log('Duplicate test response status:', dupResponse.status);
  console.log('Duplicate test response body:', JSON.stringify(dupJson, null, 2));

  if (dupResponse.status !== 409) {
    throw new Error('Expected status 409 for duplicate request within 10 minutes');
  }

  // Clean up test lead
  await pool.query('DELETE FROM leads WHERE id = $1', [resJson.leadId]);
  console.log('\n4. Cleaned up test lead from Neon PostgreSQL.');
  await pool.end();

  console.log('\n======================================================');
  console.log('>>> END-TO-END VERIFICATION ON NEON POSTGRES PASSED! <<<');
  console.log('======================================================');
}

testLead().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});
