import { db } from './db';

/**
 * 20 common Bangladeshi grocery items, so a new shop can start selling right away.
 * Prices are typical Dhaka retail prices (Taka) and only a starting point: edit them
 * on the Products page. `icon` is a bundled offline icon (src/components/itemIcons.jsx);
 * add a photo to any product to replace it.
 *
 * loose    = price per kg, stock in kg
 * packaged = price per piece, stock in pieces
 */
export const DEMO_ITEMS = [
  { icon: 'rice', nameBn: 'মিনিকেট চাল', nameEn: 'Miniket Rice', category: 'চাল-ডাল', type: 'loose', price: 78, stock: 50, lowStock: 10 },
  { icon: 'riceSack', nameBn: 'মোটা চাল', nameEn: 'Coarse Rice', category: 'চাল-ডাল', type: 'loose', price: 58, stock: 40, lowStock: 10 },
  { icon: 'lentil', nameBn: 'মসুর ডাল', nameEn: 'Red Lentil (Masoor Dal)', category: 'চাল-ডাল', type: 'loose', price: 115, stock: 20, lowStock: 5 },
  { icon: 'atta', nameBn: 'আটা', nameEn: 'Atta (Wheat Flour)', category: 'চাল-ডাল', type: 'loose', price: 55, stock: 25, lowStock: 5 },
  { icon: 'sugar', nameBn: 'চিনি', nameEn: 'Sugar', category: 'মুদি', type: 'loose', price: 125, stock: 20, lowStock: 5 },
  { icon: 'onion', nameBn: 'পেঁয়াজ', nameEn: 'Onion', category: 'সবজি', type: 'loose', price: 80, stock: 30, lowStock: 5 },
  { icon: 'potato', nameBn: 'আলু', nameEn: 'Potato', category: 'সবজি', type: 'loose', price: 40, stock: 30, lowStock: 5 },
  { icon: 'garlic', nameBn: 'রসুন', nameEn: 'Garlic', category: 'সবজি', type: 'loose', price: 220, stock: 5, lowStock: 1 },
  { icon: 'ginger', nameBn: 'আদা', nameEn: 'Ginger', category: 'সবজি', type: 'loose', price: 240, stock: 1.5, lowStock: 2 },
  { icon: 'chili', nameBn: 'কাঁচা মরিচ', nameEn: 'Green Chili', category: 'সবজি', type: 'loose', price: 120, stock: 3, lowStock: 1 },
  { icon: 'salt', nameBn: 'লবণ ১ কেজি', nameEn: 'Salt 1 kg', category: 'মুদি', type: 'packaged', price: 42, stock: 24, lowStock: 6 },
  { icon: 'oil', nameBn: 'সয়াবিন তেল ১ লিটার', nameEn: 'Soybean Oil 1 L', category: 'তেল', type: 'packaged', price: 189, stock: 24, lowStock: 6 },
  { icon: 'mustardOil', nameBn: 'সরিষার তেল ৫০০ মিলি', nameEn: 'Mustard Oil 500 ml', category: 'তেল', type: 'packaged', price: 175, stock: 12, lowStock: 4 },
  { icon: 'egg', nameBn: 'ডিম', nameEn: 'Egg', category: 'ডিম-দুধ', type: 'packaged', price: 13, stock: 120, lowStock: 30 },
  { icon: 'milk', nameBn: 'গুঁড়া দুধ ৫০০ গ্রাম', nameEn: 'Milk Powder 500 g', category: 'ডিম-দুধ', type: 'packaged', price: 450, stock: 3, lowStock: 4 },
  { icon: 'tea', nameBn: 'চা পাতা ২০০ গ্রাম', nameEn: 'Tea Leaves 200 g', category: 'মুদি', type: 'packaged', price: 140, stock: 12, lowStock: 4 },
  { icon: 'biscuit', nameBn: 'বিস্কুট', nameEn: 'Biscuits', category: 'নাস্তা', type: 'packaged', price: 20, stock: 48, lowStock: 12 },
  { icon: 'noodles', nameBn: 'নুডলস', nameEn: 'Instant Noodles', category: 'নাস্তা', type: 'packaged', price: 25, stock: 36, lowStock: 12 },
  { icon: 'soap', nameBn: 'গোসলের সাবান', nameEn: 'Bath Soap', category: 'প্রসাধনী', type: 'packaged', price: 60, stock: 20, lowStock: 5 },
  { icon: 'detergent', nameBn: 'ডিটারজেন্ট ৫০০ গ্রাম', nameEn: 'Detergent Powder 500 g', category: 'ধোয়ামোছা', type: 'packaged', price: 80, stock: 15, lowStock: 5 },
];

const sameName = (a, b) =>
  (a.nameBn && a.nameBn === b.nameBn) || (a.nameEn && a.nameEn.toLowerCase() === (b.nameEn || '').toLowerCase());

/** Add the demo items, skipping any that already exist (by name). Returns how many were added. */
export async function loadDemoItems() {
  return db.transaction('rw', db.products, async () => {
    const existing = await db.products.toArray();
    const now = Date.now();
    const toAdd = DEMO_ITEMS.filter((item) => !existing.some((p) => sameName(p, item))).map((item) => ({
      ...item,
      createdAt: now,
      updatedAt: now,
    }));
    if (toAdd.length) await db.products.bulkAdd(toAdd);
    return toAdd.length;
  });
}
