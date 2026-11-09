import { describe, expect, it } from 'vitest';
import { cartReducer, computePayment, computeTotals, emptyCart, kgForAmount, lineAmount, quickCashOptions } from './billing';

const rice = { id: 1, nameBn: 'চাল', nameEn: 'Rice', type: 'loose', price: 78 };
const oil = { id: 2, nameBn: 'তেল', nameEn: 'Oil', type: 'packaged', price: 189 };

describe('cart', () => {
  it('adds loose items by weight and merges repeated weighings', () => {
    let cart = cartReducer(emptyCart(), { type: 'add', product: rice, qty: 1 });
    cart = cartReducer(cart, { type: 'add', product: rice, qty: 0.5 });
    expect(cart.lines).toHaveLength(1);
    expect(cart.lines[0].qty).toBe(1.5);
    expect(lineAmount(cart.lines[0])).toBe(117);
  });

  it('counts packaged items in whole pieces and removes at zero', () => {
    let cart = cartReducer(emptyCart(), { type: 'add', product: oil, qty: 1 });
    cart = cartReducer(cart, { type: 'add', product: oil, qty: 1 });
    expect(cart.lines[0].qty).toBe(2);
    cart = cartReducer(cart, { type: 'setQty', productId: 2, qty: 0 });
    expect(cart.lines).toHaveLength(0);
  });

  it('keeps the price a line was added at', () => {
    const cart = cartReducer(emptyCart(), { type: 'add', product: rice, qty: 2 });
    expect(cart.lines[0].unitPrice).toBe(78);
  });
});

describe('totals', () => {
  const lines = [
    { productId: 1, type: 'loose', unitPrice: 85, qty: 0.375 }, // 31.875 → 31.88
    { productId: 2, type: 'packaged', unitPrice: 189, qty: 1 },
  ];

  it('rounds the bill to whole Taka when asked and reports the rounding', () => {
    expect(computeTotals(lines, { roundTotal: false })).toEqual({ subtotal: 220.88, discount: 0, rounding: 0, total: 220.88 });
    expect(computeTotals(lines, { roundTotal: true })).toEqual({ subtotal: 220.88, discount: 0, rounding: 0.12, total: 221 });
  });

  it('applies amount and percent discounts, never more than the subtotal', () => {
    expect(computeTotals(lines, { discountMode: 'amount', discountValue: 20.88 }).total).toBe(200);
    expect(computeTotals(lines, { discountMode: 'percent', discountValue: 10, roundTotal: true }).total).toBe(199);
    expect(computeTotals(lines, { discountMode: 'amount', discountValue: 9999 }).total).toBe(0);
  });
});

describe('payment', () => {
  it('computes change and due', () => {
    expect(computePayment(420, 500)).toEqual({ paid: 500, change: 80, due: 0 });
    expect(computePayment(420, 300)).toEqual({ paid: 300, change: 0, due: 120 });
  });

  it('offers exact and next-note quick cash buttons', () => {
    expect(quickCashOptions(420)).toEqual([420, 450, 500, 600, 1000]);
    expect(quickCashOptions(573)).toEqual([573, 580, 600, 1000]);
    expect(quickCashOptions(0)).toEqual([]);
  });

  it('converts a Taka amount into weight for loose items', () => {
    expect(kgForAmount(50, 80)).toBe(0.625);
    expect(kgForAmount(50, 0)).toBe(0);
  });
});
