import { useEffect, useReducer } from 'react';
import { cartReducer, emptyCart } from '../../domain/billing';
import { loadJSON, saveJSON } from '../../lib/storage';

const KEY = 'dokan.cart';

/** Cart state, kept in localStorage so a reload or app switch never loses a half-done bill. */
export function useCart() {
  const [cart, dispatch] = useReducer(cartReducer, undefined, () => {
    const saved = loadJSON(KEY, null);
    return saved && Array.isArray(saved.lines) ? { ...emptyCart(), ...saved } : emptyCart();
  });
  useEffect(() => saveJSON(KEY, cart), [cart]);
  return [cart, dispatch];
}
