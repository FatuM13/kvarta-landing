export type InterestType = 'order' | 'subscription' | 'question';

export interface LeadInput {
  name: string;
  phone: string;
  interest_type: InterestType;
  comment?: string;
  product_context?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  gclid?: string;
  yclid?: string;
  fbclid?: string;
  landing_page_url?: string;
  referrer_url?: string;
}

export interface LeadRecord {
  id: string;
  name: string;
  phone_normalized: string;
  interest_type: InterestType;
  comment: string | null;
  product_context: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  gclid: string | null;
  yclid: string | null;
  fbclid: string | null;
  landing_page_url: string | null;
  referrer_url: string | null;
  created_at: string; // ISO 8601 UTC
}

export interface CreateLeadResult {
  success: boolean;
  lead?: LeadRecord;
  error?: string;
  code?: 'INVALID_INPUT' | 'DUPLICATE_RECENT' | 'DATABASE_ERROR';
}
