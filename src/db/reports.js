import { db } from './db';
import { round2, round3 } from '../domain/billing';
import { dayRange } from '../lib/format';

/** Everything the daily report screen needs for one day. */
export async function getDayReport(key) {
  const [start, end] = dayRange(key);
  const [sales, ledger] = await Promise.all([
    db.sales.where('dayKey').equals(key).reverse().sortBy('createdAt'),
    db.ledger.where('createdAt').between(start, end, true, false).toArray(),
  ]);

  const sum = (arr, f) => round2(arr.reduce((s, x) => s + f(x), 0));
  const totalSales = sum(sales, (s) => s.total);
  const creditGiven = sum(sales, (s) => s.due);
  const cashFromSales = round2(totalSales - creditGiven);
  const duePayments = sum(ledger.filter((e) => e.type === 'payment'), (e) => e.amount);

  const byProduct = new Map();
  for (const sale of sales) {
    for (const item of sale.items) {
      const key2 = item.productId ?? item.nameBn ?? item.nameEn;
      const row = byProduct.get(key2) || { productId: item.productId, nameBn: item.nameBn, nameEn: item.nameEn, type: item.type, qty: 0, amount: 0 };
      row.qty = round3(row.qty + item.qty);
      row.amount = round2(row.amount + item.amount);
      byProduct.set(key2, row);
    }
  }
  const topItems = [...byProduct.values()].sort((a, b) => b.amount - a.amount).slice(0, 10);

  return {
    sales,
    billCount: sales.length,
    totalSales,
    discount: sum(sales, (s) => s.discount),
    creditGiven,
    cashFromSales,
    duePayments,
    cashInHand: round2(cashFromSales + duePayments),
    topItems,
  };
}
