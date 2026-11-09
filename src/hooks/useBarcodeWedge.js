import { useEffect, useRef } from 'react';

/**
 * Support for USB / Bluetooth barcode guns. They "type" the code very fast and press Enter.
 * We collect fast keystrokes that are not going into a text field and fire onScan(code).
 */
export function useBarcodeWedge(onScan, enabled = true) {
  const ref = useRef(onScan);
  ref.current = onScan;

  useEffect(() => {
    if (!enabled) return undefined;
    let buffer = '';
    let lastAt = 0;
    const onKey = (e) => {
      const tag = e.target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target?.isContentEditable) return;
      const now = performance.now();
      if (now - lastAt > 80) buffer = '';
      lastAt = now;
      if (e.key === 'Enter') {
        if (buffer.length >= 4) {
          e.preventDefault();
          ref.current(buffer);
        }
        buffer = '';
      } else if (e.key.length === 1) {
        buffer += e.key;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [enabled]);
}
