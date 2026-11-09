# Sign-in (auth)

Version 1 uses a **local, offline** owner account. It needs no internet and no server.

| File | Purpose |
|---|---|
| `pin.js` | PIN hashing: PBKDF2-SHA256, 120 000 iterations, random 16-byte salt (Web Crypto). The PIN itself is never stored. |
| `localAuth.js` | The local backend: `createOwner`, `checkPin` (5 wrong tries, then a 1-minute lock), `signInWithPin`, `signOut`, `changePin`. Data lives in the IndexedDB table `auth`. |
| `AuthProvider.jsx` | React context. `status` is `loading`, `setup`, `signedOut` or `signedIn`, read live from IndexedDB. |
| `../features/auth/*` | Screens: setup, PIN sign-in, forgot PIN, PIN-confirm dialog. |

How it behaves:
- **First run** asks for shop name, owner name, mobile number and a 4–6 digit PIN.
  The app then signs in and adds the demo items if the shop has no products yet.
- **Later runs** stay signed in until the owner taps **Log out** (Settings).
  After logging out, the app asks for the PIN only.
- **5 wrong PINs** lock sign-in for 1 minute. The lock survives reloads because it is
  stored in IndexedDB. The same check protects **Clear all data**.
- **Backups never contain the `auth` table.** A backup file can be shared without
  exposing the PIN hash, and restoring a backup keeps this device's own PIN.
- **Limits.** The PIN is a lock against casual use of the tablet. It is not
  encryption: the shop data in IndexedDB is not encrypted, and a 4–6 digit PIN can
  be brute-forced by someone who copies the browser's files. Cloud login (below) is
  the step up.
- **HTTPS needed.** Web Crypto only works on `https://` or `localhost`, so setting a
  PIN fails on a plain `http://192.168.x.x` address.

## Adding Supabase later

The owner record already has a `remoteId` field (null for now). Plan:

1. `npm install @supabase/supabase-js`, and add `VITE_SUPABASE_URL` and
   `VITE_SUPABASE_ANON_KEY` to Vercel's environment variables.
2. Create `src/auth/supabaseAuth.js` that exports the same functions as `localAuth.js`.
   `createOwner` would sign up with phone OTP (`supabase.auth.signInWithOtp({ phone })`)
   or email.
3. Keep the **PIN as the quick offline unlock** on the tablet. After the first online
   login, store the Supabase user id in `owner.remoteId`. Supabase keeps its own
   session and refreshes it when the internet returns.
4. In `AuthProvider.jsx`, change `const backend = localAuth` to a backend that calls
   Supabase when online and falls back to `localAuth` when offline.
5. Data sync (products, sales, khata to Supabase tables) is a separate step. Every
   record already has `createdAt`/`updatedAt`, which a sync job can use.

The rest of the app only uses `useAuth()`, so none of the screens need to change.
