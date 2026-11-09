import { Modal } from '../../components/Modal';
import { useConfirm } from '../../components/Feedback';
import { useI18n } from '../../i18n/I18nProvider';
import { clearAllData } from '../../db/backup';

/** A local PIN can't be recovered; the only way out is erasing this device (then restoring a backup). */
export function ForgotPinDialog({ onClose }) {
  const { t } = useI18n();
  const confirm = useConfirm();

  const erase = async () => {
    if (!(await confirm({ message: t('auth.eraseConfirm'), danger: true, confirmText: t('auth.eraseStart') }))) return;
    await clearAllData();
  };

  return (
    <Modal
      title={t('auth.forgot')}
      size="md"
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn btn-lg" onClick={onClose}>
            {t('common.cancel')}
          </button>
          <button type="button" className="btn btn-lg btn-danger" onClick={erase}>
            {t('auth.eraseStart')}
          </button>
        </>
      }
    >
      <p className="confirm-message">{t('auth.forgotText')}</p>
    </Modal>
  );
}
