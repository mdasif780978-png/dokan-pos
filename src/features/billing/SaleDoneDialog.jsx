import { CircleCheck, Printer } from 'lucide-react';
import { Modal } from '../../components/Modal';
import { useI18n } from '../../i18n/I18nProvider';
import { useSettings } from '../../db/settings';
import { usePrint } from '../../print/PrintProvider';
import { Receipt } from '../../print/Receipt';

/** Shown after a sale: how much change to give, receipt preview and Print button. */
export function SaleDoneDialog({ sale, onClose }) {
  const { t, num, money } = useI18n();
  const settings = useSettings();
  const print = usePrint();

  return (
    <Modal
      title={t('sale.done')}
      size="lg"
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn btn-lg" onClick={() => print(sale)}>
            <Printer size={26} /> {t('sale.print')}
          </button>
          <button type="button" className="btn btn-lg btn-primary" onClick={onClose} autoFocus>
            {t('sale.newBill')}
          </button>
        </>
      }
    >
      <div className="done-layout">
        <div className="done-summary">
          <CircleCheck size={72} className="ok-icon" />
          <div className="muted">{t('sale.billNo', { n: num(sale.id, { max: 0 }) })}</div>
          <div className="done-total">{money(sale.total)}</div>
          {sale.change > 0 && (
            <div className="pay-result pay-change">
              <span>{t('pay.change')}</span>
              <strong>{money(sale.change)}</strong>
            </div>
          )}
          {sale.due > 0 && (
            <div className="pay-result pay-due">
              <span>
                {t('pay.due')} — {sale.customerName}
              </span>
              <strong>{money(sale.due)}</strong>
            </div>
          )}
        </div>
        <div className="receipt-preview">
          <Receipt sale={sale} settings={settings} />
        </div>
      </div>
    </Modal>
  );
}
