import type { SVGProps } from 'react';

/**
 * Mid layer placeholders — one landmark per scene (viewBox 0 0 320 260,
 * bottom edge on the ground line). Dark silhouettes (#14171d family)
 * with lit windows / marks in the warm accent (#F39419). The hospital
 * serves both the AMPATH and MTRH scenes. All render via registry.ts.
 */

/** Scene 1 — school gate: pillars, arch beam, signboard, gate bars. */
export function SchoolGate(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 320 260" aria-hidden="true" {...props}>
      <g fill="#14171d">
        <rect x="52" y="64" width="22" height="196" rx="3" />
        <rect x="246" y="64" width="22" height="196" rx="3" />
        <rect x="44" y="42" width="232" height="28" rx="7" />
        <rect x="116" y="47" width="88" height="19" rx="4" fill="#0e1116" />
      </g>
      <rect x="130" y="53" width="60" height="6" rx="3" fill="#F39419" opacity="0.75" />
      <g fill="#14171d" opacity="0.55">
        {[86, 112, 138, 164, 190, 216].map((x) => (
          <rect key={x} x={x} y="118" width="7" height="142" rx="3" />
        ))}
      </g>
      <circle cx="63" cy="104" r="4" fill="#F39419" opacity="0.8" />
      <circle cx="257" cy="104" r="4" fill="#F39419" opacity="0.8" />
    </svg>
  );
}

/** Scene 2 — dorm block with a few lit windows. */
export function DormBlock(props: SVGProps<SVGSVGElement>) {
  const cols = [56, 96, 136, 176, 216, 256];
  return (
    <svg viewBox="0 0 320 260" aria-hidden="true" {...props}>
      <rect x="34" y="60" width="256" height="16" rx="5" fill="#101319" />
      <rect x="44" y="72" width="236" height="188" rx="8" fill="#14171d" />
      {[100, 148, 196].map((y) =>
        cols.map((x) => {
          const lit = (x + y) % 176 === 0;
          return (
            <rect
              key={`${x}-${y}`}
              x={x}
              y={y}
              width="22"
              height="28"
              rx="3"
              fill={lit ? '#F39419' : '#0b0e13'}
              opacity={lit ? 0.75 : 1}
            />
          );
        }),
      )}
      <rect x="136" y="212" width="44" height="48" rx="4" fill="#0b0e13" />
      <rect x="154" y="212" width="6" height="48" rx="2" fill="#F39419" opacity="0.55" />
    </svg>
  );
}

/** Scene 3 — modern campus gate with trees. */
export function CampusGate(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 320 260" aria-hidden="true" {...props}>
      <g fill="#14171d">
        <rect x="52" y="66" width="34" height="194" rx="4" />
        <rect x="234" y="66" width="34" height="194" rx="4" />
        <rect x="44" y="50" width="232" height="32" rx="8" />
      </g>
      <rect x="126" y="57" width="68" height="8" rx="4" fill="#F39419" opacity="0.6" />
      <g fill="#14171d" opacity="0.5">
        {[92, 116, 140, 164, 188, 212].map((x) => (
          <rect key={x} x={x} y="124" width="6" height="136" rx="3" />
        ))}
      </g>
      <g fill="#10141a">
        <circle cx="22" cy="196" r="26" />
        <rect x="18" y="216" width="8" height="44" rx="3" />
        <circle cx="298" cy="188" r="30" />
        <rect x="294" y="208" width="8" height="52" rx="3" />
      </g>
    </svg>
  );
}

