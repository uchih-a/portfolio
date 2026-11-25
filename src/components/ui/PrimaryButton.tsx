import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/cn';

interface PrimaryButtonProps {
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

/** Primary CTA: pill with the signature gradient, white text. */
export default function PrimaryButton({
  children,
  className,
  to,
  href,
  type = 'button',
  onClick,
  ariaLabel,
}: PrimaryButtonProps) {
  const classes = cn(
    'inline-flex min-h-11 items-center justify-center rounded-full bg-[linear-gradient(123deg,#18011F_7%,#B600A8_37%,#7621B0_72%,#BE4C00_100%)] px-7 py-3 text-sm font-bold tracking-wide text-white transition-[filter] duration-200 hover:brightness-110',
    className,
  );

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
