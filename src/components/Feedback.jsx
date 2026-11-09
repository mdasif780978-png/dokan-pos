import { createContext, useCallback, useContext, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { CircleCheck, CircleAlert, Info } from 'lucide-react';
import { Modal } from './Modal';
import { useI18n } from '../i18n/I18nProvider';

/** Toast messages + promise-based confirm dialog, available everywhere via hooks. */
const FeedbackContext = createContext(null);

export function FeedbackProvider({ children }) {
  const { t } = useI18n();
  const [toasts, setToasts] = useState([]);
  const [confirmState, setConfirmState] = useState(null);
  const idRef = useRef(0);

  const toast = useCallback((message, type = 'info') => {
    const id = ++idRef.current;
    setToasts((list) => [...list.slice(-2), { id, message, type }]);
    setTimeout(() => setToasts((list) => list.filter((x) => x.id !== id)), type === 'error' ? 4000 : 2200);
  }, []);

  const confirm = useCallback(
    (opts) => new Promise((resolve) => setConfirmState({ ...opts, resolve })),
    [],
  );

  const closeConfirm = (result) => {
    confirmState?.resolve(result);
    setConfirmState(null);
  };

  const icons = { success: CircleCheck, error: CircleAlert, info: Info };

  return (
    <FeedbackContext.Provider value={{ toast, confirm }}>
      {children}
      {createPortal(
        <div className="toasts" role="status" aria-live="polite">
          {toasts.map(({ id, message, type }) => {
            const Icon = icons[type] || Info;
            return (
              <div key={id} className={`toast toast-${type}`}>
                <Icon size={26} />
                <span>{message}</span>
              </div>
            );
          })}
        </div>,
        document.body,
      )}
      {confirmState && (
        <Modal
          title={confirmState.title || t('common.yes') + '?'}
          size="sm"
          onClose={() => closeConfirm(false)}
          footer={
            <>
              <button type="button" className="btn btn-lg" onClick={() => closeConfirm(false)}>
                {confirmState.cancelText || t('common.no')}
              </button>
              <button
                type="button"
                className={`btn btn-lg ${confirmState.danger ? 'btn-danger' : 'btn-primary'}`}
                onClick={() => closeConfirm(true)}
              >
                {confirmState.confirmText || t('common.yes')}
              </button>
            </>
          }
        >
          <p className="confirm-message">{confirmState.message}</p>
        </Modal>
      )}
    </FeedbackContext.Provider>
  );
}

export function useToast() {
  return useContext(FeedbackContext).toast;
}

export function useConfirm() {
  return useContext(FeedbackContext).confirm;
}

/** Show any thrown error (AppError → translated text). */
export function useShowError() {
  const toast = useToast();
  const { errorText } = useI18n();
  return useCallback((err) => {
    if (!(err?.name === 'AppError')) console.error(err);
    toast(errorText(err), 'error');
  }, [toast, errorText]);
}
