import { NavLink, Outlet } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { BookUser, Boxes, ChartColumn, Languages, Package, Settings, ShoppingCart } from 'lucide-react';
import { db } from '../db/db';
import { isLowStock } from '../db/products';
import { useI18n } from '../i18n/I18nProvider';
import { UpdateBanner } from './UpdateBanner';

const NAV = [
  { to: '/', icon: ShoppingCart, label: 'nav.billing', end: true },
  { to: '/products', icon: Package, label: 'nav.products' },
  { to: '/stock', icon: Boxes, label: 'nav.stock', badge: 'lowStock' },
  { to: '/khata', icon: BookUser, label: 'nav.khata' },
  { to: '/reports', icon: ChartColumn, label: 'nav.reports' },
  { to: '/settings', icon: Settings, label: 'nav.settings' },
];

export function Layout() {
  const { t, num, toggleLang } = useI18n();
  const lowStock = useLiveQuery(() => db.products.filter(isLowStock).count(), [], 0);
  const badges = { lowStock };

  return (
    <div className="app">
      <nav className="nav" aria-label="Main">
        {NAV.map(({ to, icon: Icon, label, end, badge }) => (
          <NavLink key={to} to={to} end={end} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <span className="nav-icon">
              <Icon size={30} />
              {badge && badges[badge] > 0 && <span className="nav-badge">{num(badges[badge])}</span>}
            </span>
            <span className="nav-label">{t(label)}</span>
          </NavLink>
        ))}
        <button type="button" className="nav-link nav-lang" onClick={toggleLang}>
          <Languages size={26} />
          <span className="nav-label">{t('lang.toggle')}</span>
        </button>
      </nav>
      <main className="main">
        <UpdateBanner />
        <Outlet />
      </main>
    </div>
  );
}
