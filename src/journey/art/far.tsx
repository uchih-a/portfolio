import type { SVGProps } from 'react';

/**
 * Far layer placeholder — one tile of rolling hills, tiled across the
 * world with alternating mirroring for variety. Rendered via registry.ts.
 */
export function FarHills(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 480 200" preserveAspectRatio="none" aria-hidden="true" {...props}>
      <path
        d="M0 200 L0 132 Q70 58 150 122 T310 116 Q396 66 480 138 L480 200 Z"
        fill="#10141a"
      />
      <path
        d="M0 200 L0 158 Q110 96 240 152 T480 144 L480 200 Z"
        fill="#0d1116"
        opacity="0.85"
      />
      <circle cx="250" cy="84" r="2" fill="#D7E2EA" opacity="0.35" />
      <circle cx="290" cy="70" r="1.5" fill="#D7E2EA" opacity="0.3" />
    </svg>
  );
}
