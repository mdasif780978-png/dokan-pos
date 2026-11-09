import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../db/db';
import { LOCK_MS, MAX_ATTEMPTS, changePin, checkPin, createOwner, loadAuthState, normalizePhone, signInWithPin, signOut } from './localAuth';

const owner = { ownerName: 'আসিফ', phone: '01711-223344', pin: '4826', pinConfirm: '৪৮২৬' };

beforeEach(async () => {
  await Promise.all(db.tables.map((t) => t.clear()));
});

describe('owner account', () => {
  it('creates the account, signs in, and never stores the PIN in plain text', async () => {
    const created = await createOwner(owner);
    expect(created).toMatchObject({ ownerName: 'আসিফ', phone: '01711223344', pinLength: 4 });
    const { owner: stored, session } = await loadAuthState();
    expect(session).toBeTruthy();
    expect(stored.credential).toMatchObject({ algo: 'PBKDF2-SHA256' });
    expect(JSON.stringify(stored)).not.toContain('4826');
    await expect(createOwner(owner)).rejects.toMatchObject({ code: 'auth.err.exists' });
  });

  it('validates input', async () => {
    await expect(createOwner({ ...owner, ownerName: ' ' })).rejects.toMatchObject({ code: 'auth.err.ownerName' });
    await expect(createOwner({ ...owner, phone: '12345' })).rejects.toMatchObject({ code: 'auth.err.phone' });
    await expect(createOwner({ ...owner, pin: '12', pinConfirm: '12' })).rejects.toMatchObject({ code: 'auth.err.pinFormat' });
    await expect(createOwner({ ...owner, pin: '1234567', pinConfirm: '1234567' })).rejects.toMatchObject({ code: 'auth.err.pinFormat' });
    await expect(createOwner({ ...owner, pinConfirm: '9999' })).rejects.toMatchObject({ code: 'auth.err.pinMismatch' });
  });

  it('normalises Bangladeshi mobile numbers', () => {
    expect(normalizePhone('+8801911556677')).toBe('01911556677');
    expect(normalizePhone('০১৭১১২২৩৩৪৪')).toBe('01711223344');
    expect(normalizePhone('01211223344')).toBeNull();
  });
});

describe('PIN sign-in', () => {
  beforeEach(async () => {
    await createOwner(owner);
    await signOut();
  });

  it('signs in with the right PIN and stays signed in until logout', async () => {
    expect((await loadAuthState()).session).toBeNull();
    expect(await signInWithPin('4826')).toEqual({ ok: true });
    expect((await loadAuthState()).session).toBeTruthy();
    await signOut();
    expect((await loadAuthState()).session).toBeNull();
  });

  it('locks for one minute after 5 wrong tries, then allows the right PIN', async () => {
    const t0 = 1_000_000;
    for (let i = 1; i < MAX_ATTEMPTS; i++) {
      expect(await signInWithPin('0000', { now: t0 })).toEqual({ ok: false, attemptsLeft: MAX_ATTEMPTS - i, lockedUntil: 0 });
    }
    expect(await signInWithPin('0000', { now: t0 })).toEqual({ ok: false, attemptsLeft: 0, lockedUntil: t0 + LOCK_MS });
    // Even the right PIN is refused while locked.
    expect(await signInWithPin('4826', { now: t0 + LOCK_MS - 1 })).toMatchObject({ ok: false, lockedUntil: t0 + LOCK_MS });
    expect((await loadAuthState()).session).toBeNull();
    // After the minute it works, and the counter is reset.
    expect(await signInWithPin('4826', { now: t0 + LOCK_MS })).toEqual({ ok: true });
    expect((await loadAuthState()).owner).toMatchObject({ failedAttempts: 0, lockedUntil: 0 });
  });

  it('a correct PIN resets the wrong-try counter', async () => {
    await signInWithPin('1111');
    await signInWithPin('2222');
    await checkPin('4826');
    expect((await loadAuthState()).owner.failedAttempts).toBe(0);
  });

  it('changes the PIN only with the current PIN', async () => {
    await expect(changePin('9999', '135790', '135790')).rejects.toMatchObject({ code: 'auth.err.wrongPin' });
    await changePin('4826', '135790', '135790');
    expect((await checkPin('4826')).ok).toBe(false);
    expect((await checkPin('135790')).ok).toBe(true);
    expect((await loadAuthState()).owner.pinLength).toBe(6);
  });
});
