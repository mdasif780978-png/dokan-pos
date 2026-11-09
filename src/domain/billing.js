/**
 * Pure billing logic — no React, no database. Easy to unit test and reuse
 * (e.g. by a future camera-AI module that adds items to the cart).
 *
 * @typedef {'loose'|'packaged'} ProductType
 *   loose    = sold by weight, price is per kg, qty is in kg (0.25 = 250 g)
 *   packaged = sold per piece, price is per piece, qty is a whole number of pieces
 *
 * @typedef {Object} CartLine
 * @property {number} productId
 * @property {string} nameBn
 * @property {string} nameEn
 * @property {ProductType} type
 * @property {number} unitPrice  price per kg (loose) or per piece (packaged)
 * @property {number} qty        kg (loose) or pieces (packaged)
 *
 * @typedef {Object} Cart
 * @property {CartLine[]} lines
 * @property {'amount'|'percent'} discountMode
 * @property {number} discountValue
 */

export const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;
export const round3 = (n) => Math.round((n + Number.EPSILON) * 1000) / 1000;

export const emptyCart = () => ({ lines: [], discountMode: 'amount', discountValue: 0 });

export const lineAmount = (line) => round2(line.unitPrice * line.qty);

/** Normalise a quantity for its product type (3 decimals for kg, whole pieces). */
export const normalizeQty = (type, qty) => (type === 'loose' ? round3(qty) : Math.round(qty));

/** For "give me ৳50 of onions": weight in kg that the amount buys. */
export const kgForAmount = (amount, pricePerKg) => (pricePerKg > 0 ? round3(amount / pricePerKg) : 0);

export function lineFromProduct(product, qty) {
  return {
    productId: product.id,
    nameBn: product.nameBn || '',
    nameEn: product.nameEn || '',
    type: product.type,
    unitPrice: Number(product.price) || 0,
    qty: normalizeQty(product.type, qty),
  };
}

/**
 * Cart reducer.
 * Actions:
 *  { type: 'add', product, qty }       add qty (merges with an existing line of the same product)
 *  { type: 'setQty', productId, qty }  replace qty; qty <= 0 removes the line
 *  { type: 'remove', productId }
 *  { type: 'setDiscount', mode, value }
 *  { type: 'clear' }
 */
export function cartReducer(cart, action) {
  switch (action.type) {
    case 'add': {
      const { product, qty } = action;
      if (!(qty > 0)) return cart;
      const existing = cart.lines.find((l) => l.productId === product.id);
      if (existing) {
        return {
          ...cart,
          lines: cart.lines.map((l) =>
            l.productId === product.id ? { ...l, qty: normalizeQty(l.type, l.qty + qty) } : l,
          ),
        };
      }
      return { ...cart, lines: [...cart.lines, lineFromProduct(product, qty)] };
    }
    case 'setQty': {
      const { productId, qty } = action;
      if (!(qty > 0)) return { ...cart, lines: cart.lines.filter((l) => l.productId !== productId) };
      return {
        ...cart,
        lines: cart.lines.map((l) => (l.productId === productId ? { ...l, qty: normalizeQty(l.type, qty) } : l)),
      };
    }
    case 'remove':
      return { ...cart, lines: cart.lines.filter((l) => l.productId !== action.productId) };
    case 'setDiscount':
      return { ...cart, discountMode: action.mode, discountValue: Math.max(0, Number(action.value) || 0) };
    case 'clear':
      return emptyCart();
    default:
      return cart;
  }
}

export function discountAmount(subtotal, mode, value) {
  const v = Math.max(0, Number(value) || 0);
  const amount = mode === 'percent' ? (subtotal * Math.min(v, 100)) / 100 : v;
  return Math.min(round2(amount), subtotal);
}

/**
 * @returns {{subtotal:number, discount:number, rounding:number, total:number}}
 * With roundTotal the bill is rounded to the nearest whole Taka (no paisa in daily use);
 * the difference is shown on the receipt as "rounding".
 */
export function computeTotals(lines, { discountMode = 'amount', discountValue = 0, roundTotal = false } = {}) {
  const subtotal = round2(lines.reduce((sum, l) => sum + lineAmount(l), 0));
  const discount = discountAmount(subtotal, discountMode, discountValue);
  const raw = round2(subtotal - discount);
  const total = roundTotal ? Math.round(raw) : raw;
  return { subtotal, discount, rounding: round2(total - raw), total };
}

/** paid = cash handed over by the customer. */
export function computePayment(total, paid) {
  const p = round2(Math.max(0, Number(paid) || 0));
  return {
    paid: p,
    change: round2(Math.max(0, p - total)),
    due: round2(Math.max(0, total - p)),
  };
}

/** Handy quick-cash buttons: exact amount and the next common Taka notes above it. */
export function quickCashOptions(total) {
  if (total <= 0) return [];
  const notes = [10, 20, 50, 100, 200, 500, 1000];
  const options = new Set([Math.ceil(total)]);
  for (const note of notes) {
    const rounded = Math.ceil(total / note) * note;
    if (rounded > total) options.add(rounded);
    if (options.size >= 5) break;
  }
  return [...options].sort((a, b) => a - b);
}
