/**
 * Offline owner account stored on this device (IndexedDB table `auth`).
 *
 *   { key: 'owner', id, ownerName, phone, credential, pinLength,
 *     failedAttempts, lockedUntil, remoteId, createdAt }
 *   { key: 'session', ownerId, signedInAt }   // present = signed in on this device
 *
 * Every function here is the "local" backend of AuthProvider. A cloud backend
 * (e.g. Supabase) can implement the same functions later; see src/auth/README.md.
 */
import { db } from '../db/db';
import { AppError } from '../lib/errors';
import { toEnDigits } from '../lib/format';
import { hashPin, isCryptoAvailable, isValidPin, normalizePin, verifyPin } from './pin';

export const MAX_ATTEMPTS = 5;
export const LOCK_MS = 60_000;

/** Bangladeshi mobile number → "01XXXXXXXXX", or null if invalid. */
export function normalizePhone(phone) {
  const digits = toEnDigits(String(phone ?? '')).replace(/[\s-]/g, '');
  const m = digits.match(/^(?:\+?88)?(01[3-9]\d{8})$/);
  return m ? m[1] : null;
}

const newId = () =>
  globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

/** Owner without secrets, safe to hand to the UI. */
export const publicOwner = (owner) =>
  owner && {
    id: owner.id,
    ownerName: owner.ownerName,
    phone: owner.phone,
    pinLength: owner.pinLength,
    failedAttempts: owner.failedAttempts || 0,
    lockedUntil: owner.lockedUntil || 0,
    remoteId: owner.remoteId ?? null,
  };

export async function loadAuthState() {
  const [owner, session] = await Promise.all([db.auth.get('owner'), db.auth.get('session')]);
  return { owner: owner ?? null, session: session ?? null };
}

function validatePinPair(pin, pinConfirm) {
  if (!isValidPin(pin)) throw new AppError('auth.err.pinFormat');
  if (normalizePin(pin) !== normalizePin(pinConfirm)) throw new AppError('auth.err.pinMismatch');
}

/** First run: create the owner account and sign in. */
export async function createOwner({ ownerName, phone, pin, pinConfirm }) {
  const name = String(ownerName ?? '').trim();
  if (!name) throw new AppError('auth.err.ownerName');
  const cleanPhone = normalizePhone(phone);
  if (!cleanPhone) throw new AppError('auth.err.phone');
  validatePinPair(pin, pinConfirm);
  if (!isCryptoAvailable()) throw new AppError('auth.err.noCrypto');

  const credential = await hashPin(pin);
  const now = Date.now();
  return db.transaction('rw', db.auth, async () => {
    if (await db.auth.get('owner')) throw new AppError('auth.err.exists');
    const owner = {
      key: 'owner',
      id: newId(),
      ownerName: name,
      phone: cleanPhone,
      credential,
      pinLength: normalizePin(pin).length,
      failedAttempts: 0,
      lockedUntil: 0,
      remoteId: null, // filled in when the account is linked to a cloud login
      createdAt: now,
    };
    await db.auth.put(owner);
    await db.auth.put({ key: 'session', ownerId: owner.id, signedInAt: now });
    return publicOwner(owner);
  });
}

/**
 * Check the PIN with attempt counting: after MAX_ATTEMPTS wrong PINs the account
 * is locked for LOCK_MS. Used for sign-in and for confirming dangerous actions.
 * @returns {Promise<{ ok: true } | { ok: false, attemptsLeft: number, lockedUntil: number }>}
 */
export async function checkPin(pin, { now = Date.now() } = {}) {
  const owner = await db.auth.get('owner');
  if (!owner) throw new AppError('auth.err.noAccount');
  if ((owner.lockedUntil || 0) > now) return { ok: false, attemptsLeft: 0, lockedUntil: owner.lockedUntil };

  const ok = await verifyPin(pin, owner.credential);
  // Hashing is async Web Crypto work, so the counter is updated in its own transaction.
  return db.transaction('rw', db.auth, async () => {
    const fresh = await db.auth.get('owner');
    if (ok) {
      await db.auth.update('owner', { failedAttempts: 0, lockedUntil: 0 });
      return { ok: true };
    }
    const failed = (fresh.failedAttempts || 0) + 1;
    if (failed >= MAX_ATTEMPTS) {
      const lockedUntil = now + LOCK_MS;
      await db.auth.update('owner', { failedAttempts: 0, lockedUntil });
      return { ok: false, attemptsLeft: 0, lockedUntil };
    }
    await db.auth.update('owner', { failedAttempts: failed, lockedUntil: 0 });
    return { ok: false, attemptsLeft: MAX_ATTEMPTS - failed, lockedUntil: 0 };
  });
}

export async function signInWithPin(pin, opts) {
  const result = await checkPin(pin, opts);
  if (result.ok) {
    const owner = await db.auth.get('owner');
    await db.auth.put({ key: 'session', ownerId: owner.id, signedInAt: Date.now() });
  }
  return result;
}

export const signOut = () => db.auth.delete('session');

export async function changePin(currentPin, newPin, newPinConfirm) {
  validatePinPair(newPin, newPinConfirm);
  const result = await checkPin(currentPin);
  if (!result.ok) throw new AppError(result.lockedUntil ? 'auth.err.locked' : 'auth.err.wrongPin');
  const credential = await hashPin(newPin);
  await db.auth.update('owner', { credential, pinLength: normalizePin(newPin).length });
}
