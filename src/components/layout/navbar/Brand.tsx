import { Link } from 'react-router-dom';
import { nav } from '../../../data/nav';

/**
 * Brand mark: an "AN" monogram set in a white rounded pebble.
 * Links home; there is no accompanying wordmark. The accessible name
 * includes the visible "AN" glyphs so speech input matches
 * (label-content-name-mismatch).
 */
export default function Brand() {
  return (
    <Link
      to={nav.brand.href}
      aria-label="AN — home"
      className="flex h-11 w-11 items-center justify-center rounded-full transition-colors duration-200 hover:bg-white/5"
    >
      <svg
        width="34"
        height="34"
        viewBox="0 0 36 36"
        aria-hidden="true"
        focusable="false"
      >
        <rect width="36" height="36" rx="12" fill="#FFFFFF" />
        <text
          x="18"
          y="19"
          textAnchor="middle"
          dominantBaseline="central"
          fill="#0C0C0C"
          fontFamily="'Urbanist Variable', Urbanist, ui-sans-serif, sans-serif"
          fontSize="13"
          fontWeight="800"
          letterSpacing="0.5"
        >
          AN
        </text>
      </svg>
    </Link>
  );
}
