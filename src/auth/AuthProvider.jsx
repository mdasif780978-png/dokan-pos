import { createContext, useContext, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import * as localAuth from './localAuth';

/**
 * Sign-in state for the whole app.
 *   status: 'loading' | 'setup' (no account yet) | 'signedOut' (PIN needed) | 'signedIn'
 * The state is read live from IndexedDB, so signing out, clearing data or
 * restoring a backup updates every screen automatically.
 */
const AuthContext = createContext(null);
const backend = localAuth; // swap or combine with a cloud backend later (see README.md)

export function AuthProvider({ children }) {
  const state = useLiveQuery(() => backend.loadAuthState(), []);

  const value = useMemo(() => {
    let status = 'loading';
    if (state) status = !state.owner ? 'setup' : state.session ? 'signedIn' : 'signedOut';
    return {
      status,
      owner: backend.publicOwner(state?.owner),
      createOwner: backend.createOwner,
      signIn: backend.signInWithPin,
      checkPin: backend.checkPin,
      changePin: backend.changePin,
      signOut: backend.signOut,
    };
  }, [state]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
