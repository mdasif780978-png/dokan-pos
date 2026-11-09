import Dexie from 'dexie';

/**
 * Local database (IndexedDB via Dexie). Everything lives on the tablet — no server.
 *
 * products  { id, nameBn, nameEn, category, type: 'loose'|'packaged', price, barcode?,
 *             stock, lowStock, photo? (JPEG data URL), createdAt, updatedAt }
 *             stock & lowStock are in kg for loose items and pieces for packaged items.
 * customers { id, name, phone, balance, createdAt, updatedAt }   balance = current due (বাকি)
 * ledger    { id, customerId, type: 'credit'|'payment', amount, saleId?, note, createdAt }
 *             credit = customer took goods on credit (due goes up)
 *             payment = customer paid back (due goes down)
 * sales     { id, createdAt, dayKey, items[], subtotal, discount, rounding, total,
 *             paid, change, due, customerId?, customerName?, customerBalanceAfter? }
 * settings  { key: 'shop', value: {...} }
 * auth      (v2) { key: 'owner', ...owner account, PIN hash } and { key: 'session', signedInAt }
 *             See src/auth/localAuth.js. Never included in backup files.
 *
 * To change the schema later, add db.version(2).stores({...}) — never edit version(1).
 */
export const db = new Dexie('dokan-pos');

db.version(1).stores({
  products: '++id, nameBn, nameEn, category, type, barcode, updatedAt',
  customers: '++id, name, phone, balance, updatedAt',
  ledger: '++id, customerId, createdAt, saleId',
  sales: '++id, createdAt, dayKey, customerId',
  settings: 'key',
});

// v2: local owner account + sign-in session. Existing tables are kept as they are.
db.version(2).stores({
  auth: 'key',
});

/** Ask the browser not to evict our data when the tablet runs low on space. */
export async function requestPersistentStorage() {
  try {
    if (navigator.storage?.persisted && (await navigator.storage.persisted())) return true;
    return (await navigator.storage?.persist?.()) ?? false;
  } catch {
    return false;
  }
}