/** Scene 4 — trophy on a pedestal (the sunny win). */
export function Trophy(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 320 260" aria-hidden="true" {...props}>
      <circle cx="160" cy="118" r="92" fill="rgba(243, 148, 25, 0.06)" />
      <g fill="#14171d">
        <path d="M118 56 H202 L198 108 C193 140 177 158 160 158 C143 158 127 140 122 108 Z" />
        <rect x="152" y="156" width="16" height="30" rx="3" />
        <rect x="128" y="186" width="64" height="16" rx="4" />
        <rect x="116" y="202" width="88" height="58" rx="6" fill="#101319" />
      </g>
      <path
        d="M118 62 H92 V86 C92 108 104 120 118 122"
        stroke="#14171d"
        strokeWidth="10"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M202 62 H228 V86 C228 108 216 120 202 122"
        stroke="#14171d"
        strokeWidth="10"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="160" cy="100" r="7" fill="#F39419" opacity="0.85" />
      <rect x="132" y="216" width="56" height="6" rx="3" fill="#F39419" opacity="0.4" />
    </svg>
  );
}

/** Scenes 5 and 6 — hospital block with an accent plus sign. */
export function Hospital(props: SVGProps<SVGSVGElement>) {
  const cols = [62, 92, 122, 152, 182, 212];
  return (
    <svg viewBox="0 0 320 260" aria-hidden="true" {...props}>
      <g fill="#14171d">
        <rect x="46" y="64" width="180" height="196" rx="8" />
        <rect x="226" y="112" width="70" height="148" rx="8" />
      </g>
      <rect x="112" y="210" width="48" height="50" rx="3" fill="#0b0e13" />
      <rect x="132" y="210" width="6" height="50" rx="2" fill="#F39419" opacity="0.55" />
      <g fill="#F39419">
        <rect x="117" y="72" width="38" height="10" rx="2" opacity="0.9" />
        <rect x="131" y="58" width="10" height="38" rx="2" opacity="0.9" />
      </g>
      {[100, 148, 196].map((y) =>
        cols.map((x) => {
          const lit = (x * y) % 231 === 0;
          return (
            <rect
              key={`${x}-${y}`}
              x={x}
              y={y}
              width="18"
              height="24"
              rx="2"
              fill={lit ? '#F39419' : '#0b0e13'}
              opacity={lit ? 0.7 : 1}
            />
          );
        }),
      )}
      {[246, 272].map((x) => (
        <rect key={x} x={x} y="140" width="14" height="22" rx="2" fill="#0b0e13" />
      ))}
    </svg>
  );
}

/** Scene 7 — shop front: awning, lit window, hanging sign. */
export function ShopFront(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 320 260" aria-hidden="true" {...props}>
      <rect x="36" y="90" width="248" height="170" rx="8" fill="#14171d" />
      <path d="M30 96 L290 96 L278 66 L42 66 Z" fill="#101319" />
      {[52, 96, 140, 184, 228, 272].map((x) => (
        <rect key={x} x={x - 4} y="68" width="8" height="26" rx="3" fill="#F39419" opacity="0.35" />
      ))}
      <rect x="56" y="126" width="208" height="92" rx="6" fill="#0b0e13" />
      <rect x="64" y="134" width="192" height="76" rx="5" fill="rgba(243, 148, 25, 0.1)" />
      <rect x="139" y="126" width="42" height="92" rx="3" fill="#14171d" />
      <rect x="150" y="166" width="20" height="52" rx="3" fill="#F39419" opacity="0.5" />
      <rect x="138" y="58" width="44" height="12" rx="3" fill="#101319" />
      <rect x="146" y="61" width="28" height="5" rx="2.5" fill="#F39419" opacity="0.65" />
    </svg>
  );
}

/** Scene 8 — graduation cap with tassel. */
export function GradCap(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 320 260" aria-hidden="true" {...props}>
      <circle cx="160" cy="108" r="118" fill="rgba(243, 148, 25, 0.05)" />
      <path d="M160 56 L296 106 L160 156 L24 106 Z" fill="#14171d" />
      <path d="M112 108 Q160 84 208 108 L208 120 Q160 140 112 120 Z" fill="#101319" />
      <path d="M296 106 L296 168" stroke="#F39419" strokeWidth="3" opacity="0.85" />
      <circle cx="296" cy="172" r="6" fill="#F39419" opacity="0.9" />
      <rect x="112" y="120" width="96" height="8" rx="4" fill="#0d1015" />
    </svg>
  );
}
