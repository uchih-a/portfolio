import type { CSSProperties } from 'react';
import { hero } from '../../../data/hero';
import { media } from '../../../data/media';

interface RailProps {
  current: number;
  captionHidden: boolean;
  vw: number;
  vh: number;
  onGo: (id: number) => void;
}

/**
 * Right rail: a vertical column of three round thumbnails centred at
 * x = 85.5% of the viewport, starting at 74px + 8.5% of the hero
 * height. Sizes are viewport-relative clamps:
 *   active   11.3vw clamped to 96..190px
 *   inactive  5.4vw clamped to 46..92px
 *   gap       0.9vw, minimum 8px
 * Two thin rings are centred on the active thumbnail (radius = half
 * the active size + 5vw / + 10.8vw). A 3px connector bar sits 0.8vw
 * left of the active thumbnail, with the caption block (3px bar +
 * heading + description) anchored right of it, 16px away.
 * Switching animates top/left/width/height over .9s with --ease.
 */
export default function Rail({
  current,
  captionHidden,
  vw,
  vh,
  onGo,
}: RailProps) {
  const clampPx = (vwValue: number, lo: number, hi: number) =>
    Math.min(Math.max(vw * vwValue, lo), hi);

  const activeSize = clampPx(0.113, 96, 190);
  const idleSize = clampPx(0.054, 46, 92);
  const gap = Math.max(vw * 0.009, 8);
  const centerX = vw * 0.855;
  const top0 = 74 + 0.085 * vh;

  // Column order, top to bottom: slide 3, slide 2, slide 1.
  const order = [2, 1, 0];
  const slots: { slide: number; top: number; size: number }[] = [];
  let y = top0;
  for (const slide of order) {
    const size = slide === current ? activeSize : idleSize;
    slots.push({ slide, top: y, size });
    y += size + gap;
  }

  const active = slots.find((s) => s.slide === current) ?? slots[0];
  const activeCenterY = active.top + activeSize / 2;

  const ringRadii = [activeSize / 2 + vw * 0.05, activeSize / 2 + vw * 0.108];
  const connectorLength = Math.max(vw * 0.047, 40);
  const connectorLeft = centerX - activeSize / 2 - vw * 0.008 - connectorLength;
  // Caption right edge sits 16px left of the connector's left edge.
  const captionRight = vw - connectorLeft + 16;

  const slide = hero[current];

  return (
    <div className="hero-rail" aria-hidden={false}>
      {ringRadii.map((r, i) => {
        const d = r * 2;
        return (
          <div
            className="rail-ring"
            key={i}
            style={
              {
                top: activeCenterY - r,
                left: centerX - r,
                width: d,
                height: d,
              } as CSSProperties
            }
          />
        );
      })}

      {slots.map(({ slide: id, top, size }, i) => (
        <button
          key={id}
          type="button"
          className="rail-thumb"
          data-active={id === current ? 'true' : 'false'}
          aria-current={id === current ? 'true' : undefined}
          aria-label={`Show slide ${id + 1}: ${hero[id].captionHeading}`}
          onClick={() => onGo(id)}
          style={
            {
              top,
              left: centerX - size / 2,
              width: size,
              height: size,
              animationDelay: `${0.35 + i * 0.14}s`,
            } as CSSProperties
          }
        >
          <img src={media(hero[id].thumbKey)} alt="" />
        </button>
      ))}

      <div
        className="rail-connector"
        data-hidden={captionHidden ? 'true' : 'false'}
        style={
          {
            top: activeCenterY - 1.5,
            left: connectorLeft,
            width: connectorLength,
          } as CSSProperties
        }
      />

      <div
        className="rail-caption"
        data-hidden={captionHidden ? 'true' : 'false'}
        style={{ top: activeCenterY, right: captionRight } as CSSProperties}
      >
        <div className="rail-cap-bar" />
        <div className="rail-cap-text">
          <h3 className="rail-cap-heading">{slide.captionHeading}</h3>
          <p className="rail-cap-desc">{slide.caption}</p>
        </div>
      </div>
    </div>
  );
}
