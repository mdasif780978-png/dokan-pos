import { useEffect, useRef } from 'react';
import { Banknote, Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import { lineAmount } from '../../domain/billing';
import { useI18n } from '../../i18n/I18nProvider';

/** Right-hand bill panel: lines, totals and the big "Take payment" button. */
export function CartPanel({ cart, totals, onEditLine, onSetQty, onRemove, onClear, onPay }) {
  const { t, name, num, qty, money, unitPrice } = useI18n();
  const listRef = useRef(null);
  const count = cart.lines.length;

  // Keep the newest line in view.
  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [count]);

  return (
    <aside className="cart" aria-label={t('bill.title')}>
      <header className="cart-header">
        <h2>{t('bill.title')}</h2>
        {count > 0 && (
          <>
            <span className="muted">{t('bill.items', { n: num(count) })}</span>
            <button type="button" className="btn btn-ghost btn-sm" onClick={onClear}>
              <Trash2 size={20} /> {t('bill.clear')}
            </button>
          </>
        )}
      </header>

      <div className="cart-lines" ref={listRef}>
        {count === 0 ? (
          <div className="cart-empty">
            <ShoppingCart size={56} strokeWidth={1.4} />
            <p>{t('bill.empty')}</p>
          </div>
        ) : (
          cart.lines.map((line) => (
            <div className="cart-line" key={line.productId}>
              <button type="button" className="cart-line-main" onClick={() => onEditLine(line)}>
                <span className="cart-line-name">{name(line)}</span>
                <span className="cart-line-detail">
                  <strong>{qty(line.type, line.qty)}</strong> × {unitPrice(line.type, line.unitPrice)}
                </span>
              </button>
              <div className="cart-line-side">
                <span className="cart-line-amount">{money(lineAmount(line))}</span>
                <div className="cart-line-actions">
                  {line.type === 'packaged' && (
                    <>
                      <button type="button" className="qty-btn" aria-label="−" onClick={() => onSetQty(line, line.qty - 1)}>
                        <Minus size={24} />
                      </button>
                      <button type="button" className="qty-btn" aria-label="+" onClick={() => onSetQty(line, line.qty + 1)}>
                        <Plus size={24} />
                      </button>
                    </>
                  )}
                  <button type="button" className="qty-btn qty-btn-danger" aria-label={t('common.delete')} onClick={() => onRemove(line)}>
                    <Trash2 size={22} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <footer className="cart-footer">
        {(totals.discount > 0 || totals.rounding !== 0) && (
          <div className="cart-row">
            <span>{t('bill.subtotal')}</span>
            <span>{money(totals.subtotal)}</span>
          </div>
        )}
        {totals.discount > 0 && (
          <div className="cart-row">
            <span>{t('bill.discount')}</span>
            <span>-{money(totals.discount)}</span>
          </div>
        )}
        {totals.rounding !== 0 && (
          <div className="cart-row muted">
            <span>{t('bill.rounding')}</span>
            <span>{totals.rounding > 0 ? '+' : '-'}{money(Math.abs(totals.rounding))}</span>
          </div>
        )}
        <div className="cart-total">
          <span>{t('bill.total')}</span>
          <strong>{money(totals.total)}</strong>
        </div>
        <button type="button" className="btn btn-primary btn-xl" disabled={count === 0} onClick={onPay}>
          <Banknote size={30} /> {t('bill.pay')}
        </button>
      </footer>
    </aside>
  );
}
