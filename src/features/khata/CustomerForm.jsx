import { useState } from 'react';
import { Modal } from '../../components/Modal';
import { useShowError, useToast } from '../../components/Feedback';
import { useI18n } from '../../i18n/I18nProvider';
import { saveCustomer } from '../../db/customers';

export function CustomerForm({ customer, onClose, onSaved }) {
  const { t } = useI18n();
  const toast = useToast();
  const showError = useShowError();
  const [form, setForm] = useState({ id: customer?.id, name: customer?.name ?? '', phone: customer?.phone ?? '' });

  const submit = async (e) => {
    e.preventDefault();
    try {
      const id = await saveCustomer(form);
      toast(t('common.saved'), 'success');
      onSaved?.(id);
      onClose();
    } catch (err) {
      showError(err);
    }
  };

  return (
    <Modal
      title={customer ? t('khata.editCustomer') : t('khata.addCustomer')}
      size="md"
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn btn-lg" onClick={onClose}>
            {t('common.cancel')}
          </button>
          <button type="submit" form="customer-form" className="btn btn-lg btn-primary">
            {t('common.save')}
          </button>
        </>
      }
    >
      <form id="customer-form" className="form" onSubmit={submit}>
        <label className="field-block">
          <span>{t('khata.name')}</span>
          <input autoFocus required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </label>
        <label className="field-block">
          <span>{t('khata.phone')}</span>
          <input inputMode="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="01XXXXXXXXX" />
        </label>
      </form>
    </Modal>
  );
}
