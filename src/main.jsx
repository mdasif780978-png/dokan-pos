import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Bundled Bangla font: renders the same on every tablet and on printed receipts, even offline.
import '@fontsource/noto-sans-bengali/400.css';
import '@fontsource/noto-sans-bengali/600.css';
import '@fontsource/noto-sans-bengali/700.css';
import './styles/app.css';
import './styles/print.css';
import './hooks/useInstallPrompt';
import './vision';
import { requestPersistentStorage } from './db/db';
import App from './App';

requestPersistentStorage();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
