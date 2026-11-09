import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { I18nProvider } from './i18n/I18nProvider';
import { FeedbackProvider } from './components/Feedback';
import { PrintProvider } from './print/PrintProvider';
import { Layout } from './components/Layout';
import BillingPage from './features/billing/BillingPage';
import ProductsPage from './features/products/ProductsPage';
import StockPage from './features/stock/StockPage';
import KhataPage from './features/khata/KhataPage';
import CustomerPage from './features/khata/CustomerPage';
import ReportsPage from './features/reports/ReportsPage';
import SettingsPage from './features/settings/SettingsPage';

export default function App() {
  return (
    <I18nProvider>
      <FeedbackProvider>
        <PrintProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<Layout />}>
                <Route index element={<BillingPage />} />
                <Route path="products" element={<ProductsPage />} />
                <Route path="stock" element={<StockPage />} />
                <Route path="khata" element={<KhataPage />} />
                <Route path="khata/:id" element={<CustomerPage />} />
                <Route path="reports" element={<ReportsPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </PrintProvider>
      </FeedbackProvider>
    </I18nProvider>
  );
}
