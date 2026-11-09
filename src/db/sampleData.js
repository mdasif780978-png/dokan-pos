import { db } from './db';

/** A few common Bangladeshi grocery items so a new shop can try the app immediately. */
const SAMPLE_PRODUCTS = [
  { nameBn: 'মিনিকেট চাল', nameEn: 'Miniket Rice', category: 'চাল-ডাল', type: 'loose', price: 78, stock: 50, lowStock: 10 },
  { nameBn: 'মোটা চাল', nameEn: 'Coarse Rice', category: 'চাল-ডাল', type: 'loose', price: 58, stock: 40, lowStock: 10 },
  { nameBn: 'মসুর ডাল', nameEn: 'Red Lentil', category: 'চাল-ডাল', type: 'loose', price: 110, stock: 15, lowStock: 3 },
  { nameBn: 'চিনি', nameEn: 'Sugar', category: 'মুদি', type: 'loose', price: 125, stock: 12, lowStock: 3 },
  { nameBn: 'পেঁয়াজ', nameEn: 'Onion', category: 'সবজি', type: 'loose', price: 80, stock: 20, lowStock: 5 },
  { nameBn: 'আলু', nameEn: 'Potato', category: 'সবজি', type: 'loose', price: 45, stock: 1.5, lowStock: 5 },
  { nameBn: 'রসুন', nameEn: 'Garlic', category: 'সবজি', type: 'loose', price: 220, stock: 4, lowStock: 1 },
  { nameBn: 'সয়াবিন তেল ১ লিটার', nameEn: 'Soybean Oil 1L', category: 'তেল', type: 'packaged', price: 189, stock: 24, lowStock: 6, barcode: '8941100500019' },
  { nameBn: 'লবণ ১ কেজি', nameEn: 'Salt 1kg', category: 'মুদি', type: 'packaged', price: 42, stock: 30, lowStock: 6 },
  { nameBn: 'ডিম', nameEn: 'Egg', category: 'ডিম-দুধ', type: 'packaged', price: 13, stock: 90, lowStock: 24 },
  { nameBn: 'গুঁড়া দুধ ৫০০ গ্রাম', nameEn: 'Milk Powder 500g', category: 'ডিম-দুধ', type: 'packaged', price: 450, stock: 3, lowStock: 4 },
  { nameBn: 'চা পাতা ২০০ গ্রাম', nameEn: 'Tea 200g', category: 'মুদি', type: 'packaged', price: 120, stock: 15, lowStock: 4 },
  { nameBn: 'বিস্কুট', nameEn: 'Biscuit', category: 'নাস্তা', type: 'packaged', price: 20, stock: 48, lowStock: 12 },
  { nameBn: 'সাবান', nameEn: 'Soap', category: 'প্রসাধনী', type: 'packaged', price: 55, stock: 20, lowStock: 5 },
];

export async function loadSampleProducts() {
  const now = Date.now();
  await db.products.bulkAdd(SAMPLE_PRODUCTS.map((p) => ({ ...p, createdAt: now, updatedAt: now })));
}
