import { useEffect, useState } from 'react';
import { useAuth } from '../../auth/AuthProvider';
import { useI18n } from '../../i18n/I18nProvider';
import { useShowError } from '../../components/Feedback';

/** Re-render every second while `active` (for the lock countdown). */
function useTick(active) {
  const [, setTick] = useState(0);
  useEffect(() => {
    if (!active) return undefined;
    const id = setInterval(() => setTick((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, [active]);
}

/**
 * Shared PIN checking for the sign-in screen and PIN-protected actions:
 * wrong-PIN message with tries left, and the 1-minute lock countdown.
 * `check(pin)` returns { ok, attemptsLeft, lockedUntil } (see localAuth.checkPin).
 */
export function usePinGuard(check, onSuccess) {
  const { t, num } = useI18n();
  const { owner } = useAuth();
  const showError = useShowError();
  const [message, setMessage] = useState('');
  const lockedMs = Math.max(0, (owner?.lockedUntil || 0) - Date.now());
  useTick(lockedMs > 0);

  const submit = async (pin) => {
    try {
      const result = await check(pin);
      if (result.ok) {
        setMessage('');
        await onSuccess?.();
        return true;
      }
      setMessage(result.lockedUntil ? '' : t('auth.wrongPin', { n: num(result.attemptsLeft) }));
    } catch (err) {
      showError(err);
    }
    return false;
  };

  const locked = lockedMs > 0;
  return {
    submit,
    locked,
    pinLength: owner?.pinLength,
    message: locked ? t('auth.locked', { s: num(Math.ceil(lockedMs / 1000)) }) : message,
  };
}
