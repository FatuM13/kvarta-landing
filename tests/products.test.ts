import { describe, it, expect } from 'vitest';
import { COFFEE_PRODUCTS, calculateOrderSummary } from '@/lib/products';

describe('Multi-product Order Selection & Calculation', () => {
  it('calculates 0 total for empty selection', () => {
    const res = calculateOrderSummary({});
    expect(res.totalCount).toBe(0);
    expect(res.totalPrice).toBe(0);
    expect(res.selectedItems.length).toBe(0);
    expect(res.isFreeDelivery).toBe(false);
  });

  it('correctly calculates total for multiple items', () => {
    // 2x Ethiopia (32 BYN) + 1x Colombia (29 BYN) = 64 + 29 = 93 BYN
    const quantities = {
      ethiopia: 2,
      colombia: 1,
      brazil: 0,
      drips: 0,
      subscription: 0,
    };

    const res = calculateOrderSummary(quantities);
    expect(res.totalCount).toBe(3);
    expect(res.totalPrice).toBe(93);
    expect(res.selectedItems.length).toBe(2);
    expect(res.summaryText).toContain('Эфиопия Иргачеффе');
    expect(res.summaryText).toContain('× 2');
    expect(res.summaryText).toContain('Колумбия Уила');
    expect(res.summaryText).toContain('× 1');
    expect(res.isFreeDelivery).toBe(true); // >= 50 BYN
  });

  it('indicates free delivery for orders under 50 BYN as false, unless subscription is present', () => {
    // 1x Brazil (26 BYN) < 50 BYN
    const resUnder = calculateOrderSummary({ brazil: 1 });
    expect(resUnder.totalPrice).toBe(26);
    expect(resUnder.isFreeDelivery).toBe(false);

    // 1x Subscription (54 BYN)
    const resSub = calculateOrderSummary({ subscription: 1 });
    expect(resSub.totalPrice).toBe(54);
    expect(resSub.isFreeDelivery).toBe(true);
  });

  it('contains all 5 exact roastery products', () => {
    expect(COFFEE_PRODUCTS.length).toBe(5);
    const ids = COFFEE_PRODUCTS.map((p) => p.id);
    expect(ids).toEqual(['ethiopia', 'colombia', 'brazil', 'drips', 'subscription']);
  });
});
