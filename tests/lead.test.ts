import { describe, it, expect, beforeEach } from 'vitest';
import { validateLeadInput } from '@/lib/validation';
import { saveLead, clearAllLeads, getRecentLeads } from '@/lib/db';
import { sendTelegramNotification } from '@/lib/telegram';

describe('Lead Processing & Deduplication', () => {
  beforeEach(async () => {
    await clearAllLeads();
  });

  it('validates required fields and fails on empty name', () => {
    const res = validateLeadInput({
      name: '',
      phone: '+375 29 111-22-33',
      interest_type: 'order',
    });
    expect(res.isValid).toBe(false);
    if (!res.isValid) {
      expect(res.errors.name).toBeDefined();
    }
  });

  it('validates and normalizes phone number correctly', () => {
    const res = validateLeadInput({
      name: 'Алексей',
      phone: '8 (029) 111-22-33',
      interest_type: 'subscription',
    });
    expect(res.isValid).toBe(true);
    if (res.isValid) {
      expect(res.data.phone_normalized).toBe('+375291112233');
      expect(res.data.interest_type).toBe('subscription');
    }
  });

  it('saves valid lead to database and records attribution', async () => {
    const leadData = {
      name: 'Ольга',
      phone_normalized: '+375291112233',
      interest_type: 'order' as const,
      comment: 'Нужен средний помол',
      product_context: 'Эфиопия Иргачеффе',
      utm_source: 'instagram',
      utm_medium: 'cpc',
      utm_campaign: 'spring_fresh',
      utm_content: 'banner_1',
      utm_term: 'specialty_coffee',
      gclid: null,
      yclid: 'y12345678',
      fbclid: 'fb_abc_123',
      landing_page_url: 'https://kvartacoffee.by/?utm_source=instagram',
      referrer_url: 'https://l.instagram.com/',
    };

    const result = await saveLead(leadData);
    expect(result.success).toBe(true);
    expect(result.lead).toBeDefined();
    expect(result.lead?.id).toBeDefined();
    expect(result.lead?.utm_source).toBe('instagram');
    expect(result.lead?.product_context).toBe('Эфиопия Иргачеффе');

    const leads = await getRecentLeads(1);
    expect(leads.length).toBe(1);
    expect(leads[0].name).toBe('Ольга');
    expect(leads[0].phone_normalized).toBe('+375291112233');
  });

  it('blocks duplicate submissions for the same phone within 10 minutes', async () => {
    const payload = {
      name: 'Дмитрий',
      phone_normalized: '+375339998877',
      interest_type: 'order' as const,
      comment: null,
      product_context: null,
      utm_source: null,
      utm_medium: null,
      utm_campaign: null,
      utm_content: null,
      utm_term: null,
      gclid: null,
      yclid: null,
      fbclid: null,
      landing_page_url: null,
      referrer_url: null,
    };

    const first = await saveLead(payload);
    expect(first.success).toBe(true);

    const second = await saveLead(payload);
    expect(second.success).toBe(false);
    expect(second.code).toBe('DUPLICATE_RECENT');
    expect(second.error).toContain('10 минут');
  });

  it('handles concurrent duplicate requests safely (race condition protection)', async () => {
    const payload = {
      name: 'Павел',
      phone_normalized: '+375445556677',
      interest_type: 'order' as const,
      comment: null,
      product_context: null,
      utm_source: null,
      utm_medium: null,
      utm_campaign: null,
      utm_content: null,
      utm_term: null,
      gclid: null,
      yclid: null,
      fbclid: null,
      landing_page_url: null,
      referrer_url: null,
    };

    // Fire 3 simultaneous requests with identical phone
    const results = await Promise.all([
      saveLead(payload),
      saveLead(payload),
      saveLead(payload),
    ]);

    const successes = results.filter((r) => r.success);
    const duplicates = results.filter((r) => r.code === 'DUPLICATE_RECENT');

    expect(successes.length).toBe(1);
    expect(duplicates.length).toBe(2);
  });

  it('telegram failure does not throw or break process', async () => {
    const dummyLead = {
      id: 'test-lead-id',
      name: 'Тест',
      phone_normalized: '+375291111111',
      interest_type: 'order' as const,
      comment: null,
      product_context: null,
      utm_source: null,
      utm_medium: null,
      utm_campaign: null,
      utm_content: null,
      utm_term: null,
      gclid: null,
      yclid: null,
      fbclid: null,
      landing_page_url: null,
      referrer_url: null,
      created_at: new Date().toISOString(),
    };

    // Even with missing or invalid tokens, sendTelegramNotification resolves safely
    const sent = await sendTelegramNotification(dummyLead);
    expect(typeof sent).toBe('boolean');
  });
});
