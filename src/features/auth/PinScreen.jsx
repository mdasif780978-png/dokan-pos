import { useState } from 'react';
import { useAuth } from '../../auth/AuthProvider';
import { useSettings } from '../../db/settings';
import { useI18n } from '../../i18n/I18nProvider';
import { AuthLayout } from './AuthLayout';
import { ForgotPinDialog } from './ForgotPinDialog';
import { PinEntry } from './PinEntry';
import { usePinGuard } from './usePinGuard';

/** Returning user: shop name + PIN only. */
export function PinScreen() {
  const { t } = useI18n();
  const { owner, signIn } = useAuth();
  const { shopName } = useSettings();
  const guard = usePinGuard(signIn);
  const [forgot, setForgot] = useState(false);

  return (
    <AuthLayout>
      <div className="pin-screen">
        <h1 className="pin-shop">{shopName}</h1>
        <p className="muted">{t('auth.welcome', { name: owner.ownerName })}</p>
        <p className="pin-prompt">{t('auth.enterPin')}</p>
        <PinEntry length={guard.pinLength} onSubmit={guard.submit} disabled={guard.locked} message={guard.message} />
        <button type="button" className="btn btn-ghost" onClick={() => setForgot(true)}>
          {t('auth.forgot')}
        </button>
      </div>
      {forgot && <ForgotPinDialog onClose={() => setForgot(false)} />}
    </AuthLayout>
  );
}
