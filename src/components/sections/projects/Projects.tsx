import { useRef } from 'react';
import { useScroll } from 'framer-motion';
import { projects } from '../../../data/projects';
import { useMediaQuery } from '../../../hooks/useMediaQuery';
import { useReducedMotion } from '../../../hooks/useReducedMotion';
import FadeIn from '../../ui/FadeIn';
import SectionHeading from '../../ui/SectionHeading';
import { FlowCard, StackingCard } from './ProjectCard';

/**
 * Projects section: a dark sheet with rounded top corners pulled up
 * under the hero (same negative margin trick, z-10 over the hero's
 * bottom fade), a big gradient "Projects" heading and three cards.
 *
 * >= 640px the cards play the sticky-stacking effect: every card sticks
 * (top-24 / md:top-32) inside one tall container so the following cards
 * scroll over it, each one scaled down as it gets covered
 * (targetScale = 1 - (total - 1 - index) * 0.03, offset index * 28px).
 * Under prefers-reduced-motion the sticky layout is kept but the scale
 * stays 1. Below 640px sticky stacking is disabled (it clips tall
 * content on small screens) and plain stacked cards fade in instead.
 */
export default function Projects() {
  const canStack = useMediaQuery('(min-width: 640px)');
  const reduced = useReducedMotion();

  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end'],
  });

  return (
    <section
      id="projects"
      aria-label="Selected projects"
      className="relative z-10 -mt-10 rounded-t-[40px] bg-bg px-5 pb-24 pt-20 sm:-mt-12 sm:rounded-t-[50px] sm:px-8 md:-mt-14 md:rounded-t-[60px] md:px-10 md:pt-24"
    >
      <FadeIn y={40}>
        <SectionHeading title="Projects" className="text-center" />
      </FadeIn>

      <div ref={container} className={canStack ? 'relative' : 'space-y-8 sm:space-y-10'}>
        {projects.map((project, index) =>
          canStack ? (
            <StackingCard
              key={project.id}
              project={project}
              index={index}
              total={projects.length}
              progress={scrollYProgress}
              freezeScale={reduced}
            />
          ) : (
            <FlowCard key={project.id} project={project} index={index} />
          ),
        )}
      </div>
    </section>
  );
}
