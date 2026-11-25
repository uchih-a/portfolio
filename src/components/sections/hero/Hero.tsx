import { useEffect, useState } from 'react';
import { hero } from '../../../data/hero';
import { media } from '../../../data/media';
import { site } from '../../../data/site';
import { useReducedMotion } from '../../../hooks/useReducedMotion';
import GhostButton from '../../ui/GhostButton';
import PrimaryButton from '../../ui/PrimaryButton';
import './hero.css';
import QuickFacts from './QuickFacts';
import Rail from './Rail';
import Slide from './Slide';
import { useHeroShow } from './useHeroShow';

/**
 * Cinematic hero for the home page:
 *  - three stacked slides (photos from media.ts, titles from hero.ts)
 *    auto-advancing every 5.2s through a misty right-to-left masked
 *    wipe (1.25s easeInOutCubic, rAF-driven); a plain .4s crossfade
 *    replaces the wipe under prefers-reduced-motion;
 *  - screen-blended cloud texture: a drifting bottom bank plus a top
 *    layer that fades in on scroll;
 *  - a right rail of round thumbnails on concentric rings with a
 *    connector line and caption block;
 *  - a quick-facts strip and two CTAs below the title;
 *  - scroll choreography written as CSS custom properties by one
 *    rAF-throttled passive scroll listener.
 */
export default function Hero() {
  const reduced = useReducedMotion();
  const { current, captionHidden, go, rootRef, slideRefs, photoRefs, mistRef } =
    useHeroShow();

  // Viewport metrics for the rail layout (rAF-throttled resize).
  const [vp, setVp] = useState(() => ({
    w: window.innerWidth,
    h: window.innerHeight,
  }));

  useEffect(() => {
    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() =>
        setVp({ w: window.innerWidth, h: window.innerHeight }),
      );
    };
    window.addEventListener('resize', onResize, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const scrollTo = (id: string) => {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  };

  const clouds = `url("${media('clouds')}")`;

  return (
    <section
      id="hero"
      className="hero"
      aria-label="Introduction"
      ref={rootRef}
    >
      <h1 className="sr-only">{`${site.name} — ${site.tagline}`}</h1>

      <div className="hero-slides">
        {hero.map((slide, i) => (
          <Slide
            key={slide.mediaKey}
            slide={slide}
            isCurrent={i === current}
            slideRef={(el) => {
              slideRefs.current[i] = el;
            }}
            photoRef={(el) => {
              photoRefs.current[i] = el;
            }}
          />
        ))}
      </div>

      <div className="hero-clouds-top">
        <div
          className="hero-clouds-top-inner"
          style={{ backgroundImage: clouds }}
        />
      </div>

      <div className="hero-fade" />

      <div className="hero-clouds">
        <div
          className="hero-clouds-copy hero-clouds-back"
          style={{ backgroundImage: clouds }}
        />
        <div
          className="hero-clouds-copy hero-clouds-front"
          style={{ backgroundImage: clouds }}
        />
      </div>

      <div className="hero-mist" ref={mistRef} />

      <Rail
        current={current}
        captionHidden={captionHidden}
        vw={vp.w}
        vh={vp.h}
        onGo={go}
      />

      <QuickFacts />

      <div className="hero-ctas">
        <PrimaryButton onClick={() => scrollTo('projects')}>
          View projects
        </PrimaryButton>
        <GhostButton to="/services">Services</GhostButton>
      </div>
    </section>
  );
}
