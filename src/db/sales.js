import { db } from './db';
import { computePayment, computeTotals, lineAmount, round2, round3 } from '../domain/billing';
import { AppError } from '../lib/errors';
import { dayKey } from '../lib/format';

/**
 * Save a sale in one atomic transaction:
 *  1. store the bill
 *  2. reduce stock of every item
 *  3. if not fully paid, add the remaining due to the customer's baki khata
 * Either everything is saved or nothing is.
 */
export async function createSale({ lines, discountMode, discountValue, roundTotal, paid, customerId }) {
  if (!lines?.length) throw new AppError('err.cartEmpty');
  const totals = computeTotals(lines, { discountMode, discountValue, roundTotal });
  const payment = computePayment(totals.total, paid);
  if (payment.due > 0 && !customerId) throw new AppError('err.needCustomer');

  return db.transaction('rw', [db.sales, db.products, db.customers, db.ledger], async () => {
    const now = Date.now();
    const customer = customerId ? await db.customers.get(customerId) : null;
    if (customerId && !customer) throw new AppError('err.customerMissing');

    const items = lines.map((l) => ({
      productId: l.productId,
      nameBn: l.nameBn,
      nameEn: l.nameEn,
      type: l.type,
      unitPrice: l.unitPrice,
      qty: l.qty,
      amount: lineAmount(l),
    }));

    const balanceAfter = customer ? round2((customer.balance || 0) + payment.due) : null;
    const sale = {
      createdAt: now,
      dayKey: dayKey(now),
      items,
      ...totals,
      ...payment,
      customerId: customer?.id ?? null,
      customerName: customer?.name ?? null,
      customerBalanceAfter: balanceAfter,
    };
    const id = await db.sales.add(sale);

    for (const item of items) {
      const product = await db.products.get(item.productId);
      if (!product) continue; // product was deleted meanwhile; the bill keeps its snapshot
      const stock =
        product.type === 'loose' ? round3((product.stock || 0) - item.qty) : Math.round((product.stock || 0) - item.qty);
      await db.products.update(product.id, { stock, updatedAt: now });
    }

    if (payment.due > 0) {
      await db.ledger.add({ customerId: customer.id, type: 'credit', amount: payment.due, saleId: id, note: '', createdAt: now });
      await db.customers.update(customer.id, { balance: balanceAfter, updatedAt: now });
    }

    return { ...sale, id };
  });
}

export const getSale = (id) => db.sales.get(id);
