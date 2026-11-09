import { useState } from 'react';
import { Modal } from '../../components/Modal';
import { useShowError, useToast } from '../../components/Feedback';
import { useAuth } from '../../auth/AuthProvider';
import { useI18n } from '../../i18n/I18nProvider';

const pinInput = { type: 'password', inputMode: 'numeric', maxLength: 6 };

export function ChangePinDialog({ onClose }) {
  const { t } = useI18n();
  const { changePin } = useAuth();
  const toast = useToast();
  const showError = useShowError();
  const [form, setForm] = useState({ current: '', next: '', confirm: '' });
  const [busy, setBusy] = useState(false);
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await changePin(form.current, form.next, form.confirm);
      toast(t('auth.pinChanged'), 'success');
      onClose();
    } catch (err) {
      showError(err);
      setBusy(false);
    }
  };

  return (
    <Modal
      title={t('auth.changePin')}
      size="sm"
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn btn-lg" onClick={onClose}>
            {t('common.cancel')}
          </button>
          <button type="submit" form="change-pin-form" className="btn btn-lg btn-primary" disabled={busy}>
            {t('common.save')}
          </button>
        </>
      }
    >
      <form id="change-pin-form" className="form" onSubmit={submit}>
        <label className="field-block">
          <span>{t('auth.currentPin')}</span>
          <input {...pinInput} autoComplete="current-password" autoFocus value={form.current} onChange={set('current')} />
        </label>
        <label className="field-block">
          <span>{t('auth.newPin')}</span>
          <input {...pinInput} autoComplete="new-password" value={form.next} onChange={set('next')} />
        </label>
        <label className="field-block">
          <span>{t('auth.newPinConfirm')}</span>
          <input {...pinInput} autoComplete="new-password" value={form.confirm} onChange={set('confirm')} />
        </label>
      </form>
    </Modal>
  );
}
