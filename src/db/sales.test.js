import { beforeEach, describe, expect, it } from 'vitest';
import { db } from './db';
import { createSale } from './sales';
import { addLedgerEntry, deleteCustomer, saveCustomer } from './customers';
import { saveProduct } from './products';
import { getDayReport } from './reports';
import { lineFromProduct } from '../domain/billing';

beforeEach(async () => {
  await Promise.all(db.tables.map((t) => t.clear()));
});

async function setup() {
  const riceId = await saveProduct({ nameBn: 'চাল', type: 'loose', price: 78, stock: 10 });
  const oilId = await saveProduct({ nameBn: 'তেল', type: 'packaged', price: 189, stock: 5, barcode: '123' });
  const rice = await db.products.get(riceId);
  const oil = await db.products.get(oilId);
  return { rice, oil, lines: [lineFromProduct(rice, 2.5), lineFromProduct(oil, 2)] };
}

describe('createSale', () => {
  it('saves the bill and reduces stock', async () => {
    const { rice, oil, lines } = await setup();
    const sale = await createSale({ lines, roundTotal: true, paid: 600 });
    expect(sale.total).toBe(573);
    expect(sale.change).toBe(27);
    expect((await db.products.get(rice.id)).stock).toBe(7.5);
    expect((await db.products.get(oil.id)).stock).toBe(3);
  });

  it('puts the unpaid part on the customer khata', async () => {
    const { lines } = await setup();
    const customerId = await saveCustomer({ name: 'রহিম', phone: '01711000000' });
    const sale = await createSale({ lines, roundTotal: true, paid: 300, customerId });
    expect(sale.due).toBe(273);
    expect(sale.customerBalanceAfter).toBe(273);
    expect((await db.customers.get(customerId)).balance).toBe(273);
    const entries = await db.ledger.where('customerId').equals(customerId).toArray();
    expect(entries).toMatchObject([{ type: 'credit', amount: 273, saleId: sale.id }]);

    await addLedgerEntry(customerId, 'payment', 200);
    expect((await db.customers.get(customerId)).balance).toBe(73);
    await expect(deleteCustomer(customerId)).rejects.toMatchObject({ code: 'err.customerHasDue' });
  });

  it('refuses credit without a customer and changes nothing', async () => {
    const { rice, lines } = await setup();
    await expect(createSale({ lines, paid: 100 })).rejects.toMatchObject({ code: 'err.needCustomer' });
    expect(await db.sales.count()).toBe(0);
    expect((await db.products.get(rice.id)).stock).toBe(10);
  });

  it('rejects duplicate barcodes', async () => {
    await setup();
    await expect(saveProduct({ nameBn: 'অন্য', type: 'packaged', price: 10, barcode: '123' })).rejects.toMatchObject({
      code: 'err.barcodeTaken',
    });
  });
});

describe('daily report', () => {
  it('sums sales, credit, collections and top items', async () => {
    const { lines } = await setup();
    const customerId = await saveCustomer({ name: 'করিম' });
    const s1 = await createSale({ lines, roundTotal: true, paid: 573 });
    await createSale({ lines: [lines[1]], roundTotal: true, paid: 0, customerId });
    await addLedgerEntry(customerId, 'payment', 100);

    const r = await getDayReport(s1.dayKey);
    expect(r.billCount).toBe(2);
    expect(r.totalSales).toBe(951);
    expect(r.creditGiven).toBe(378);
    expect(r.cashFromSales).toBe(573);
    expect(r.duePayments).toBe(100);
    expect(r.cashInHand).toBe(673);
    expect(r.topItems[0]).toMatchObject({ nameBn: 'তেল', qty: 4, amount: 756 });
  });
});
