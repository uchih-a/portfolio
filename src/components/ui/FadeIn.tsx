import { m } from 'framer-motion';
import type { ReactNode } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { cn } from '../../lib/cn';

interface FadeInProps {
  children: ReactNode;
  className?: string;
  /** Seconds before the animation starts. */
  delay?: number;
  /** Animation length in seconds. */
  duration?: number;
  /** Horizontal offset (px) the block starts from. */
  x?: number;
  /** Vertical offset (px) the block starts from. */
  y?: number;
}

/**
 * Fades (and drifts) content into view once, when it enters the viewport.
 * Under prefers-reduced-motion the offset is dropped and only a simple fade runs.
 */
export default function FadeIn({
  children,
  className,
  delay = 0,
  duration = 0.6,
  x = 0,
  y = 24,
}: FadeInProps) {
  const reduced = useReducedMotion();
  const offset = reduced ? { x: 0, y: 0 } : { x, y };

  return (
    <m.div
      className={cn(className)}
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </m.div>
  );
}
