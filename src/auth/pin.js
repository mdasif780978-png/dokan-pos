/**
 * PIN hashing with the browser's built-in Web Crypto: PBKDF2-SHA256 with a random salt.
 * The PIN itself is never stored, only { algo, iterations, salt, hash }.
 *
 * Web Crypto only exists in a secure context (https:// or localhost).
 */
import { toEnDigits } from '../lib/format';

export const PIN_ITERATIONS = 120_000;
const ALGO = 'PBKDF2-SHA256';

export const isCryptoAvailable = () => !!globalThis.crypto?.subtle;

/** Accepts Bangla or English digits; returns the PIN with English digits. */
export const normalizePin = (pin) => toEnDigits(String(pin ?? '')).trim();
export const isValidPin = (pin) => /^\d{4,6}$/.test(normalizePin(pin));

const toB64 = (bytes) => btoa(String.fromCharCode(...bytes));
const fromB64 = (b64) => Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));

async function derive(pin, salt, iterations) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(normalizePin(pin)), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations }, key, 256);
  return toB64(new Uint8Array(bits));
}

export async function hashPin(pin, iterations = PIN_ITERATIONS) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  return { algo: ALGO, iterations, salt: toB64(salt), hash: await derive(pin, salt, iterations) };
}

export async function verifyPin(pin, credential) {
  if (!credential || credential.algo !== ALGO) return false;
  const hash = await derive(pin, fromB64(credential.salt), credential.iterations);
  // Constant-time comparison.
  if (hash.length !== credential.hash.length) return false;
  let diff = 0;
  for (let i = 0; i < hash.length; i++) diff |= hash.charCodeAt(i) ^ credential.hash.charCodeAt(i);
  return diff === 0;
}
