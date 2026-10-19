import { describe, it, expect } from 'vitest';
import { normalizeBelarusianPhone, formatBelarusianPhoneDisplay } from '@/lib/phone';

describe('Belarusian Phone Normalization & Validation', () => {
  it('correctly accepts and normalizes standard +375 29 format', () => {
    const res = normalizeBelarusianPhone('+375 29 123-45-67');
    expect(res.isValid).toBe(true);
    expect(res.normalized).toBe('+375291234567');
  });

  it('correctly normalizes plain 375291234567 format', () => {
    const res = normalizeBelarusianPhone('375291234567');
    expect(res.isValid).toBe(true);
    expect(res.normalized).toBe('+375291234567');
  });

  it('correctly converts 8 (029) 123-45-67 to +375291234567', () => {
    const res = normalizeBelarusianPhone('8 (029) 123-45-67');
    expect(res.isValid).toBe(true);
    expect(res.normalized).toBe('+375291234567');
  });

  it('correctly converts 80291234567 format', () => {
    const res = normalizeBelarusianPhone('80291234567');
    expect(res.isValid).toBe(true);
    expect(res.normalized).toBe('+375291234567');
  });

  it('accepts valid regional codes like 44, 33, 25, 17', () => {
    expect(normalizeBelarusianPhone('+375 44 765 43 21').isValid).toBe(true);
    expect(normalizeBelarusianPhone('+375 33 654 32 10').isValid).toBe(true);
    expect(normalizeBelarusianPhone('+375 25 987 65 43').isValid).toBe(true);
    expect(normalizeBelarusianPhone('+375 17 200 11 22').isValid).toBe(true);
  });

  it('rejects foreign phone numbers', () => {
    const res = normalizeBelarusianPhone('+7 999 123-45-67');
    expect(res.isValid).toBe(false);
    expect(res.error).toBeDefined();
  });

  it('rejects incomplete phone numbers', () => {
    const res = normalizeBelarusianPhone('+375 29 123');
    expect(res.isValid).toBe(false);
  });

  it('rejects invalid mobile operator codes (e.g. 99)', () => {
    const res = normalizeBelarusianPhone('+375 99 123-45-67');
    expect(res.isValid).toBe(false);
    expect(res.error).toContain('Неверный код оператора');
  });

  it('formats partial input for friendly display', () => {
    expect(formatBelarusianPhoneDisplay('291234567')).toBe('+375 (29) 123-45-67');
    expect(formatBelarusianPhoneDisplay('+37529123')).toBe('+375 (29) 123');
  });
});
