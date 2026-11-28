import type { SVGProps } from 'react';

/**
 * Foreground layer placeholder — one tile of dark grass tufts and a
 * stone, tiled across the foreground strip (this layer scrolls faster
 * than the ground, so it slides past in front of the character).
 * Rendered via registry.ts.
 */
export function GrassTufts(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 480 120" preserveAspectRatio="none" aria-hidden="true" {...props}>
      <g fill="#08090c">
        <path d="M28 120 L34 74 L40 120 Z" />
        <path d="M36 120 L44 62 L52 120 Z" />
        <path d="M50 120 L56 82 L62 120 Z" />
        <path d="M148 120 L156 66 L164 120 Z" />
        <path d="M158 120 L168 50 L178 120 Z" />
        <path d="M172 120 L178 78 L184 120 Z" />
        <path d="M300 120 L306 70 L312 120 Z" />
        <path d="M310 120 L320 58 L330 120 Z" />
        <path d="M322 120 L328 84 L334 120 Z" />
        <path d="M430 120 L438 64 L446 120 Z" />
        <path d="M440 120 L448 46 L456 120 Z" />
      </g>
      <ellipse cx="230" cy="112" rx="18" ry="9" fill="#0a0b0f" />
      <ellipse cx="232" cy="110" rx="12" ry="6" fill="#0d0f13" />
    </svg>
  );
}
