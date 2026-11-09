import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { BookUser, ChevronRight, Search, UserPlus } from 'lucide-react';
import { db } from '../../db/db';
import { round2 } from '../../domain/billing';
import { useI18n } from '../../i18n/I18nProvider';
import { EmptyState } from '../../components/EmptyState';
import { Segmented } from '../../components/Segmented';
import { CustomerForm } from './CustomerForm';

export function BalanceText({ balance }) {
  const { t, money } = useI18n();
  if (balance > 0) return <span className="due-text">{t('khata.due')} {money(balance)}</span>;
  if (balance < 0) return <span className="ok-text">{t('khata.advance')} {money(-balance)}</span>;
  return <span className="muted">{t('khata.noDue')}</span>;
}

export default function KhataPage() {
  const { t, money, digits, lang } = useI18n();
  const navigate = useNavigate();
  const customers = useLiveQuery(() => db.customers.toArray(), []);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('due');
  const [adding, setAdding] = useState(false);

  const totalDue = round2((customers || []).reduce((s, c) => s + Math.max(0, c.balance || 0), 0));
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (customers || [])
      .filter((c) => !q || c.name.toLowerCase().includes(q) || (c.phone || '').includes(q))
      .sort((a, b) => (sort === 'due' ? (b.balance || 0) - (a.balance || 0) : 0) || a.name.localeCompare(b.name, lang === 'bn' ? 'bn' : 'en'));
  }, [customers, query, sort, lang]);

  return (
    <div className="page">
      <header className="page-header">
        <h1>{t('khata.title')}</h1>
        <span className="spacer" />
        <button type="button" className="btn btn-lg btn-primary" onClick={() => setAdding(true)}>
          <UserPlus size={26} /> {t('khata.addCustomer')}
        </button>
      </header>

      <div className="stat-cards">
        <div className="stat-card stat-due">
          <span>{t('khata.totalDue')}</span>
          <strong>{money(totalDue)}</strong>
        </div>
      </div>

      {customers && customers.length === 0 ? (
        <EmptyState icon={BookUser} text={t('khata.empty')}>
          <button type="button" className="btn btn-lg btn-primary" onClick={() => setAdding(true)}>
            <UserPlus size={26} /> {t('khata.addCustomer')}
          </button>
        </EmptyState>
      ) : (
        <>
          <div className="toolbar">
            <label className="search">
              <Search size={26} />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t('khata.searchCustomer')} />
            </label>
            <Segmented
              options={[
                { value: 'due', label: t('khata.sortDue') },
                { value: 'name', label: t('khata.name') },
              ]}
              value={sort}
              onChange={setSort}
            />
          </div>
          <div className="list">
            {visible.map((c) => (
              <button key={c.id} type="button" className="list-row" onClick={() => navigate(`/khata/${c.id}`)}>
                <span className="avatar">{Array.from(c.name)[0]}</span>
                <span className="list-main">
                  <span className="list-title">{c.name}</span>
                  {c.phone && <span className="list-sub">{digits(c.phone)}</span>}
                </span>
                <span className="list-side">
                  <BalanceText balance={c.balance || 0} />
                </span>
                <ChevronRight size={28} className="muted" />
              </button>
            ))}
          </div>
        </>
      )}

      {adding && <CustomerForm onClose={() => setAdding(false)} />}
    </div>
  );
}
