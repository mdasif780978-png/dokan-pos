import { useAuth } from '../../auth/AuthProvider';
import { PinScreen } from './PinScreen';
import { SetupScreen } from './SetupScreen';

/** Shows first-time setup, the PIN screen, or the app itself. */
export function AuthGate({ children }) {
  const { status } = useAuth();
  if (status === 'loading') return null; // the splash covers this moment
  if (status === 'setup') return <SetupScreen />;
  if (status === 'signedOut') return <PinScreen />;
  return children;
}
