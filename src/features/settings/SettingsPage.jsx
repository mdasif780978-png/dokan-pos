import { useEffect, useRef, useState } from 'react';
import { Download, Printer, Smartphone, Upload } from 'lucide-react';
import { saveSettings, useSettings } from '../../db/settings';
import { exportBackup, importBackup } from '../../db/backup';
import { useI18n } from '../../i18n/I18nProvider';
import { useConfirm, useShowError, useToast } from '../../components/Feedback';
import { Segmented } from '../../components/Segmented';
import { usePrint } from '../../print/PrintProvider';
import { testSale } from '../../print/Receipt';
import { useInstallPrompt } from '../../hooks/useInstallPrompt';

const FIELDS = ['shopName', 'address', 'phone', 'currency', 'receiptFooter', 'paperWidth', 'roundTotal'];
const pick = (s) => Object.fromEntries(FIELDS.map((k) => [k, s[k]]));

export default function SettingsPage() {
  const { t, lang, setLang } = useI18n();
  const settings = useSettings();
  const toast = useToast();
  const confirm = useConfirm();
  const showError = useShowError();
  const print = usePrint();
  const install = useInstallPrompt();
  const [form, setForm] = useState(null);
  const [persisted, setPersisted] = useState(null);
  const fileRef = useRef(null);

  // Fill the form once the saved settings have loaded.
  useEffect(() => {
    if (settings.loaded && !form) setForm(pick(settings));
  }, [settings, form]);

  useEffect(() => {
    navigator.storage?.persisted?.().then(setPersisted).catch(() => setPersisted(false));
  }, []);

  if (!form) return null;
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const save = async (e) => {
    e.preventDefault();
    try {
      await saveSettings({ ...form, currency: form.currency.trim() || '৳' });
      toast(t('common.saved'), 'success');
    } catch (err) {
      showError(err);
    }
  };

  const restore = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!(await confirm({ message: t('settings.importConfirm'), danger: true, confirmText: t('settings.import') }))) return;
    try {
      await importBackup(file);
      setForm(null); // reload the form from the restored settings
      toast(t('settings.imported'), 'success');
    } catch (err) {
      showError(err);
    }
  };

  return (
    <div className="page settings">
      <header className="page-header">
        <h1>{t('settings.title')}</h1>
      </header>

      <form className="panel form" onSubmit={save}>
        <h2 className="panel-title">{t('settings.shop')}</h2>
        <label className="field-block">
          <span>{t('settings.shopName')}</span>
          <input value={form.shopName} onChange={set('shopName')} required />
        </label>
        <label className="field-block">
          <span>{t('settings.address')}</span>
          <input value={form.address} onChange={set('address')} />
        </label>
        <div className="form-row">
          <label className="field-block">
            <span>{t('settings.phone')}</span>
            <input value={form.phone} onChange={set('phone')} inputMode="tel" />
          </label>
          <label className="field-block narrow">
            <span>{t('settings.currency')}</span>
            <input value={form.currency} onChange={set('currency')} maxLength={4} />
          </label>
        </div>

        <h2 className="panel-title">{t('settings.receipt')}</h2>
        <label className="field-block">
          <span>{t('settings.footer')}</span>
          <input value={form.receiptFooter} onChange={set('receiptFooter')} />
        </label>
        <div className="field-block">
          <span>{t('settings.paperWidth')}</span>
          <Segmented
            options={[
              { value: 58, label: '58 mm' },
              { value: 80, label: '80 mm' },
            ]}
            value={Number(form.paperWidth)}
            onChange={(v) => setForm((f) => ({ ...f, paperWidth: v }))}
          />
        </div>
        <label className="check-row">
          <input type="checkbox" checked={!!form.roundTotal} onChange={(e) => setForm((f) => ({ ...f, roundTotal: e.target.checked }))} />
          <span>{t('settings.roundTotal')}</span>
        </label>
        <div className="row-gap">
          <button type="submit" className="btn btn-lg btn-primary">
            {t('common.save')}
          </button>
          <button type="button" className="btn btn-lg" onClick={() => print(testSale())}>
            <Printer size={24} /> {t('settings.testPrint')}
          </button>
        </div>
      </form>

      <section className="panel">
        <h2 className="panel-title">{t('settings.language')}</h2>
        <Segmented
          options={[
            { value: 'bn', label: 'বাংলা' },
            { value: 'en', label: 'English' },
          ]}
          value={lang}
          onChange={setLang}
        />
      </section>

      <section className="panel">
        <h2 className="panel-title">{t('settings.data')}</h2>
        <p className="muted">{t('settings.dataHint')}</p>
        <div className="row-gap">
          <button type="button" className="btn btn-lg" onClick={() => exportBackup().catch(showError)}>
            <Download size={24} /> {t('settings.export')}
          </button>
          <button type="button" className="btn btn-lg" onClick={() => fileRef.current?.click()}>
            <Upload size={24} /> {t('settings.import')}
          </button>
          <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={restore} />
        </div>
        {persisted !== null && <p className={persisted ? 'ok-text' : 'low-text'}>{persisted ? t('settings.persisted') : t('settings.notPersisted')}</p>}
        <div className="row-gap">
          {install.installed ? (
            <span className="ok-text">
              <Smartphone size={22} className="inline-icon" /> {t('settings.installed')}
            </span>
          ) : (
            install.canInstall && (
              <button type="button" className="btn btn-lg btn-primary" onClick={install.install}>
                <Smartphone size={24} /> {t('settings.install')}
              </button>
            )
          )}
        </div>
        <p className="muted small">v{__APP_VERSION__}</p>
      </section>
    </div>
  );
}
