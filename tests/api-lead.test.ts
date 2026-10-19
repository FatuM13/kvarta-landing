import { describe, it, expect, beforeEach } from 'vitest';
import { POST } from '@/app/api/lead/route';
import { NextRequest } from 'next/server';
import { clearAllLeads } from '@/lib/db';

function createJsonRequest(body: unknown, headers: Record<string, string> = {}): NextRequest {
  return new NextRequest('http://localhost:3000/api/lead', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

describe('POST /api/lead Route Handler', () => {
  beforeEach(async () => {
    await clearAllLeads();
  });

  it('returns 400 if Content-Type is not application/json', async () => {
    const req = new NextRequest('http://localhost:3000/api/lead', {
      method: 'POST',
      headers: { 'content-type': 'text/plain' },
      body: 'invalid body',
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.success).toBe(false);
  });

  it('returns 422 if phone number is invalid', async () => {
    const req = createJsonRequest({
      name: 'Иван',
      phone: '+1 555 123-4567', // Not Belarusian
      interest_type: 'order',
    });
    const res = await POST(req);
    expect(res.status).toBe(422);
    const data = await res.json();
    expect(data.code).toBe('INVALID_INPUT');
    expect(data.error).toBeDefined();
  });

  it('returns 201 and creates lead on valid submission', async () => {
    const req = createJsonRequest({
      name: 'Мария',
      phone: '+375 29 777-88-99',
      interest_type: 'order',
      comment: 'Для воронки V60',
      product_context: 'Колумбия Уила',
      utm_source: 'yandex',
      utm_medium: 'search',
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.leadId).toBeDefined();
  });

  it('returns 409 Conflict if duplicate submitted within 10 minutes', async () => {
    const payload = {
      name: 'Екатерина',
      phone: '80336665544',
      interest_type: 'subscription',
    };

    const firstRes = await POST(createJsonRequest(payload));
    expect(firstRes.status).toBe(201);

    const secondRes = await POST(createJsonRequest(payload));
    expect(secondRes.status).toBe(409);
    const data = await secondRes.json();
    expect(data.code).toBe('DUPLICATE_RECENT');
    expect(data.error).toContain('10 минут');
  });
});
