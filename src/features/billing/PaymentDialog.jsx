import { useState } from 'react';
import { BookUser, Check } from 'lucide-react';
import { Modal } from '../../components/Modal';
import { NumPad } from '../../components/NumPad';
import { Segmented } from '../../components/Segmented';
import { useShowError } from '../../components/Feedback';
import { useI18n } from '../../i18n/I18nProvider';
import { useSettings } from '../../db/settings';
import { createSale } from '../../db/sales';
import { computePayment, computeTotals, quickCashOptions } from '../../domain/billing';
import { parseNum } from '../../lib/format';
import { AppError } from '../../lib/errors';
import { CustomerPicker } from './CustomerPicker';

/**
 * Discount, cash received, change and (optional) credit to a customer's khata.
 * The NumPad types into whichever field is highlighted.
 * Leaving "received" untouched means the exact amount was paid — one tap for a normal cash sale.
 */
export function PaymentDialog({ cart, dispatch, onDone, onClose }) {
  const { t, money, digits } = useI18n();
  const settings = useSettings();
  const showError = useShowError();
  const [field, setField] = useState('received');
  const [received, setReceived] = useState('');
  const [discountText, setDiscountText] = useState(cart.discountValue ? String(cart.discountValue) : '');
  const [customer, setCustomer] = useState(null);
  const [picking, setPicking] = useState(false);
  const [saving, setSaving] = useState(false);

  const totals = computeTotals(cart.lines, { ...cart, roundTotal: settings.roundTotal });
  const paidAmount = received === '' ? totals.total : parseNum(received);
  const pay = computePayment(totals.total, paidAmount);

  const setDiscount = (text) => {
    setDiscountText(text);
    dispatch({ type: 'setDiscount', mode: cart.discountMode, value: parseNum(text) });
  };
  const setDiscountMode = (mode) => dispatch({ type: 'setDiscount', mode, value: parseNum(discountText) });

  const complete = async () => {
    if (saving) return;
    if (pay.due > 0 && !customer) {
      showError(new AppError('err.needCustomer'));
      setPicking(true);
      return;
    }
    setSaving(true);
    try {
      const sale = await createSale({
        lines: cart.lines,
        discountMode: cart.discountMode,
        discountValue: cart.discountValue,
        roundTotal: settings.roundTotal,
        paid: paidAmount,
        customerId: customer?.id,
      });
      onDone(sale);
    } catch (e) {
      showError(e);
      setSaving(false);
    }
  };

  if (picking) {
    return (
      <Modal title={t('pay.chooseCustomer')} size="xl" onClose={() => setPicking(false)}>
        <CustomerPicker
          selectedId={customer?.id}
          onBack={() => setPicking(false)}
          onSelect={(c) => {
            setCustomer(c);
            setPicking(false);
          }}
        />
      </Modal>
    );
  }

  return (
    <Modal
      title={t('pay.title')}
      size="xl"
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn btn-lg" onClick={onClose}>
            {t('common.cancel')}
          </button>
          <button type="button" className="btn btn-xl btn-primary" disabled={saving} onClick={complete}>
            <Check size={30} /> {t('pay.complete')}
          </button>
        </>
      }
    >
      <div className="pay-layout">
        <div className="pay-info">
          <div className="pay-total">
            <span>{t('bill.total')}</span>
            <strong>{money(totals.total)}</strong>
          </div>
          {(totals.discount > 0 || totals.rounding !== 0) && (
            <div className="muted pay-subline">
              {t('bill.subtotal')} {money(totals.subtotal)}
              {totals.rounding !== 0 && ` · ${t('bill.rounding')} ${totals.rounding > 0 ? '+' : '-'}${money(Math.abs(totals.rounding))}`}
            </div>
          )}

          <button type="button" className={`field ${field === 'discount' ? 'field-active' : ''}`} onClick={() => setField('discount')}>
            <span className="field-label">{t('bill.discount')}</span>
            <span className="field-value">
              {discountText ? `${cart.discountMode === 'percent' ? '' : settings.currency}${digits(discountText)}${cart.discountMode === 'percent' ? '%' : ''}` : t('pay.noDiscount')}
            </span>
            {cart.discountMode === 'percent' && totals.discount > 0 && <span className="field-hint">-{money(totals.discount)}</span>}
          </button>
          {field === 'discount' && (
            <Segmented
              options={[
                { value: 'amount', label: t('pay.discountAmount') },
                { value: 'percent', label: t('pay.discountPercent') },
              ]}
              value={cart.discountMode}
              onChange={setDiscountMode}
            />
          )}

          <button type="button" className={`field ${field === 'received' ? 'field-active' : ''}`} onClick={() => setField('received')}>
            <span className="field-label">{t('pay.received')}</span>
            <span className={`field-value ${received === '' ? 'muted' : ''}`}>{money(paidAmount)}</span>
          </button>
          <div className="presets">
            {quickCashOptions(totals.total).map((v) => (
              <button
                key={v}
                type="button"
                className="btn preset"
                onClick={() => {
                  setField('received');
                  setReceived(String(v));
                }}
              >
                {money(v)}
              </button>
            ))}
            <button
              type="button"
              className="btn preset preset-due"
              onClick={() => {
                setField('received');
                setReceived('0');
              }}
            >
              {t('pay.allDue')}
            </button>
          </div>

          {pay.change > 0 && (
            <div className="pay-result pay-change">
              <span>{t('pay.change')}</span>
              <strong>{money(pay.change)}</strong>
            </div>
          )}
          {pay.due > 0 && (
            <div className="pay-result pay-due">
              <span>{t('pay.due')}</span>
              <strong>{money(pay.due)}</strong>
            </div>
          )}

          <button
            type="button"
            className={`customer-btn ${pay.due > 0 && !customer ? 'customer-btn-needed' : ''}`}
            onClick={() => setPicking(true)}
          >
            <BookUser size={28} />
            <span className="customer-btn-text">
              <span className="field-label">{t('pay.customer')}</span>
              <span>{customer ? customer.name : t('pay.walkIn')}</span>
            </span>
            {customer?.balance > 0 && <span className="due-text">{t('pay.currentDue', { amount: money(customer.balance) })}</span>}
          </button>
        </div>

        <NumPad
          value={field === 'received' ? received : discountText}
          onChange={field === 'received' ? setReceived : setDiscount}
          onEnter={complete}
          maxDecimals={2}
        />
      </div>
    </Modal>
  );
}
