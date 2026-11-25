import type { CSSProperties } from 'react';
import type { HeroSlide } from '../../../data/hero';
import { media } from '../../../data/media';

interface SlideProps {
  slide: HeroSlide;
  isCurrent: boolean;
  slideRef: (el: HTMLDivElement | null) => void;
  photoRef: (el: HTMLDivElement | null) => void;
}

/**
 * One full-bleed slide: photo layer (bleeds 3%, cover, per-slide
 * background-position from the data file), dark top tint, and the
 * giant gradient-faded title whose words rise from masks on load.
 *
 * Mobile word cap: each line carries `--tcap` — the largest vw size
 * at which the line's longest word still fits 80vw — clamped under
 * 13vw so a 360px viewport can never overflow.
 */
export default function Slide({
  slide,
  isCurrent,
  slideRef,
  photoRef,
}: SlideProps) {
  const single = slide.title.length === 1;

  // Per-line word offsets for the 90ms rise stagger.
  let wordIndex = 0;

  return (
    <div
      ref={slideRef}
      className="slide"
      aria-hidden={!isCurrent}
      style={{ zIndex: isCurrent ? 4 : 1 }}
    >
      <div
        ref={photoRef}
        className="slide-photo"
        style={{
          backgroundImage: `url("${media(slide.mediaKey)}")`,
          backgroundPosition: slide.photoPosition,
        }}
      />
      <div className="slide-tint" />
      <div className={`slide-title ${single ? 'ts-1' : 'ts-2'}`}>
        {slide.title.map((line, li) => {
          const words = line.split(' ');
          const maxChars = Math.max(...words.map((w) => w.length));
          // Longest word fits 80vw at 0.72em average glyph width.
          const cap = (80 / (0.72 * maxChars)).toFixed(2);
          const delayBase = wordIndex;
          wordIndex += words.length;
          return (
            <div
              className="hero-line"
              key={li}
              style={{ '--tcap': `${cap}vw` } as CSSProperties}
            >
              {words.map((word, wi) => (
                <span className="hero-word" key={wi}>
                  <span
                    className="hero-word-inner"
                    style={{
                      animationDelay: `${0.25 + (delayBase + wi) * 0.09}s`,
                    }}
                  >
                    {word}
                  </span>
                </span>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
