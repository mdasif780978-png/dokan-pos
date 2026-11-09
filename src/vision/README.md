# Camera AI modules (future)

The billing screen already has two plug-in points. Version 1 registers nothing,
so no AI buttons appear. To add AI later you write a module and register it in
`src/vision/index.js`. Billing, stock and receipt code stays unchanged.

## 1. Weight reader: read the weight off a normal scale's display

```js
// src/vision/scaleDisplayReader.js
export const scaleDisplayReader = {
  id: 'scale-display',
  label: { bn: 'ক্যামেরা', en: 'Camera' },
  async readWeight({ product, signal }) {
    // 1. open the camera: navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
    // 2. grab frames into a <canvas>
    // 3. run a 7-segment / LCD digit model (e.g. TensorFlow.js or ONNX Runtime Web,
    //    with the model file in /public so it is precached for offline use)
    // 4. return a stable reading
    return { grams: 750, confidence: 0.93 };
  },
};
```

A **"Read from Camera"** button then appears in the weight dialog. The returned
grams fill the weight field, and the shopkeeper still confirms before adding.

## 2. Item recognizer: recognise the product on the counter

```js
export const itemRecognizer = {
  id: 'item-vision',
  label: { bn: 'চিনুন', en: 'Identify' },
  async recognize({ products, signal }) {
    // classify a camera frame, then map model labels to product ids
    return [{ productId: 12, confidence: 0.88, grams: 500 }];
  },
};
```

A button then appears in the billing toolbar. Its suggestions show as large
tiles, and tapping one adds the item. For a loose item the weight dialog opens
pre-filled with `grams`, if the recognizer gave a weight.

## Notes
- Keep models inside `public/models/…`. The service worker precaches `png/svg/js/css/woff2`
  files. Add your model's extensions (e.g. `bin`, `onnx`, `json`) to `globPatterns` in
  `vite.config.js` and raise `maximumFileSizeToCacheInBytes` if the model is large.
- Lazy-load heavy libraries inside `readWeight` / `recognize` with `await import(...)`
  so the normal app still starts fast.
- Respect `signal` (an `AbortSignal`) so a dialog closed mid-scan stops the camera.
- Cart logic is pure and lives in `src/domain/billing.js`, so it can be unit-tested
  with the AI results.
