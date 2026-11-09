import { useSyncExternalStore } from 'react';

/**
 * Plug-in point for future camera-AI modules. Version 1 registers nothing, so
 * no AI buttons are shown. A module only has to call one of the register
 * functions at startup (see src/vision/README.md) and the billing screen picks it up.
 *
 * @typedef {Object} WeightReader
 *   Reads the weight shown on a normal (non-digital-output) scale's display.
 * @property {string} id
 * @property {{bn: string, en: string}} label         button text, e.g. { bn: 'ক্যামেরা', en: 'Camera' }
 * @property {(ctx: { product: object, signal: AbortSignal }) => Promise<{ grams: number, confidence?: number }>} readWeight
 *
 * @typedef {Object} ItemRecognizer
 *   Recognises which product is in front of the camera.
 * @property {string} id
 * @property {{bn: string, en: string}} label
 * @property {(ctx: { products: object[], signal: AbortSignal }) =>
 *   Promise<Array<{ productId: number, confidence: number, grams?: number }>>} recognize
 *   Return candidates best-first. If `grams` is given for a loose item, the weight
 *   dialog opens pre-filled with it.
 */

const weightReaders = new Map();
const itemRecognizers = new Map();
const listeners = new Set();
let version = 0;

const notify = () => {
  version += 1;
  listeners.forEach((l) => l());
};

export function registerWeightReader(reader) {
  weightReaders.set(reader.id, reader);
  notify();
  return () => weightReaders.delete(reader.id) && notify();
}

export function registerItemRecognizer(recognizer) {
  itemRecognizers.set(recognizer.id, recognizer);
  notify();
  return () => itemRecognizers.delete(recognizer.id) && notify();
}

const subscribe = (l) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const getVersion = () => version;

export function useWeightReaders() {
  useSyncExternalStore(subscribe, getVersion);
  return [...weightReaders.values()];
}

export function useItemRecognizers() {
  useSyncExternalStore(subscribe, getVersion);
  return [...itemRecognizers.values()];
}
