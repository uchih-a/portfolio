import { m, useTransform } from 'framer-motion';
import type { MotionValue } from 'framer-motion';
import { Code, ExternalLink } from 'lucide-react';
import type { Project } from '../../../data/projects';
import { media } from '../../../data/media';
import { cn } from '../../../lib/cn';
import FadeIn from '../../ui/FadeIn';
import Video from '../../ui/Video';

interface CardProps {
  project: Project;
  index: number;
}

interface StackingCardProps extends CardProps {
  total: number;
  progress: MotionValue<number>;
  /** True under prefers-reduced-motion: sticky stays, the scale freezes at 1. */
  freezeScale: boolean;
}

/** Shared pill class for the Live / Code link buttons. */
const linkButtonClass =
  'inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-ink px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-ink transition-colors hover:bg-white/10 sm:px-8 sm:text-sm';

/**
 * Sticky-stacking variant (>= 640px, motion allowed): each card's wrapper
 * is sticky (top-24 / md:top-32) inside the shared cards container, so
 * the next card scrolls over the stuck one; the card is scaled down
 * (targetScale = 1 - (total - 1 - index) * 0.03) as that happens and
 * offset by index * 28px so the cards below peek out in a stack.
 */
export function StackingCard({
  project,
  index,
  total,
  progress,
  freezeScale,
}: StackingCardProps) {
  const targetScale = 1 - (total - 1 - index) * 0.03;
  const rangeStart = index / total;
  const scale = useTransform(progress, [rangeStart, 1], [1, targetScale]);

  return (
    <div
      className="sticky top-24 min-h-[85vh] md:top-32"
      style={{ paddingTop: index * 28 }}
    >
      <m.div
        style={{ scale: freezeScale ? 1 : scale, transformOrigin: 'top center' }}
      >
        <CardBody project={project} index={index} />
      </m.div>
    </div>
  );
}

/** Plain flow variant (< 640px): no sticky, no scaling, simple FadeIn. */
export function FlowCard({ project, index }: CardProps) {
  return (
    <FadeIn delay={0.05 * index} y={24}>
      <CardBody project={project} index={index} />
    </FadeIn>
  );
}

/**
 * Card content. Media grid: 40% / 60% columns at md+, single column
 * below md with the main media first and the two gallery images side
 * by side. The tall right panel is sized to match the two stacked left
 * images plus the 16px gap, so the columns stay aligned.
 */
function CardBody({ project, index }: CardProps) {
  const number = String(index + 1).padStart(2, '0');
  const headingId = `project-${project.id}-title`;
  const { main, gallery } = project.media;

  const mediaBoxClass =
    'w-full border border-line rounded-[20px] sm:rounded-[30px] md:rounded-[40px]';
  const mainMediaClass = cn(
    mediaBoxClass,
    'order-1 h-[clamp(220px,60vw,420px)] object-cover',
    'md:order-2 md:h-[calc(clamp(130px,16vw,230px)_+_clamp(160px,22vw,340px)_+_1rem)]',
  );

  return (
    <article
      id={`project-${project.id}`}
      aria-labelledby={headingId}
      className="border-2 border-ink bg-bg p-4 sm:rounded-[40px] sm:p-6 md:rounded-[50px] md:p-8 lg:rounded-[60px]"
    >
      <header className="flex flex-wrap items-start gap-x-6 gap-y-5">
        <p
          aria-hidden="true"
          className="hero-heading select-none text-[clamp(2.25rem,9vw,140px)] font-black leading-[0.9] sm:text-[clamp(3rem,10vw,140px)]"
        >
          {number}
        </p>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-accent">
            {project.category}
          </p>
          <h3 id={headingId} className="mt-2 text-xl font-bold sm:text-2xl md:text-3xl">
            {project.title}
          </h3>
          {project.status && (
            <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-accent">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
              {project.status}
            </p>
          )}
        </div>
        <nav
          aria-label={`Links for ${project.title}`}
          className="flex flex-wrap items-center gap-3"
        >
          {project.links.live && (
            <a
              href={project.links.live}
              target="_blank"
              rel="noopener noreferrer"
              className={linkButtonClass}
            >
              <ExternalLink size={15} aria-hidden="true" strokeWidth={1.75} />
              Live
            </a>
          )}
          <a
            href={project.links.repo}
            target="_blank"
            rel="noopener noreferrer"
            className={linkButtonClass}
          >
            <Code size={15} aria-hidden="true" strokeWidth={1.75} />
            Code
          </a>
        </nav>
      </header>

      <p className="mt-5 max-w-3xl text-sm leading-relaxed text-muted sm:text-base">
        {project.summary}
      </p>

      <ul className="mt-4 flex flex-wrap gap-2" aria-label="Technology stack">
        {project.stack.map((item) => (
          <li
            key={item}
            className="rounded-full border border-line px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider text-muted"
          >
            {item}
          </li>
        ))}
      </ul>

      {project.note && (
        <p className="mt-4 text-xs italic leading-relaxed text-muted sm:text-sm">
          {project.note}
        </p>
      )}

      <div className="mt-6 grid gap-3 sm:mt-8 sm:gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <div className="order-2 grid grid-cols-2 gap-3 sm:gap-4 md:order-1 md:grid-cols-1">
          <img
            src={media(gallery[0])}
            alt={`${project.title} — interface screenshot 1`}
            className={cn(mediaBoxClass, 'h-[clamp(130px,16vw,230px)] object-cover')}
            loading="lazy"
            decoding="async"
          />
          <img
            src={media(gallery[1])}
            alt={`${project.title} — interface screenshot 2`}
            className={cn(mediaBoxClass, 'h-[clamp(160px,22vw,340px)] object-cover')}
            loading="lazy"
            decoding="async"
          />
        </div>

        {main.type === 'video' ? (
          <Video
            src={media(main.src)}
            poster={media(main.poster)}
            alt={`${project.title} — demo video`}
            className={mainMediaClass}
          />
        ) : (
          <img
            src={media(main.image)}
            alt={`${project.title} — overview screenshot`}
            className={mainMediaClass}
            loading="lazy"
            decoding="async"
          />
        )}
      </div>
    </article>
  );
}
