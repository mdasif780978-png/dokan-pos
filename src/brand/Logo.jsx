// The logo file is under 4 KB, so Vite inlines it into the JS bundle: it shows
// instantly on the splash screen and needs no network request (works offline).
import markUrl from './logo-mark.svg';

/** The Dokan Hishab logo mark (awning + receipt). Designed for a green background. */
export function LogoMark({ className = '', alt = '' }) {
  return <img src={markUrl} className={className} alt={alt} draggable="false" />;
}
