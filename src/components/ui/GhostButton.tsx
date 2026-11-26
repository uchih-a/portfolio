import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/cn';

interface GhostButtonProps {
  children: ReactNode;
  className?: string;
  /** Internal router destination (SPA navigation). */
  to?: string;
  /** External URL. */
  href?: string;
  type?: 'button' | 'submit';
  onClick?: () => void;
  ariaLabel?: string;
}

/** Secondary action: pill, 2px ink border, uppercase, wide tracking. */
export default function GhostButton({
  children,
  className,
  to,
  href,
  type = 'button',
  onClick,
  ariaLabel,
}: GhostButtonProps) {
  const classes = cn(
    'inline-flex min-h-11 items-center justify-center rounded-full border-2 border-ink px-6 py-3 text-xs font-semibold uppercase tracking-widest text-ink transition-colors hover:bg-white/5',
    className,
  );

  if (to && to.startsWith('#')) {
    // Same-page fragment: a native anchor re-scrolls on every click,
    // even when the hash is already set (a router Link would not).
    return (
      <a href={to} className={classes} aria-label={ariaLabel}>
        {children}
      </a>
    );
  }

  if (to) {
    return (
      <Link to={to} className={classes} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        className={classes}
        aria-label={ariaLabel}
      >
        {children}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes} aria-label={ariaLabel}>
      {children}
    </button>
  );
}
