import { useState } from 'react';
import { Store } from 'lucide-react';
import { useAuth } from '../../auth/AuthProvider';
import { normalizePhone } from '../../auth/localAuth';
import { db } from '../../db/db';
import { loadDemoItems } from '../../db/demoItems';
import { saveSettings } from '../../db/settings';
import { useI18n } from '../../i18n/I18nProvider';
import { useShowError, useToast } from '../../components/Feedback';
import { AppError } from '../../lib/errors';
import { AuthLayout } from './AuthLayout';

const pinInput = { type: 'password', inputMode: 'numeric', maxLength: 6, autoComplete: 'new-password' };

/** First run: create the owner account. Afterwards the demo items are added if the shop is empty. */
export function SetupScreen() {
  const { t, num } = useI18n();
  const { createOwner } = useAuth();
  const toast = useToast();
  const showError = useShowError();
  const [form, setForm] = useState({ shopName: '', ownerName: '', phone: '', pin: '', pinConfirm: '' });
  const [busy, setBusy] = useState(false);
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (busy) return;
    try {
      const shopName = form.shopName.trim();
      if (!shopName) throw new AppError('auth.err.shopName');
      setBusy(true);
      // Save the shop details first so the app (and receipts) show them right away.
      await saveSettings({ shopName, phone: normalizePhone(form.phone) || form.phone.trim() });
      await createOwner(form); // validates, hashes the PIN and signs in
      if ((await db.products.count()) === 0) {
        const added = await loadDemoItems();
        toast(t('auth.demoLoaded', { n: num(added) }), 'success');
      }
    } catch (err) {
      showError(err);
      setBusy(false);
    }
  };

  return (
    <AuthLayout>
      <form className="form auth-form" onSubmit={submit}>
        <h1>{t('auth.setupTitle')}</h1>
        <p className="muted">{t('auth.setupHint')}</p>
        <label className="field-block">
          <span>{t('auth.shopName')}</span>
          <input value={form.shopName} onChange={set('shopName')} autoFocus placeholder="যেমন: মায়ের দোয়া স্টোর" />
        </label>
        <div className="form-row">
          <label className="field-block">
            <span>{t('auth.ownerName')}</span>
            <input value={form.ownerName} onChange={set('ownerName')} autoComplete="name" />
          </label>
          <label className="field-block">
            <span>{t('auth.phone')}</span>
            <input value={form.phone} onChange={set('phone')} inputMode="tel" autoComplete="tel" placeholder="01XXXXXXXXX" />
          </label>
        </div>
        <div className="form-row">
          <label className="field-block">
            <span>{t('auth.pin')}</span>
            <input {...pinInput} value={form.pin} onChange={set('pin')} />
          </label>
          <label className="field-block">
            <span>{t('auth.pinConfirm')}</span>
            <input {...pinInput} value={form.pinConfirm} onChange={set('pinConfirm')} />
          </label>
        </div>
        <p className="muted small">{t('auth.pinHint')}</p>
        <button type="submit" className="btn btn-xl btn-primary" disabled={busy}>
          <Store size={28} /> {busy ? t('auth.creating') : t('auth.create')}
        </button>
      </form>
    </AuthLayout>
  );
}
