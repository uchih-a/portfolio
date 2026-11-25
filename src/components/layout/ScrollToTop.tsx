import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Attempts before giving up on a hash target (covers route-exit animation delay). */
const MAX_ATTEMPTS = 20;
const ATTEMPT_INTERVAL_MS = 50;

/**
 * On every route change:
 * - without a hash, jump instantly to the top;
 * - with a hash (#projects, #contact, ...), scroll to that element once it
 *   exists in the DOM. `behavior: 'auto'` defers to the CSS scroll-behavior,
 *   which is smooth normally and instant under prefers-reduced-motion.
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }
    const id = hash.slice(1);
    let attempts = 0;
    const timer = window.setInterval(() => {
      attempts += 1;
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ behavior: 'auto', block: 'start' });
        window.clearInterval(timer);
      } else if (attempts >= MAX_ATTEMPTS) {
        window.clearInterval(timer);
      }
    }, ATTEMPT_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [pathname, hash]);

  return null;
}
