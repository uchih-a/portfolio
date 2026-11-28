import type { SVGProps } from 'react';

/**
 * Sky elements — placeholder silhouettes. Sun and moon carry layered
 * warm halos; Stars is a wide slice-cropped scatter field whose opacity
 * is keyed to the night/lateNight scenes. All render via registry.ts.
 */

/** Warm sun with layered glow (dawn / day scenes). */
export function Sun(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 90 90" aria-hidden="true" {...props}>
      <circle cx="45" cy="45" r="42" fill="rgba(243, 148, 25, 0.07)" />
      <circle cx="45" cy="45" r="32" fill="rgba(243, 148, 25, 0.14)" />
      <circle cx="45" cy="45" r="21" fill="rgba(243, 148, 25, 0.24)" />
      <circle cx="45" cy="45" r="14" fill="#F39419" />
    </svg>
  );
}

/** Crescent moon with a pale halo (dusk / night / lateNight scenes). */
export function Moon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 90 90" aria-hidden="true" {...props}>
      <circle cx="45" cy="45" r="40" fill="rgba(215, 226, 234, 0.05)" />
      <circle cx="45" cy="45" r="30" fill="rgba(215, 226, 234, 0.08)" />
      <path
        d="M58 24a23 23 0 1 0 0 42 18 18 0 1 1 0-42z"
        fill="#D7E2EA"
        opacity="0.92"
      />
    </svg>
  );
}

/** Wide star field, slice-cropped to whatever box it is given. */
export function Stars(props: SVGProps<SVGSVGElement>) {
  const stars: Array<[cx: number, cy: number, r: number, o: number]> = [
    [40, 60, 1.4, 0.9], [110, 140, 1, 0.55], [190, 90, 1.6, 0.85], [260, 210, 1, 0.5],
    [330, 50, 1.3, 0.8], [420, 160, 1.1, 0.6], [470, 80, 1.6, 0.9], [550, 190, 1, 0.45],
    [620, 110, 1.4, 0.75], [690, 240, 1.2, 0.6], [760, 60, 1, 0.5], [830, 150, 1.5, 0.85],
    [900, 100, 1, 0.55], [960, 220, 1.3, 0.7], [1030, 70, 1.6, 0.9], [1100, 180, 1.1, 0.6],
    [1160, 120, 1.4, 0.8], [75, 260, 1.2, 0.65], [225, 300, 1, 0.5], [385, 340, 1.5, 0.8],
    [520, 280, 1.1, 0.55], [660, 350, 1.4, 0.75], [800, 310, 1, 0.5], [940, 330, 1.6, 0.85],
    [1070, 290, 1.2, 0.6], [150, 470, 1.3, 0.7], [300, 520, 1, 0.5], [450, 450, 1.5, 0.8],
    [600, 500, 1.1, 0.6], [750, 540, 1.4, 0.75], [890, 480, 1, 0.5], [1020, 530, 1.6, 0.85],
    [1150, 460, 1.2, 0.6], [60, 680, 1.4, 0.8], [240, 720, 1, 0.5], [430, 660, 1.5, 0.8],
    [610, 710, 1.1, 0.55], [780, 670, 1.3, 0.7], [950, 700, 1, 0.5], [1110, 650, 1.4, 0.8],
    [170, 20, 1.1, 0.6], [560, 30, 1.3, 0.7], [860, 25, 1, 0.5],
  ];

  return (
    <svg
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      {...props}
    >
      {stars.map(([cx, cy, r, o]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill="#D7E2EA" opacity={o} />
      ))}
    </svg>
  );
}
