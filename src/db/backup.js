import { db } from './db';
import { AppError } from '../lib/errors';
import { dayKey } from '../lib/format';

// The `auth` table (owner account + PIN hash) is deliberately NOT part of backups:
// a backup file can be shared safely, and restoring it keeps this device's own PIN.
const TABLES = ['products', 'customers', 'ledger', 'sales', 'settings'];
const LOCAL_KEYS = ['dokan.cart'];

/** Download all data as one JSON file (keep it on Google Drive / WhatsApp to yourself). */
export async function exportBackup() {
  const data = { app: 'dokan-pos', schema: 1, exportedAt: new Date().toISOString(), tables: {} };
  for (const t of TABLES) data.tables[t] = await db.table(t).toArray();
  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `dokan-backup-${dayKey()}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Replace all local data with a backup file. */
export async function importBackup(file) {
  let data;
  try {
    data = JSON.parse(await file.text());
  } catch {
    throw new AppError('err.badBackup');
  }
  if (data?.app !== 'dokan-pos' || typeof data.tables !== 'object') throw new AppError('err.badBackup');
  await db.transaction('rw', TABLES.map((t) => db.table(t)), async () => {
    for (const t of TABLES) {
      await db.table(t).clear();
      const rows = Array.isArray(data.tables[t]) ? data.tables[t] : [];
      if (rows.length) await db.table(t).bulkAdd(rows);
    }
  });
}

/** Erase everything on this device, including the owner account. The app returns to first-time setup. */
export async function clearAllData() {
  await db.transaction('rw', [...TABLES, 'auth'].map((t) => db.table(t)), async () => {
    for (const t of [...TABLES, 'auth']) await db.table(t).clear();
  });
  for (const key of LOCAL_KEYS) {
    try {
      localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
  }
}
