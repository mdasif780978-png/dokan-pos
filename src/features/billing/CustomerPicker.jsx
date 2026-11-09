import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { ArrowLeft, Search, UserPlus, Users } from 'lucide-react';
import { db } from '../../db/db';
import { saveCustomer } from '../../db/customers';
import { useShowError } from '../../components/Feedback';
import { useI18n } from '../../i18n/I18nProvider';

/** Choose (or quickly add) the customer whose khata gets the unpaid amount. */
export function CustomerPicker({ selectedId, onSelect, onBack }) {
  const { t, money, digits } = useI18n();
  const showError = useShowError();
  const customers = useLiveQuery(() => db.customers.orderBy('name').toArray(), [], []);
  const [query, setQuery] = useState('');
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '' });

  const q = query.trim().toLowerCase();
  const list = customers.filter((c) => !q || c.name.toLowerCase().includes(q) || (c.phone || '').includes(q));

  const add = async (e) => {
    e.preventDefault();
    try {
      const id = await saveCustomer(form);
      onSelect(await db.customers.get(id));
    } catch (err) {
      showError(err);
    }
  };

  return (
    <div className="customer-picker">
      <div className="toolbar">
        <button type="button" className="btn btn-lg" onClick={onBack}>
          <ArrowLeft size={24} />
        </button>
        <label className="search">
          <Search size={24} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t('khata.searchCustomer')} />
        </label>
        <button type="button" className="btn btn-lg btn-primary" onClick={() => setAdding((v) => !v)}>
          <UserPlus size={24} /> {t('khata.addCustomer')}
        </button>
      </div>

      {adding && (
        <form className="inline-form" onSubmit={add}>
          <input
            autoFocus
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder={t('khata.name')}
          />
          <input
            value={form.phone}
            inputMode="tel"
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder={t('khata.phone')}
          />
          <button type="submit" className="btn btn-lg btn-primary">
            {t('common.add')}
          </button>
        </form>
      )}

      <div className="customer-options">
        <button type="button" className={`customer-option ${!selectedId ? 'selected' : ''}`} onClick={() => onSelect(null)}>
          <Users size={26} />
          <span className="customer-option-name">{t('pay.walkIn')}</span>
        </button>
        {list.map((c) => (
          <button
            key={c.id}
            type="button"
            className={`customer-option ${selectedId === c.id ? 'selected' : ''}`}
            onClick={() => onSelect(c)}
          >
            <span className="customer-option-name">{c.name}</span>
            {c.phone && <span className="muted">{digits(c.phone)}</span>}
            {c.balance > 0 && <span className="due-text">{t('khata.due')} {money(c.balance)}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
