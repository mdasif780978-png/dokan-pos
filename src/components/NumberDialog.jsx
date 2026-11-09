import { useState } from 'react';
import { Check } from 'lucide-react';
import { Modal } from './Modal';
import { NumPad } from './NumPad';
import { useShowError } from './Feedback';
import { useI18n } from '../i18n/I18nProvider';
import { parseNum } from '../lib/format';
import { AppError } from '../lib/errors';

/**
 * Generic "enter a number" dialog with the big NumPad.
 * Used for piece quantity, adding stock and khata payments.
 */
export function NumberDialog({
  title,
  info,
  unit,
  initial = '',
  allowDecimal = true,
  maxDecimals = 2,
  presets = [],
  formatPreset = (v) => v,
  preview,
  submitLabel,
  onSubmit,
  onClose,
  children,
}) {
  const { t, digits } = useI18n();
  const showError = useShowError();
  const [value, setValue] = useState(String(initial ?? ''));
  const n = parseNum(value);

  const submit = async () => {
    if (!(n > 0)) return showError(new AppError('err.amountRequired'));
    try {
      await onSubmit(n);
    } catch (e) {
      showError(e);
    }
    return undefined;
  };

  return (
    <Modal
      title={title}
      size="lg"
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn btn-lg" onClick={onClose}>
            {t('common.cancel')}
          </button>
          <button type="button" className="btn btn-lg btn-primary" onClick={submit}>
            <Check size={26} /> {submitLabel || t('common.done')}
          </button>
        </>
      }
    >
      <div className="entry-layout">
        <div className="entry-info">
          {info}
          <div className="readout">
            <span className="readout-value">{digits(value || '0')}</span>
            {unit && <span className="readout-unit">{unit}</span>}
          </div>
          {preview && <div className="entry-result">{preview(n)}</div>}
          {presets.length > 0 && (
            <div className="presets">
              {presets.map((p) => (
                <button key={p} type="button" className="btn preset" onClick={() => setValue(String(p))}>
                  {formatPreset(p)}
                </button>
              ))}
            </div>
          )}
          {children}
        </div>
        <NumPad value={value} onChange={setValue} onEnter={submit} allowDecimal={allowDecimal} maxDecimals={maxDecimals} />
      </div>
    </Modal>
  );
}
