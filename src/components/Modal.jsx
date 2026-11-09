import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useI18n } from '../i18n/I18nProvider';

/**
 * Full-attention dialog. It only closes with the X / Cancel button (or Esc on a keyboard),
 * never by tapping outside, so a busy shopkeeper can't lose a half-entered bill by accident.
 */
export function Modal({ title, onClose, children, footer, size = 'md', className = '' }) {
  const { t } = useI18n();

  useEffect(() => {
    if (!onClose) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return createPortal(
    <div className="modal-backdrop">
      <div className={`modal modal-${size} ${className}`} role="dialog" aria-modal="true" aria-label={title}>
        <header className="modal-header">
          <h2>{title}</h2>
          {onClose && (
            <button type="button" className="icon-btn" onClick={onClose} aria-label={t('common.close')}>
              <X size={28} />
            </button>
          )}
        </header>
        <div className="modal-body">{children}</div>
        {footer && <footer className="modal-footer">{footer}</footer>}
      </div>
    </div>,
    document.body,
  );
}
