import { Languages } from 'lucide-react';
import { LogoMark } from '../../brand/Logo';
import { useI18n } from '../../i18n/I18nProvider';

/** Green brand panel + content card, used by the setup and PIN screens. */
export function AuthLayout({ children }) {
  const { t, toggleLang } = useI18n();
  return (
    <div className="auth">
      <aside className="auth-brand">
        <LogoMark className="auth-logo" />
        <div className="auth-brand-text">
          <div className="auth-brand-name">দোকান হিসাব</div>
          <div className="auth-brand-sub">Dokan Hishab</div>
          <p className="auth-tagline">{t('auth.tagline')}</p>
        </div>
      </aside>
      <main className="auth-main">
        <div className="auth-top">
          <button type="button" className="btn" onClick={toggleLang}>
            <Languages size={22} /> {t('lang.toggle')}
          </button>
        </div>
        <div className="auth-card">{children}</div>
      </main>
    </div>
  );
}
