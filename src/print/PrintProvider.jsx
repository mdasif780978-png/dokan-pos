import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Receipt } from './Receipt';
import { useSettings } from '../db/settings';

/**
 * Printing through the normal browser print dialog (works with Android print
 * services for Bluetooth/USB 58 mm thermal printers, e.g. RawBT, or "Save as PDF").
 *
 * The receipt is rendered into #print-root (kept off-screen). Print CSS hides the
 * app and shows only the receipt. Before printing we measure the receipt and set
 * `@page { size: <paper>mm <height>mm }`, so the page is exactly one receipt long.
 * Bangla is rendered by the browser itself, which raw ESC/POS text printing can't do.
 */
const PrintContext = createContext(() => {});

export function PrintProvider({ children }) {
  const settings = useSettings();
  const [job, setJob] = useState(null);

  const print = useCallback((sale) => setJob({ sale, at: Date.now() }), []);

  useEffect(() => {
    if (!job) return undefined;
    let cancelled = false;
    (async () => {
      try {
        await document.fonts?.ready;
      } catch {
        /* ignore */
      }
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      if (cancelled) return;
      const el = document.querySelector('#print-root .receipt');
      const heightMm = el ? Math.ceil((el.getBoundingClientRect().height * 25.4) / 96) + 8 : 200;
      let style = document.getElementById('print-page-style');
      if (!style) {
        style = document.createElement('style');
        style.id = 'print-page-style';
        document.head.appendChild(style);
      }
      style.textContent = `@page { size: ${settings.paperWidth}mm ${heightMm}mm; margin: 0; }`;
      window.print();
    })();
    return () => {
      cancelled = true;
    };
    // Only re-run for a new print job, not when settings change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [job]);

  const root = document.getElementById('print-root');
  return (
    <PrintContext.Provider value={print}>
      {children}
      {job && root && createPortal(<Receipt sale={job.sale} settings={settings} />, root)}
    </PrintContext.Provider>
  );
}

/** const print = usePrint(); print(sale); */
export const usePrint = () => useContext(PrintContext);
