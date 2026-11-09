import { useLiveQuery } from 'dexie-react-hooks';
import { db } from './db';

export const DEFAULT_SETTINGS = {
  shopName: 'আমার দোকান',
  address: '',
  phone: '',
  currency: '৳',
  receiptFooter: 'ধন্যবাদ, আবার আসবেন!',
  paperWidth: 58, // mm: 58 or 80
  roundTotal: true, // round bill total to the nearest Taka
};

export async function getSettings() {
  const row = await db.settings.get('shop');
  return { ...DEFAULT_SETTINGS, ...(row?.value || {}) };
}

export async function saveSettings(patch) {
  const current = await getSettings();
  await db.settings.put({ key: 'shop', value: { ...current, ...patch } });
}

/** Live settings. `loaded` is false until IndexedDB has answered. */
export function useSettings() {
  const row = useLiveQuery(() => db.settings.get('shop').then((r) => r ?? null), []);
  return { ...DEFAULT_SETTINGS, ...(row?.value || {}), loaded: row !== undefined };
}
