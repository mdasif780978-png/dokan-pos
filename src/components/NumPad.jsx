import { useEffect, useRef } from 'react';
import { Delete } from 'lucide-react';
import { useI18n } from '../i18n/I18nProvider';
import { toEnDigits } from '../lib/format';

/**
 * Big touch-friendly number pad. `value` is a plain string with Latin digits ("12.5").
 * Also accepts a hardware keyboard (digits, Bangla digits, ".", Backspace, Enter).
 */
export function NumPad({ value, onChange, onEnter, allowDecimal = true, maxDecimals = 3, maxLength = 9, disabled = false }) {
  const { digits } = useI18n();
  const state = useRef({ value, onChange, onEnter, disabled });
  state.current = { value, onChange, onEnter, disabled };

  const press = (key) => {
    const { value: v, onChange: change, disabled: off } = state.current;
    if (off) return undefined;
    if (key === 'back') return change(v.slice(0, -1));
    if (key === 'clear') return change('');
    if (key === '.') {
      if (!allowDecimal || v.includes('.')) return undefined;
      return change(`${v || '0'}.`);
    }
    if (v.length >= maxLength) return undefined;
    if (v.includes('.') && v.split('.')[1].length >= maxDecimals) return undefined;
    return change(v === '0' ? key : v + key);
  };

  useEffect(() => {
    const onKey = (e) => {
      const tag = e.target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      const k = toEnDigits(e.key);
      if (/^\d$/.test(k)) press(k);
      else if (k === '.' || k === ',') press('.');
      else if (k === 'Backspace') press('back');
      else if (k === 'Delete') press('clear');
      else if (k === 'Enter' && state.current.onEnter) {
        e.preventDefault();
        state.current.onEnter();
      } else return;
      e.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const keys = ['7', '8', '9', '4', '5', '6', '1', '2', '3', allowDecimal ? '.' : 'clear', '0', 'back'];
  return (
    <div className="numpad">
      {keys.map((k) => (
        <button
          key={k}
          type="button"
          className={`numpad-key ${k === 'back' || k === 'clear' ? 'numpad-key-fn' : ''}`}
          disabled={disabled}
          onClick={() => press(k)}
          aria-label={k === 'back' ? 'Backspace' : k === 'clear' ? 'Clear' : k}
        >
          {k === 'back' ? <Delete size={32} /> : k === 'clear' ? 'C' : k === '.' ? '.' : digits(k)}
        </button>
      ))}
    </div>
  );
}
