import type { SVGProps } from 'react';

/**
 * Stage figures — placeholder silhouettes (viewBox 0 0 120 240, feet at
 * y=240). Each stage is drawn at a different internal height so the
 * character visibly grows as the walk progresses. The two leg groups
 * carry jx-legA / jx-legB for the CSS walk cycle; the warm accent
 * (#F39419) marks the small carried items (strap, badge, lanyard).
 * All figures render via the registry in registry.ts.
 */

/** Stage 0 — child, no bag yet (school, 2018). */
export function ChildFigure(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 120 240" aria-hidden="true" {...props}>
      <g fill="currentColor">
        <g className="jx-leg jx-legA">
          <rect x="50" y="166" width="12" height="72" rx="5" />
        </g>
        <g className="jx-leg jx-legB">
          <rect x="60" y="166" width="12" height="72" rx="5" />
        </g>
        <rect x="33" y="104" width="11" height="48" rx="5" transform="rotate(12 38 110)" />
        <rect x="76" y="104" width="11" height="48" rx="5" transform="rotate(-12 82 110)" />
        <rect x="44" y="96" width="32" height="72" rx="14" />
        <circle cx="60" cy="78" r="15" />
      </g>
    </svg>
  );
}

/** Stage 1 — teen, small backpack (late school / university start). */
export function TeenFigure(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 120 240" aria-hidden="true" {...props}>
      <g fill="currentColor">
        <rect x="22" y="64" width="19" height="46" rx="8" opacity="0.92" />
        <g className="jx-leg jx-legA">
          <rect x="50" y="146" width="13" height="92" rx="5" />
        </g>
        <g className="jx-leg jx-legB">
          <rect x="61" y="146" width="13" height="92" rx="5" />
        </g>
        <rect x="30" y="66" width="12" height="62" rx="6" transform="rotate(10 36 72)" />
        <rect x="78" y="66" width="12" height="62" rx="6" transform="rotate(-10 84 72)" />
        <rect x="42" y="58" width="36" height="90" rx="16" />
        <circle cx="60" cy="40" r="15" />
      </g>
      <rect x="47" y="62" width="4" height="42" rx="2" fill="#F39419" opacity="0.85" />
    </svg>
  );
}

/** Stage 2 — student, laptop bag on the side and a chest badge. */
export function StudentFigure(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 120 240" aria-hidden="true" {...props}>
      <g fill="currentColor">
        <g className="jx-leg jx-legA">
          <rect x="50" y="142" width="13" height="96" rx="5" />
        </g>
        <g className="jx-leg jx-legB">
          <rect x="61" y="142" width="13" height="96" rx="5" />
        </g>
        <rect x="28" y="50" width="12" height="64" rx="6" transform="rotate(9 34 56)" />
        <rect x="80" y="50" width="12" height="64" rx="6" transform="rotate(-9 86 56)" />
        <rect x="40" y="42" width="40" height="102" rx="17" />
        <circle cx="60" cy="24" r="15" />
        <rect x="78" y="104" width="27" height="37" rx="7" opacity="0.95" />
        <path d="M44 52 Q64 68 80 106" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.9" />
      </g>
      <rect x="49" y="52" width="13" height="9" rx="2" fill="#F39419" opacity="0.9" />
    </svg>
  );
}

/** Stage 3 — engineer, broader frame, laptop bag and lanyard badge. */
export function EngineerFigure(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 120 240" aria-hidden="true" {...props}>
      <g fill="currentColor">
        <g className="jx-leg jx-legA">
          <rect x="50" y="140" width="14" height="98" rx="5" />
        </g>
        <g className="jx-leg jx-legB">
          <rect x="61" y="140" width="14" height="98" rx="5" />
        </g>
        <rect x="26" y="46" width="12" height="66" rx="6" transform="rotate(8 32 52)" />
        <rect x="82" y="46" width="12" height="66" rx="6" transform="rotate(-8 88 52)" />
        <rect x="38" y="36" width="44" height="106" rx="18" />
        <circle cx="60" cy="18" r="15" />
        <rect x="82" y="110" width="28" height="38" rx="7" opacity="0.95" />
        <path d="M40 48 Q66 70 84 112" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.9" />
      </g>
      <path d="M52 38 L57 58" stroke="#F39419" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
      <rect x="50" y="57" width="14" height="10" rx="2" fill="#F39419" opacity="0.9" />
    </svg>
  );
}
