import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { cn } from '../../lib/cn';

interface VideoProps {
  /** Video file URL (usually from media.ts). May 404 — the poster is shown instead. */
  src: string;
  /** Poster image URL from media.ts. */
  poster: string;
  /** Description announced to assistive tech (the media element is role="img"). */
  alt: string;
  /**
   * Box classes for the outer wrapper: sizing (aspect ratio / height),
   * radius, border. The video or poster fills the box with object-cover.
   */
  className?: string;
  /** Intersection threshold before play is attempted. */
  playThreshold?: number;
}

/**
 * Silent autoplaying looped video that plays only while its box is on
 * screen (IntersectionObserver) and pauses when it scrolls out. Sizing
 * comes entirely from the consumer via `className` so layout never
 * shifts. Under prefers-reduced-motion — or whenever the video file
 * fails to load (404, bad network) — the poster image is shown instead,
 * silently. No audio anywhere: the element is always muted.
 */
export default function Video({
  src,
  poster,
  alt,
  className,
  playThreshold = 0.25,
}: VideoProps) {
  const reduced = useReducedMotion();
  const boxRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);

  // Play while in view, pause off-screen.
  useEffect(() => {
    if (reduced || failed) return;
    const box = boxRef.current;
    const video = videoRef.current;
    if (!box || !video) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            video.play().catch(() => {
              /* autoplay refused — poster stays visible; nothing to fix */
            });
          } else if (!video.paused) {
            video.pause();
          }
        }
      },
      { threshold: playThreshold },
    );
    io.observe(box);
    return () => io.disconnect();
  }, [reduced, failed, src, playThreshold]);

  // Reduced motion: never animate — show the poster only.
  if (reduced) {
    return (
      <div ref={boxRef} className={cn('relative overflow-hidden', className)}>
        <img
          src={poster}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div ref={boxRef} className={cn('relative overflow-hidden', className)}>
      {failed ? (
        <img
          src={poster}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          muted
          loop
          playsInline
          preload="metadata"
          role="img"
          aria-label={alt}
          className="absolute inset-0 h-full w-full object-cover"
          onError={() => {
            setFailed(true);
          }}
        />
      )}
    </div>
  );
}
