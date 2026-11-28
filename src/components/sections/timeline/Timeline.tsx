import { useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { m, useScroll, useTransform } from 'framer-motion';
import type { MotionValue } from 'framer-motion';
import { Activity, Briefcase, Flag, GraduationCap, Store, Trophy } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { timeline } from '../../../data/timeline';
import type { TimelineEntry } from '../../../data/timeline';
import { useReducedMotion } from '../../../hooks/useReducedMotion';
import FadeIn from '../../ui/FadeIn';
import GhostButton from '../../ui/GhostButton';
import SectionHeading from '../../ui/SectionHeading';
import './timeline.css';

/** Each dot sits at this fraction of the list height until measured. */
const UNMEASURED_FRACTION = (i: number, total: number) => (i + 0.5) / total;

/** Small icon per entry type (tinted chip next to the period pill). */
const TYPE_ICON: Record<TimelineEntry['type'], LucideIcon> = {
  education: GraduationCap,
  experience: Briefcase,
  achievement: Trophy,
  venture: Store,
  milestone: Flag,
  now: Activity,
};

/**
 * Timeline section, simple and single-column at every size: a vertical
 * accent line on the left draws itself with the scroll (scaleY 0 -> 1,
 * origin top, accent -> transparent), and each entry's dot on the line
 * fills with the accent colour once the drawn line reaches its measured
 * position (exact even with uneven entry heights). Every entry is one
 * card — period pill, title, org/location, summary, achievement badges,
 * a compact parts list for MTRH — with a small type icon and a subtle
 * per-type background/border tint. The 'now' entry's dot wears a soft
 * pulsing ring. Under prefers-reduced-motion the line renders fully
 * drawn, every dot is filled and nothing animates. Below the list: a
 * GhostButton to /journey and a quiet references line. Referee names
 * and contact details are never rendered here.
 */
export default function Timeline() {
  const reduced = useReducedMotion();

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

      <div className="mx-auto mt-12 max-w-2xl sm:mt-16 md:mt-20">
        <div className="tl-list">
          <m.div
            aria-hidden="true"
            className="tl-line"
            style={{ scaleY: reduced ? 1 : scrollYProgress }}
          />
          <ol ref={listRef} aria-label="Career and study timeline">
            {timeline.map((entry, i) => (
              <li
                key={entry.id}
                data-type={entry.type}
                className="tl-item relative pb-10 pl-9 last:pb-2"
              >
                <Dot
                  progress={scrollYProgress}
                  fraction={fractions[i] ?? UNMEASURED_FRACTION(i, timeline.length)}
                  current={entry.type === 'now'}
                  reduced={reduced}
                />
                <FadeIn y={24}>
                  <EntryCard entry={entry} />
                </FadeIn>
              </li>
            ))}
          </ol>
        </div>

        <FadeIn y={24} className="pl-9">
          <div className="mt-4 flex flex-col items-start gap-4">
            <GhostButton to="/journey">Walk my journey →</GhostButton>
            <p className="text-xs text-muted">References available on request.</p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/**
 * One dot on the line. The accent fill scales in when the drawn line
 * reaches the dot (fraction of list height); the 'now' entry
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
        <m.span className="tl-dot-fill" style={{ scale: reduced ? 1 : fill }} />
      </span>
      {current && !reduced && <span className="tl-dot-pulse" />}
    </span>
  );
}

/** One entry: single-column card with type icon, tint, content and link. */
function EntryCard({ entry }: { entry: TimelineEntry }) {
  const Icon = TYPE_ICON[entry.type];

  return (
    <article className="tl-card">
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="tl-typeicon" aria-hidden="true">
          <Icon size={14} strokeWidth={1.8} />
        </span>
        <span className="tl-pill">{entry.period}</span>
      </div>

      <h3 className="mt-3 text-lg font-bold sm:text-xl">{entry.title}</h3>
      {entry.org && <p className="mt-1 text-sm text-muted">{entry.org}</p>}
      {entry.location && <p className="mt-0.5 text-sm text-muted">{entry.location}</p>}
      {entry.summary && <p className="mt-3 text-sm leading-relaxed text-muted">{entry.summary}</p>}

      {entry.achievements && (
        <ul className="mt-3 flex flex-wrap gap-2">
          {entry.achievements.map((achievement) => (
            <li
              key={achievement}
              className="rounded-full border border-line bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted"
            >
              {achievement}
            </li>
          ))}
        </ul>
      )}

      {entry.parts && (
        <ul className="mt-3 space-y-1.5">
          {entry.parts.map((part) => (
            <li key={part.title} className="text-sm leading-relaxed">
              <span className="font-semibold">{part.title}</span>
              <span className="text-muted"> — {part.detail}</span>
            </li>
          ))}
        </ul>
      )}

      {entry.link && <EntryLink label={entry.link.label} href={entry.link.href} />}
    </article>
  );
}

/** Entry link: internal paths use the router, anything else a plain anchor. */
function EntryLink({ label, href }: { label: string; href: string }) {
  const classes =
    'mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent transition-colors hover:text-ink';

  if (href.startsWith('/')) {
    return (
      <Link to={href} className={classes}>
        {label}
      </Link>
    );
  }

  return (
    <a href={href} target="_blank" rel="noreferrer noopener" className={classes}>
      {label}
    </a>
  );
}
