import { beforeEach, describe, expect, it } from 'vitest';
import { db } from './db';
import { DEMO_ITEMS, loadDemoItems } from './demoItems';
import { clearAllData, importBackup } from './backup';
import { ITEM_ICONS } from '../components/itemIcons';
import { createOwner, loadAuthState } from '../auth/localAuth';

beforeEach(async () => {
  await Promise.all(db.tables.map((t) => t.clear()));
});

describe('demo items', () => {
  it('has about 20 complete items, each with an offline icon', () => {
    expect(DEMO_ITEMS.length).toBe(20);
    for (const item of DEMO_ITEMS) {
      expect(item.nameBn && item.nameEn).toBeTruthy();
      expect(['loose', 'packaged']).toContain(item.type);
      expect(item.price).toBeGreaterThan(0);
      expect(item.stock).toBeGreaterThan(0);
      expect(ITEM_ICONS[item.icon]).toBeTruthy();
    }
  });

  it('loads once and skips items that already exist', async () => {
    expect(await loadDemoItems()).toBe(20);
    expect(await loadDemoItems()).toBe(0);
    expect(await db.products.count()).toBe(20);
  });
});

describe('clear all data / restore', () => {
  it('clear all data also removes the owner account', async () => {
    await createOwner({ ownerName: 'A', phone: '01711223344', pin: '1234', pinConfirm: '1234' });
    await loadDemoItems();
    await clearAllData();
    expect(await db.products.count()).toBe(0);
    expect(await loadAuthState()).toEqual({ owner: null, session: null });
  });

  it('restoring a backup keeps this device account and PIN', async () => {
    await createOwner({ ownerName: 'A', phone: '01711223344', pin: '1234', pinConfirm: '1234' });
    const backup = { app: 'dokan-pos', schema: 1, tables: { products: [{ id: 7, nameBn: 'চাল', type: 'loose', price: 70, stock: 1 }] } };
    await importBackup({ text: async () => JSON.stringify(backup) });
    expect(await db.products.count()).toBe(1);
    const state = await loadAuthState();
    expect(state.owner.ownerName).toBe('A');
    expect(state.session).toBeTruthy();
  });
});
