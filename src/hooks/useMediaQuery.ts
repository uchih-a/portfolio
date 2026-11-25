import { useEffect, useState } from 'react';

/**
 * Reactive media-query match used to switch the navbar between its
 * desktop (morphing dropdown) and mobile (sheet) implementations.
 * The app is a client-rendered SPA, so window is always available.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}
