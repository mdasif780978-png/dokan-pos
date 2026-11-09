import { db } from './db';
import { round2 } from '../domain/billing';
import { AppError } from '../lib/errors';
import { parseNum } from '../lib/format';

export async function saveCustomer({ id, name, phone }) {
  const data = { name: String(name ?? '').trim(), phone: String(phone ?? '').trim() };
  if (!data.name) throw new AppError('err.customerNameRequired');
  const now = Date.now();
  if (id) {
    await db.customers.update(id, { ...data, updatedAt: now });
    return id;
  }
  return db.customers.add({ ...data, balance: 0, createdAt: now, updatedAt: now });
}

/** Only customers with no due can be deleted, so no baki is ever lost by mistake. */
export async function deleteCustomer(id) {
  return db.transaction('rw', db.customers, db.ledger, async () => {
    const c = await db.customers.get(id);
    if (!c) return;
    if (Math.abs(c.balance || 0) > 0.001) throw new AppError('err.customerHasDue');
    await db.ledger.where('customerId').equals(id).delete();
    await db.customers.delete(id);
  });
}

/**
 * Add an entry to a customer's khata.
 * type 'payment' → customer paid money back (due goes down)
 * type 'credit'  → manual baki, e.g. an old due from the paper khata (due goes up)
 */
export async function addLedgerEntry(customerId, type, amount, note = '') {
  const value = round2(parseNum(amount));
  if (!(value > 0)) throw new AppError('err.amountRequired');
  return db.transaction('rw', db.customers, db.ledger, async () => {
    const c = await db.customers.get(customerId);
    if (!c) throw new AppError('err.customerMissing');
    const now = Date.now();
    const balance = round2((c.balance || 0) + (type === 'payment' ? -value : value));
    await db.ledger.add({ customerId, type, amount: value, note: String(note).trim(), createdAt: now });
    await db.customers.update(customerId, { balance, updatedAt: now });
    return balance;
  });
}
