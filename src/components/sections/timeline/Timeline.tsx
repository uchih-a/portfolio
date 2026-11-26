import { useLayoutEffect, useRef, useState } from 'react';
import { m, useScroll, useTransform } from 'framer-motion';
import type { MotionValue } from 'framer-motion';
import { certifications, timeline } from '../../../data/timeline';
import type { TimelineEntry } from '../../../data/timeline';
import { useMediaQuery } from '../../../hooks/useMediaQuery';
import { useReducedMotion } from '../../../hooks/useReducedMotion';
import { cn } from '../../../lib/cn';
import FadeIn from '../../ui/FadeIn';
import SectionHeading from '../../ui/SectionHeading';
import './timeline.css';

/** Each dot sits at this fraction of the list height until measured. */
const UNMEASURED_FRACTION = (i: number, total: number) => (i + 0.5) / total;

/**
 * Timeline section: a vertical accent line that draws itself with the
 * scroll (scaleY 0 -> 1, origin top, #F39419 -> transparent gradient).
 * Each of the five entries has a dot on the line that fills with the
 * accent colour once the drawn line reaches it (measured positions, so
 * uneven entry heights are exact). Entries alternate left/right at
 * >= 768px in bordered panels (bg panel, 1px line border, 20px radius)
 * and stack on the right of the left-edge line below that. The last
 * entry (BSc, current milestone) has a soft pulsing ring on its dot.
 * Under prefers-reduced-motion the line renders fully drawn, every dot
 * is filled and nothing is revealed — content is simply there.
 */
export default function Timeline() {
  const reduced = useReducedMotion();
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 0.75', 'end 0.5'],
  });

  // Measured dot positions as fractions of the list height, so "the
  // line reaches the dot" is exact even with uneven entry heights.
  const [fractions, setFractions] = useState<number[]>(() =>
    timeline.map((_, i) => UNMEASURED_FRACTION(i, timeline.length)),
  );

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const items = Array.from(list.children) as HTMLElement[];

    const measure = () => {
      const height = list.offsetHeight;
      if (height === 0) return;
      setFractions(items.map((li) => Math.min(1, Math.max(0, (li.offsetTop + 14) / height))));
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(list);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  const lineScaleY = reduced ? 1 : scrollYProgress;

  return (
    <section
      id="timeline"
      aria-label="Timeline"
      ref={sectionRef}
      className="px-5 py-20 sm:px-8 sm:py-24 md:px-10 md:py-32"
    >
      <FadeIn y={40}>
        <SectionHeading title="Timeline" className="text-center" />
      </FadeIn>

      <div className="mx-auto mt-12 max-w-5xl sm:mt-16 md:mt-20">
        <div className="tl-list">
          <m.div
            aria-hidden="true"
            className="tl-line"
            style={{ scaleY: lineScaleY }}
          />
          <ol ref={listRef} aria-label="Career and study timeline">
            {timeline.map((entry, i) => {
              const isLast = i === timeline.length - 1;
              const sideLeft = i % 2 === 0;
              return (
                <li
                  key={entry.id}
                  className="relative pb-10 last:pb-12 md:grid md:grid-cols-2 md:gap-x-10 md:pb-14"
                >
                  <Dot
                    progress={scrollYProgress}
                    fraction={fractions[i] ?? UNMEASURED_FRACTION(i, timeline.length)}
                    current={isLast}
                    reduced={reduced}
                  />
                  <div
                    className={cn(
                      'pl-10 md:pl-0',
                      sideLeft ? 'md:col-start-1 md:justify-self-end' : 'md:col-start-2',
                    )}
                  >
                    <EntryPanel entry={entry} reveal={reduced ? 'none' : isDesktop ? (sideLeft ? 'left' : 'right') : 'up'} />
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        <FadeIn y={24} className="pl-10 md:pl-0">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-muted">
            Certifications
          </p>
          <ul className="mt-4 flex flex-wrap gap-2.5">
            {certifications.map((cert) => (
              <li
                key={cert}
                className="rounded-full border border-line px-4 py-2 text-xs font-medium text-muted"
              >
                {cert}
              </li>
            ))}
          </ul>
        </FadeIn>
      </div>
    </section>
  );
}

/**
 * One dot on the line. The accent fill scales in when the drawn line
 * reaches the dot (fraction of list height); the current milestone
 * additionally wears a soft pulsing ring (never under reduced motion).
 */
function Dot({
  progress,
  fraction,
  current,
  reduced,
}: {
  progress: MotionValue<number>;
  fraction: number;
  current: boolean;
  reduced: boolean;
}) {
  const fill = useTransform(progress, [Math.max(0, fraction - 0.05), fraction], [0, 1]);

  return (
    <span className="tl-dot" aria-hidden="true">
      <span className="tl-dot-mark">
        <m.span
          className="tl-dot-fill"
          style={{ scale: reduced ? 1 : fill }}
        />
      </span>
      {current && !reduced && <span className="tl-dot-pulse" />}
    </span>
  );
}

/** Panel with date pill, title, org and description. */
function EntryPanel({
  entry,
  reveal,
}: {
  entry: TimelineEntry;
  reveal: 'none' | 'left' | 'right' | 'up';
}) {
  const panel = (
    <div className="w-full max-w-md rounded-[20px] border border-line bg-panel p-5 md:p-6">
      <p className="inline-flex items-center rounded-full border border-accent/40 bg-accent/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-accent">
        {entry.period}
      </p>
      <h3 className="mt-3 text-lg font-bold sm:text-xl">{entry.title}</h3>
      {entry.org && <p className="mt-1 text-sm text-muted">{entry.org}</p>}
      {entry.description && (
        <p className="mt-3 text-sm leading-relaxed text-muted">{entry.description}</p>
      )}
    </div>
  );

  if (reveal === 'none') return panel;

  const x = reveal === 'left' ? -40 : reveal === 'right' ? 40 : 0;
  const y = reveal === 'up' ? 24 : 0;

  return (
    <FadeIn x={x} y={y} duration={0.7}>
      {panel}
    </FadeIn>
  );
}
