import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats as F } from 'html5-qrcode';
import { Modal } from './Modal';
import { useI18n } from '../i18n/I18nProvider';
import { beep } from '../lib/beep';

const FORMATS = [F.EAN_13, F.EAN_8, F.UPC_A, F.UPC_E, F.CODE_128, F.CODE_39, F.ITF, F.QR_CODE];
const REPEAT_GUARD_MS = 2000;
let seq = 0;

/**
 * Camera barcode scanner (html5-qrcode; uses Android Chrome's fast native
 * BarcodeDetector when available). This file is lazy-loaded, so the scanner
 * library only loads when the camera is first opened.
 *
 * continuous = keep scanning after each read (billing); otherwise close after one read.
 */
export default function BarcodeScanner({ onScan, onClose, continuous = false, title }) {
  const { t, digits } = useI18n();
  const containerRef = useRef(null);
  const onScanRef = useRef(onScan);
  onScanRef.current = onScan;
  const [status, setStatus] = useState('starting');
  const [last, setLast] = useState('');

  useEffect(() => {
    // A fresh child element per mount keeps React StrictMode's double-mount from
    // two scanner instances fighting over the same element.
    const el = document.createElement('div');
    el.id = `scanner-${++seq}`;
    containerRef.current.appendChild(el);
    const scanner = new Html5Qrcode(el.id, {
      formatsToSupport: FORMATS,
      experimentalFeatures: { useBarCodeDetectorIfSupported: true },
      verbose: false,
    });
    let lastCode = '';
    let lastAt = 0;
    let done = false;

    const onDecoded = (text) => {
      const now = Date.now();
      if (done || (text === lastCode && now - lastAt < REPEAT_GUARD_MS)) return;
      lastCode = text;
      lastAt = now;
      beep();
      setLast(text);
      if (!continuous) done = true;
      onScanRef.current(text);
      if (!continuous) onClose();
    };

    const started = scanner
      .start(
        { facingMode: 'environment' },
        { fps: 12, qrbox: (w, h) => ({ width: Math.floor(w * 0.85), height: Math.floor(Math.min(h * 0.5, w * 0.5)) }) },
        onDecoded,
        () => {},
      )
      .then(() => setStatus('running'))
      .catch(() => setStatus('error'));

    return () => {
      done = true;
      started
        .then(() => (scanner.isScanning ? scanner.stop() : null))
        .then(() => scanner.clear())
        .catch(() => {})
        .finally(() => el.remove());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Modal title={title || t('scan.title')} onClose={onClose} size="md">
      <div className="scanner">
        <div className="scanner-view" ref={containerRef} />
        {status === 'starting' && <p className="muted center">{t('scan.starting')}</p>}
        {status === 'running' && <p className="muted center">{t('scan.hint')}</p>}
        {status === 'error' && <p className="error-text center">{t('scan.noCamera')}</p>}
        {continuous && last && <p className="scanner-last">{t('scan.last', { code: digits(last) })}</p>}
      </div>
    </Modal>
  );
}
