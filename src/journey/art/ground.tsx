import type { SVGProps } from 'react';

/**
 * Ground layer placeholder — one tile of the walking ground, tiled
 * edge to edge across the world (stretched with preserveAspectRatio
 * "none"). A faint warm horizon line marks where the feet land.
 * Rendered via registry.ts.
 */
export function GroundPath(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 480 140" preserveAspectRatio="none" aria-hidden="true" {...props}>
      <rect x="0" y="0" width="480" height="140" fill="#121419" />
      <rect x="0" y="0" width="480" height="3" fill="rgba(243, 148, 25, 0.22)" />
      <rect x="0" y="36" width="480" height="34" fill="#161a20" opacity="0.9" />
      {[24, 84, 144, 204, 264, 324, 384, 444].map((x) => (
        <rect key={x} x={x} y="51" width="26" height="4" rx="2" fill="#0d0f13" />
      ))}
      <ellipse cx="70" cy="104" rx="9" ry="4" fill="rgba(255, 255, 255, 0.05)" />
      <ellipse cx="210" cy="122" rx="12" ry="5" fill="rgba(255, 255, 255, 0.04)" />
      <ellipse cx="350" cy="98" rx="8" ry="3.5" fill="rgba(255, 255, 255, 0.05)" />
    </svg>
  );
}
