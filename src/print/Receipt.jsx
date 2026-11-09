import { makeI18n } from '../i18n/I18nProvider';
import { formatDateTime } from '../lib/format';

/**
 * Thermal-printer receipt. Always printed in Bangla (with Bangla digits),
 * whatever the screen language is. Width follows settings.paperWidth (58/80 mm).
 */
export function Receipt({ sale, settings }) {
  const i = makeI18n('bn', settings.currency);
  const row = (label, value, cls = '') => (
    <div className={`r-row ${cls}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );

  return (
    <div className="receipt" style={{ '--paper': `${settings.paperWidth}mm` }}>
      <div className="r-shop">{settings.shopName}</div>
      {settings.address && <div className="r-center">{settings.address}</div>}
      {settings.phone && <div className="r-center">{i.t('receipt.phone')}: {i.digits(settings.phone)}</div>}
      {sale.test && <div className="r-center r-bold">— {i.t('receipt.test')} —</div>}
      <div className="r-sep" />
      {row(`${i.t('receipt.billNo')}: ${i.num(sale.id ?? 0, { max: 0 })}`, '')}
      <div>{i.t('receipt.date')}: {formatDateTime(sale.createdAt, 'bn')}</div>
      {sale.customerName && (
        <div>
          {i.t('receipt.customer')}: {sale.customerName}
        </div>
      )}
      <div className="r-sep" />
      <div className="r-row r-bold">
        <span>{i.t('receipt.item')}</span>
        <span>{i.t('receipt.amount')}</span>
      </div>
      {sale.items.map((item, idx) => (
        <div className="r-item" key={idx}>
          <div>{item.nameBn || item.nameEn}</div>
          {row(`  ${i.qty(item.type, item.qty)} × ${i.num(item.unitPrice)}`, i.num(item.amount, { min: 0, max: 2 }), 'r-sub')}
        </div>
      ))}
      <div className="r-sep" />
      {(sale.discount > 0 || sale.rounding !== 0) && row(i.t('bill.subtotal'), i.money(sale.subtotal))}
      {sale.discount > 0 && row(i.t('bill.discount'), `-${i.money(sale.discount)}`)}
      {sale.rounding !== 0 && row(i.t('bill.rounding'), `${sale.rounding > 0 ? '+' : '-'}${i.money(Math.abs(sale.rounding))}`)}
      {row(i.t('bill.total'), i.money(sale.total), 'r-total')}
      {row(i.t('receipt.paid'), i.money(sale.paid))}
      {sale.change > 0 && row(i.t('pay.change'), i.money(sale.change))}
      {sale.due > 0 && row(i.t('khata.due'), i.money(sale.due), 'r-bold')}
      {sale.customerName && sale.customerBalanceAfter > 0 && row(i.t('receipt.totalDue'), i.money(sale.customerBalanceAfter), 'r-bold')}
      <div className="r-sep" />
      {settings.receiptFooter && <div className="r-center r-footer">{settings.receiptFooter}</div>}
    </div>
  );
}

/** A fake sale for the "Test print" button in Settings. */
export function testSale() {
  return {
    id: 0,
    test: true,
    createdAt: Date.now(),
    items: [
      { nameBn: 'মিনিকেট চাল', type: 'loose', qty: 2.5, unitPrice: 78, amount: 195 },
      { nameBn: 'পেঁয়াজ', type: 'loose', qty: 0.5, unitPrice: 80, amount: 40 },
      { nameBn: 'সয়াবিন তেল ১ লিটার', type: 'packaged', qty: 1, unitPrice: 189, amount: 189 },
    ],
    subtotal: 424,
    discount: 4,
    rounding: 0,
    total: 420,
    paid: 500,
    change: 80,
    due: 0,
  };
}
