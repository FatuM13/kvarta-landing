/**
 * Belarusian Phone Validation & Normalization Utility
 * Canonical format: +375XXXXXXXXX (exactly 9 digits after +375)
 */

// Valid 2-digit prefixes for Belarusian phone numbers
// Mobile: 25 (life:), 29 (A1, MTS), 33 (MTS), 44 (A1)
// Landline / regional: 17 (Minsk), 15 (Grodno), 16 (Brest), 21 (Vitebsk), 22 (Mogilev), 23 (Gomel), 24 (Beltelecom)
const VALID_BY_PREFIXES = ['25', '29', '33', '44', '17', '15', '16', '21', '22', '23', '24'];

export interface PhoneValidationResult {
  isValid: boolean;
  normalized?: string;
  error?: string;
}

/**
 * Normalizes and validates a Belarusian phone number.
 * Supports inputs like:
 * - "+375 29 123-45-67"
 * - "+375291234567"
 * - "8 (029) 123-45-67"
 * - "80291234567"
 * - "375291234567"
 */
export function normalizeBelarusianPhone(rawPhone: string): PhoneValidationResult {
  if (!rawPhone || typeof rawPhone !== 'string') {
    return {
      isValid: false,
      error: 'Введите номер телефона',
    };
  }

  // Remove whitespace, dashes, parentheses, dots
  let cleaned = rawPhone.trim().replace(/[\s\-\(\)\.]/g, '');

  // Convert leading 80 or 8-0 to +375
  if (cleaned.startsWith('80')) {
    cleaned = '+375' + cleaned.slice(2);
  } else if (cleaned.startsWith('8') && !cleaned.startsWith('+')) {
    // If user typed 8 without 0, e.g. 829..., handle if total length is 11
    if (cleaned.length === 11) {
      cleaned = '+375' + cleaned.slice(1);
    }
  } else if (cleaned.startsWith('375')) {
    cleaned = '+' + cleaned;
  }

  // Must start with +375
  if (!cleaned.startsWith('+375')) {
    return {
      isValid: false,
      error: 'Принимаются только белорусские номера, начинающиеся на +375 или 8 (0XX)',
    };
  }

  const digitsOnly = cleaned.replace(/\D/g, '');

  // Total digits must be 12 (375 + 9 digits)
  if (digitsOnly.length !== 12) {
    return {
      isValid: false,
      error: 'Номер должен содержать 9 цифр после кода страны (+375 XX XXX-XX-XX)',
    };
  }

  const nationalNumber = digitsOnly.slice(3); // 9 digits
  const prefix = nationalNumber.slice(0, 2);

  if (!VALID_BY_PREFIXES.includes(prefix)) {
    return {
      isValid: false,
      error: `Неверный код оператора (${prefix}). Разрешены коды: 25, 29, 33, 44, 17, 15, 16, 21, 22, 23`,
    };
  }

  const normalized = `+375${nationalNumber}`;

  return {
    isValid: true,
    normalized,
  };
}

/**
 * Formats a normalized or partially typed phone for display: +375 (29) 123-45-67
 */
export function formatBelarusianPhoneDisplay(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (!digits) return '';

  let national = digits;
  if (digits.startsWith('375')) {
    national = digits.slice(3);
  } else if (digits.startsWith('80')) {
    national = digits.slice(2);
  }

  // Cap at 9 digits
  national = national.slice(0, 9);

  let formatted = '+375';
  if (national.length > 0) {
    formatted += ` (${national.slice(0, 2)}`;
  }
  if (national.length >= 2) {
    formatted += ')';
  }
  if (national.length > 2) {
    formatted += ` ${national.slice(2, 5)}`;
  }
  if (national.length > 5) {
    formatted += `-${national.slice(5, 7)}`;
  }
  if (national.length > 7) {
    formatted += `-${national.slice(7, 9)}`;
  }

  return formatted;
}
