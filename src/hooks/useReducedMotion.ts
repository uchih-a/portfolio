import { useReducedMotion as useFramerReducedMotion } from 'framer-motion';

/**
 * Wrapper around framer-motion's useReducedMotion.
 * Normalises the null returned during SSR/hydration to a definite boolean,
 * so callers can branch without null-handling.
 */
export function useReducedMotion(): boolean {
  return useFramerReducedMotion() ?? false;
}
