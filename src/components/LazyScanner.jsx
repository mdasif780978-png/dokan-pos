import { lazy, Suspense } from 'react';

const BarcodeScanner = lazy(() => import('./BarcodeScanner'));

/** Loads the camera scanner code on demand (it is precached, so this also works offline). */
export function LazyScanner(props) {
  return (
    <Suspense fallback={null}>
      <BarcodeScanner {...props} />
    </Suspense>
  );
}
