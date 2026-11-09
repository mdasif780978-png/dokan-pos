import { useState } from 'react';
import { NumPad } from '../../components/NumPad';

/**
 * PIN dots + big number pad. Submits automatically when `length` digits are entered.
 * onSubmit(pin) → Promise<boolean>; on false the dots shake and clear.
 */
export function PinEntry({ length, onSubmit, disabled = false, message }) {
  const [value, setValue] = useState('');
  const [busy, setBusy] = useState(false);
  const [shakes, setShakes] = useState(0);
  const size = length || 6;

  const submit = async (pin) => {
    setBusy(true);
    const ok = await onSubmit(pin);
    setBusy(false);
    setValue('');
    if (!ok) setShakes((n) => n + 1);
  };

  const change = (next) => {
    if (busy || disabled) return;
    setValue(next);
    if (length && next.length === length) submit(next);
  };

  return (
    <div className="pin-entry">
      <div key={shakes} className={`pin-dots ${shakes ? 'pin-shake' : ''}`} aria-label={`${value.length}/${size}`}>
        {Array.from({ length: size }, (_, i) => (
          <span key={i} className={`pin-dot ${i < value.length ? 'filled' : ''}`} />
        ))}
      </div>
      <p className="pin-message" role="alert">
        {message}
      </p>
      <NumPad
        value={value}
        onChange={change}
        onEnter={() => !length && value.length >= 4 && submit(value)}
        allowDecimal={false}
        maxLength={size}
        disabled={disabled || busy}
      />
    </div>
  );
}
