import { db } from './db';
import { round3 } from '../domain/billing';
import { AppError } from '../lib/errors';
import { parseNum } from '../lib/format';

export const DEFAULT_LOW_STOCK = { loose: 2, packaged: 5 };

/** Clean up form values into a product record. */
export function normalizeProduct(input) {
  const type = input.type === 'loose' ? 'loose' : 'packaged';
  const barcode = String(input.barcode ?? '').trim();
  const lowStock = String(input.lowStock ?? '').trim() === '' ? DEFAULT_LOW_STOCK[type] : parseNum(input.lowStock);
  return {
    nameBn: String(input.nameBn ?? '').trim(),
    nameEn: String(input.nameEn ?? '').trim(),
    category: String(input.category ?? '').trim(),
    type,
    price: Math.max(0, parseNum(input.price)),
    barcode: barcode || undefined, // undefined is not indexed, so empty barcodes never clash
    stock: type === 'loose' ? round3(parseNum(input.stock)) : Math.round(parseNum(input.stock)),
    lowStock: Math.max(0, lowStock),
    photo: input.photo || undefined,
    icon: input.icon || undefined, // offline icon key, see src/components/itemIcons.jsx
  };
}

export async function saveProduct(input) {
  const data = normalizeProduct(input);
  if (!data.nameBn && !data.nameEn) throw new AppError('err.nameRequired');
  if (!(data.price > 0)) throw new AppError('err.priceRequired');
  return db.transaction('rw', db.products, async () => {
    if (data.barcode) {
      const clash = await db.products.where('barcode').equals(data.barcode).first();
      if (clash && clash.id !== input.id) throw new AppError('err.barcodeTaken', { name: clash.nameBn || clash.nameEn });
    }
    const now = Date.now();
    if (input.id) {
      const existing = await db.products.get(input.id);
      await db.products.put({ ...existing, ...data, id: input.id, updatedAt: now });
      return input.id;
    }
    return db.products.add({ ...data, createdAt: now, updatedAt: now });
  });
}

export const deleteProduct = (id) => db.products.delete(id);

export function findByBarcode(code) {
  const c = String(code ?? '').trim();
  return c ? db.products.where('barcode').equals(c).first() : Promise.resolve(undefined);
}

/** Add (or with a negative delta, remove) stock — e.g. when new goods arrive. */
export async function adjustStock(id, delta) {
  return db.transaction('rw', db.products, async () => {
    const p = await db.products.get(id);
    if (!p) return;
    const next = p.type === 'loose' ? round3((p.stock || 0) + delta) : Math.round((p.stock || 0) + delta);
    await db.products.update(id, { stock: next, updatedAt: Date.now() });
  });
}

export const isLowStock = (p) => (p.stock || 0) <= (p.lowStock ?? DEFAULT_LOW_STOCK[p.type]);

export const productName = (p, lang) =>
  (lang === 'en' ? p.nameEn || p.nameBn : p.nameBn || p.nameEn) || '—';

/** Simple search across both names, category and barcode. */
export function matchesSearch(p, query) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [p.nameBn, p.nameEn, p.category, p.barcode].some((v) => v && String(v).toLowerCase().includes(q));
}
