import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { ArrowLeft, HandCoins, Pencil, Phone, Printer, Trash2, NotebookPen } from 'lucide-react';
import { db } from '../../db/db';
import { addLedgerEntry, deleteCustomer } from '../../db/customers';
import { getSale } from '../../db/sales';
import { round2 } from '../../domain/billing';
import { useI18n } from '../../i18n/I18nProvider';
import { useConfirm, useShowError, useToast } from '../../components/Feedback';
import { NumberDialog } from '../../components/NumberDialog';
import { usePrint } from '../../print/PrintProvider';
import { formatDateTime } from '../../lib/format';
import { CustomerForm } from './CustomerForm';
import { BalanceText } from './KhataPage';

export default function CustomerPage() {
  const { id } = useParams();
  const customerId = Number(id);
  const { t, lang, money, num, digits } = useI18n();
  const navigate = useNavigate();
  const toast = useToast();
  const confirm = useConfirm();
  const showError = useShowError();
  const print = usePrint();
  const customer = useLiveQuery(() => db.customers.get(customerId).then((c) => c ?? null), [customerId]);
  const entries = useLiveQuery(
    () => db.ledger.where('customerId').equals(customerId).reverse().sortBy('createdAt'),
    [customerId],
    [],
  );
  const [entryDialog, setEntryDialog] = useState(null); // 'payment' | 'credit'
  const [note, setNote] = useState('');
  const [editing, setEditing] = useState(false);

  if (customer === undefined) return null;
  if (customer === null) {
    return (
      <div className="page">
        <Link to="/khata" className="btn btn-lg">
          <ArrowLeft size={24} /> {t('khata.back')}
        </Link>
      </div>
    );
  }

  const balance = customer.balance || 0;

  const remove = async () => {
    if (!(await confirm({ message: t('khata.deleteConfirm', { name: customer.name }), danger: true, confirmText: t('common.delete') }))) return;
    try {
      await deleteCustomer(customer.id);
      toast(t('common.deleted'));
      navigate('/khata', { replace: true });
    } catch (e) {
      showError(e);
    }
  };

  const reprint = async (saleId) => {
    const sale = await getSale(saleId);
    if (sale) print(sale);
  };

  return (
    <div className="page">
      <header className="page-header">
        <Link to="/khata" className="btn btn-lg" aria-label={t('khata.back')}>
          <ArrowLeft size={26} />
        </Link>
        <h1>{customer.name}</h1>
        <span className="spacer" />
        {customer.phone && (
          <a className="btn btn-lg" href={`tel:${customer.phone}`}>
            <Phone size={24} /> {digits(customer.phone)}
          </a>
        )}
        <button type="button" className="btn btn-lg" onClick={() => setEditing(true)} aria-label={t('common.edit')}>
          <Pencil size={24} />
        </button>
        <button type="button" className="btn btn-lg btn-danger-ghost" onClick={remove} aria-label={t('common.delete')}>
          <Trash2 size={24} />
        </button>
      </header>

      <div className="customer-summary">
        <div className={`stat-card ${balance > 0 ? 'stat-due' : 'stat-ok'}`}>
          <span>{balance > 0 ? t('khata.due') : balance < 0 ? t('khata.advance') : t('khata.noDue')}</span>
          <strong>{money(Math.abs(balance))}</strong>
        </div>
        <div className="customer-actions">
          <button type="button" className="btn btn-xl btn-primary" onClick={() => { setNote(''); setEntryDialog('payment'); }}>
            <HandCoins size={30} /> {t('khata.receive')}
          </button>
          <button type="button" className="btn btn-xl" onClick={() => { setNote(''); setEntryDialog('credit'); }}>
            <NotebookPen size={28} /> {t('khata.addDue')}
          </button>
        </div>
      </div>

      <h2 className="section-title">{t('khata.history')}</h2>
      {entries.length === 0 ? (
        <p className="muted">{t('khata.noHistory')}</p>
      ) : (
        <div className="list">
          {entries.map((e) => (
            <div key={e.id} className="list-row static">
              <span className="list-main">
                <span className="list-title">
                  {e.type === 'payment'
                    ? t('khata.entryPayment')
                    : e.saleId
                      ? t('khata.entryCreditBill', { n: num(e.saleId, { max: 0 }) })
                      : t('khata.entryCredit')}
                </span>
                <span className="list-sub">
                  {formatDateTime(e.createdAt, lang)}
                  {e.note && ` · ${e.note}`}
                </span>
              </span>
              {e.saleId && (
                <button type="button" className="btn" onClick={() => reprint(e.saleId)} aria-label={t('report.reprint')}>
                  <Printer size={22} />
                </button>
              )}
              <span className={`ledger-amount ${e.type === 'payment' ? 'ok-text' : 'due-text'}`}>
                {e.type === 'payment' ? '−' : '+'}
                {money(e.amount)}
              </span>
            </div>
          ))}
        </div>
      )}

      {entryDialog && (
        <NumberDialog
          title={t(entryDialog === 'payment' ? 'khata.receiveTitle' : 'khata.addDueTitle', { name: customer.name })}
          info={<BalanceText balance={balance} />}
          unit={t('unit.taka')}
          initial={entryDialog === 'payment' && balance > 0 ? String(balance) : ''}
          presets={entryDialog === 'payment' ? [100, 200, 500, 1000] : []}
          formatPreset={(v) => money(v)}
          preview={(n) => (
            <>
              {t('khata.balanceAfter')}: <strong>{money(round2(balance + (entryDialog === 'payment' ? -n : n)))}</strong>
            </>
          )}
          submitLabel={entryDialog === 'payment' ? t('khata.receive') : t('khata.addDue')}
          onClose={() => setEntryDialog(null)}
          onSubmit={async (n) => {
            await addLedgerEntry(customer.id, entryDialog, n, note);
            toast(t(entryDialog === 'payment' ? 'khata.paymentSaved' : 'khata.dueSaved'), 'success');
            setEntryDialog(null);
          }}
        >
          <label className="field-block">
            <span>{t('common.note')}</span>
            <input value={note} onChange={(e) => setNote(e.target.value)} />
          </label>
        </NumberDialog>
      )}

      {editing && <CustomerForm customer={customer} onClose={() => setEditing(false)} />}
    </div>
  );
}
