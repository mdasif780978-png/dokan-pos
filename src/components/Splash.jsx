import { useEffect, useState } from 'react';
import { LogoMark } from '../brand/Logo';

const SHOW_MS = 1700; // logo + name animation, then hold
const FADE_MS = 450; // fade-out into the sign-in screen / app
const REDUCED_MS = 700;

/**
 * Animated splash shown each time the app is opened. It sits on top of the app while
 * the app loads underneath, then fades away. Tap to skip.
 * The Android launch screen before it (manifest background_color + icon) is the same green.
 */
export function Splash() {
  const [phase, setPhase] = useState('in'); // in → out → done

  useEffect(() => {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const timer = setTimeout(() => setPhase('out'), reduced ? REDUCED_MS : SHOW_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (phase !== 'out') return undefined;
    const timer = setTimeout(() => setPhase('done'), FADE_MS);
    return () => clearTimeout(timer);
  }, [phase]);

  if (phase === 'done') return null;
  return (
    <div className={`splash ${phase === 'out' ? 'splash-out' : ''}`} onClick={() => setPhase('out')} aria-hidden="true">
      <div className="splash-content">
        <LogoMark className="splash-logo" />
        <div className="splash-text">
          <div className="splash-name">দোকান হিসাব</div>
          <div className="splash-sub">Dokan Hishab</div>
        </div>
      </div>
    </div>
  );
}
