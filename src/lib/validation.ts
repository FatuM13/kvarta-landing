import { InterestType, LeadInput } from './types';
import { normalizeBelarusianPhone } from './phone';

export interface ValidationSuccess {
  isValid: true;
  data: {
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
  };
}

export interface ValidationFailure {
  isValid: false;
  errors: Record<string, string>;
}

export type ValidationOutcome = ValidationSuccess | ValidationFailure;

function sanitizeString(val: unknown, maxLen = 255): string | null {
  if (val === undefined || val === null) return null;
  const str = String(val).trim();
  if (str.length === 0) return null;
  return str.slice(0, maxLen);
}

export function validateLeadInput(input: unknown): ValidationOutcome {
  if (!input || typeof input !== 'object') {
    return {
      isValid: false,
      errors: { general: 'Неверный формат запроса' },
    };
  }

  const raw = input as Partial<LeadInput>;
  const errors: Record<string, string> = {};

  // 1. Name validation
  const rawName = typeof raw.name === 'string' ? raw.name.trim() : '';
  if (!rawName) {
    errors.name = 'Пожалуйста, укажите ваше имя';
  } else if (rawName.length < 2) {
    errors.name = 'Имя должно содержать хотя бы 2 буквы';
  } else if (rawName.length > 100) {
    errors.name = 'Слишком длинное имя (максимум 100 символов)';
  }

  // 2. Phone validation
  const phoneCheck = normalizeBelarusianPhone(typeof raw.phone === 'string' ? raw.phone : '');
  if (!phoneCheck.isValid || !phoneCheck.normalized) {
    errors.phone = phoneCheck.error || 'Введите белорусский номер (+375 XX XXX-XX-XX)';
  }

  // 3. Interest type validation
  const validInterests: InterestType[] = ['order', 'subscription', 'question'];
  let interestType: InterestType = 'order';
  if (raw.interest_type && validInterests.includes(raw.interest_type as InterestType)) {
    interestType = raw.interest_type as InterestType;
  } else if (raw.interest_type) {
    errors.interest_type = 'Недопустимый тип интереса';
  }

  if (Object.keys(errors).length > 0) {
    return {
      isValid: false,
      errors,
    };
  }

  return {
    isValid: true,
    data: {
      name: rawName,
      phone_normalized: phoneCheck.normalized!,
      interest_type: interestType,
      comment: sanitizeString(raw.comment, 1000),
      product_context: sanitizeString(raw.product_context, 200),
      utm_source: sanitizeString(raw.utm_source, 100),
      utm_medium: sanitizeString(raw.utm_medium, 100),
      utm_campaign: sanitizeString(raw.utm_campaign, 150),
      utm_content: sanitizeString(raw.utm_content, 150),
      utm_term: sanitizeString(raw.utm_term, 150),
      gclid: sanitizeString(raw.gclid, 150),
      yclid: sanitizeString(raw.yclid, 150),
      fbclid: sanitizeString(raw.fbclid, 150),
      landing_page_url: sanitizeString(raw.landing_page_url, 500),
      referrer_url: sanitizeString(raw.referrer_url, 500),
    },
  };
}
