import { useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { useI18n } from '../i18n/I18nProvider';
import { useToast } from './Feedback';

/** Registers the service worker; asks before switching to a new app version. */
export function UpdateBanner() {
  const { t } = useI18n();
  const toast = useToast();
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_url, registration) {
      // Check for a new version every hour while the shop has internet.
      if (registration) setInterval(() => navigator.onLine && registration.update(), 60 * 60 * 1000);
    },
  });

  useEffect(() => {
    if (offlineReady) {
      toast(t('pwa.offlineReady'), 'success');
      setOfflineReady(false);
    }
  }, [offlineReady, setOfflineReady, toast, t]);

  if (!needRefresh) return null;
  return (
    <div className="update-banner" role="alert">
      <span>{t('pwa.update')}</span>
      <button type="button" className="btn" onClick={() => setNeedRefresh(false)}>
        {t('pwa.later')}
      </button>
      <button type="button" className="btn btn-primary" onClick={() => updateServiceWorker(true)}>
        {t('pwa.reload')}
      </button>
    </div>
  );
}
