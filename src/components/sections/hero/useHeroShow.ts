import { useEffect, useMemo, useRef, useState } from 'react';
import { hero } from '../../../data/hero';
import { useReducedMotion } from '../../../hooks/useReducedMotion';

/** Wipe duration and misty-edge travel. */
const WIPE_MS = 1250;
/** Reduced-motion crossfade (the only crossfade in the whole hero). */
const FADE_MS = 400;
/** Auto-advance interval. */
const AUTO_MS = 5200;
/** Rail connector/caption grow back this long after a switch starts. */
const CAPTION_DELAY_MS = 650;
/** Ken Burns: +0.0035 scale per second, capped after 12s. */
const KB_RATE = 0.0035;
const KB_MAX_S = 12;
/** Pointer parallax range (percent of the photo element). */
const PARALLAX_X = 0.6;
const PARALLAX_Y = 0.5;

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));

interface Engine {
  /** Index of the slide currently shown (updates only when a switch ends). */
  visual: number;
  /** A wipe or crossfade is in flight. */
  busy: boolean;
  /** Latest prefers-reduced-motion reading (synced by an effect). */
  reduced: boolean;
  raf: number;
  wipeRaf: number;
  fadeRaf: number;
  captionTimer: number;
  /** Timestamp the current slide became live (Ken Burns origin). */
  liveStart: number;
  /** Parallax current/target offsets in percent of the photo element. */
  px: number;
  py: number;
  tx: number;
  ty: number;
  go: (id: number) => void;
  wake: () => void;
}

export interface HeroShowApi {
  /** Index of the slide the UI should render (rail, caption, aria). */
  current: number;
  /** Whether a switch is in flight. */
  busy: boolean;
  /** Caption + connector hidden (mid-switch choreography). */
  captionHidden: boolean;
  /** Switch to slide `id` (wipe, or reduced-motion crossfade). */
  go: (id: number) => void;
  rootRef: React.MutableRefObject<HTMLElement | null>;
  slideRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  photoRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  mistRef: React.MutableRefObject<HTMLDivElement | null>;
}

/**
 * The hero's show engine: masked right-to-left wipe between slides
 * (rAF-driven, easeInOutCubic), 5.2s auto-advance that pauses on
 * hover/focus within the hero and on hidden tabs, Ken Burns + pointer
 * parallax for the live photo, and the scroll choreography custom
 * properties. Every rAF frame writes transform/opacity/mask only.
 * All rAF ids and timers are cancelled on unmount.
 */
export function useHeroShow(): HeroShowApi {
  const reduced = useReducedMotion();

  const [current, setCurrent] = useState(0);
  const [busy, setBusy] = useState(false);
  const [captionHidden, setCaptionHidden] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);

  const rootRef = useRef<HTMLElement | null>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const photoRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mistRef = useRef<HTMLDivElement | null>(null);

  const eng = useMemo<Engine>(() => {
    const E: Engine = {
      visual: 0,
      busy: false,
      reduced: false,
      raf: 0,
      wipeRaf: 0,
      fadeRaf: 0,
      captionTimer: 0,
      liveStart: performance.now(),
      px: 0,
      py: 0,
      tx: 0,
      ty: 0,
      go: () => undefined,
      wake: () => undefined,
    };

    /** Ken Burns + parallax ticker for the live photo. Stops itself
     *  once Ken Burns saturates and the parallax has settled. */
    const loop = (now: number) => {
      E.raf = 0;
      if (E.reduced || E.busy) return;
      const photo = photoRefs.current[E.visual];
      if (!photo) return;
      E.px += (E.tx - E.px) * 0.08;
      E.py += (E.ty - E.py) * 0.08;
      const kb = KB_RATE * Math.min(KB_MAX_S, (now - E.liveStart) / 1000);
      photo.style.transform = `translate3d(${E.px.toFixed(3)}%, ${E.py.toFixed(3)}%, 0) scale(${(1.04 + kb).toFixed(5)})`;
      const kbDone = now - E.liveStart >= (KB_MAX_S + 1) * 1000;
      const settled =
        Math.abs(E.tx - E.px) < 0.01 && Math.abs(E.ty - E.py) < 0.01;
      if (!kbDone || !settled) E.raf = requestAnimationFrame(loop);
    };

    E.wake = () => {
      if (E.reduced || E.raf) return;
      E.raf = requestAnimationFrame(loop);
    };

    /** Switch settled: promote the live photo, restart Ken Burns. */
    const finish = (id: number) => {
      E.visual = id;
      E.busy = false;
      setBusy(false);
      E.liveStart = performance.now();
      photoRefs.current.forEach((p) => p && p.classList.remove('is-live'));
      photoRefs.current[id]?.classList.add('is-live');
      E.wake();
    };

    /** Reduced-motion switch: a plain 400ms opacity crossfade,
     *  driven in JS so the global reduced-motion CSS rules
     *  (which shorten CSS transitions) cannot clip it. */
    const crossfade = (id: number) => {
      const inc = slideRefs.current[id];
      if (!inc) {
        finish(id);
        return;
      }
      inc.style.opacity = '0';
      inc.style.zIndex = '4';
      const t0 = performance.now();
      const step = (now: number) => {
        const p = Math.min(1, (now - t0) / FADE_MS);
        inc.style.opacity = p.toFixed(3);
        if (p < 1) {
          E.fadeRaf = requestAnimationFrame(step);
          return;
        }
        inc.style.opacity = '';
        finish(id);
      };
      E.fadeRaf = requestAnimationFrame(step);
    };

    /** The signature move: the incoming slide is revealed by a moving
     *  linear-gradient mask (to the left, ~35% soft edge) while its
     *  photo settles 1.12 -> 1.04 and the outgoing pushes to 1.09.
     *  A blurred mist band rides the wipe edge. */
    const startWipe = (id: number) => {
      const inc = slideRefs.current[id];
      const incPhoto = photoRefs.current[id];
      const outPhoto = photoRefs.current[E.visual];
      if (!inc || !incPhoto || !outPhoto) {
        finish(id);
        return;
      }

      setCaptionHidden(true);
      window.clearTimeout(E.captionTimer);
      E.captionTimer = window.setTimeout(
        () => setCaptionHidden(false),
        CAPTION_DELAY_MS,
      );

      const mist = mistRef.current;
      if (mist) mist.style.visibility = 'visible';

      // Bridge React's re-render: the incoming slide must sit on top
      // of the outgoing one for the first frame of the wipe.
      inc.style.zIndex = '4';

      const t0 = performance.now();
      const step = (now: number) => {
        const p = Math.min(1, (now - t0) / WIPE_MS);
        const t = easeInOutCubic(p);
        // Mask stops measured from the right edge: opaque to (t*135-35)%,
        // 60% at the ramp midpoint, transparent at t*135%.
        const a = clamp(t * 135 - 35, 0, 100);
        const b = clamp(t * 135, 0, 100);
        const mid = (a + b) / 2;
        const mask =
          `linear-gradient(to left, #000 0%, #000 ${a.toFixed(2)}%, ` +
          `rgba(0,0,0,0.6) ${mid.toFixed(2)}%, transparent ${b.toFixed(2)}%)`;
        inc.style.setProperty('mask-image', mask);
        inc.style.setProperty('-webkit-mask-image', mask);
        incPhoto.style.transform =
          `translateX(${((1 - t) * 2).toFixed(3)}%) scale(${(1.12 - 0.08 * t).toFixed(4)})`;
        outPhoto.style.transform =
          `translateX(${(-2 * t).toFixed(3)}%) scale(${(1.04 + 0.05 * t).toFixed(4)})`;

        if (mist) {
          const edge = 100 - 135 * t; // wipe edge, % from the left
          mist.style.left = `calc(${edge.toFixed(2)}% - 17vw)`;
          mist.style.opacity = (0.95 * Math.sin(Math.PI * p)).toFixed(3);
        }

        if (p < 1) {
          E.wipeRaf = requestAnimationFrame(step);
          return;
        }
        inc.style.removeProperty('mask-image');
        inc.style.removeProperty('-webkit-mask-image');
        outPhoto.style.transform = '';
        if (mist) {
          mist.style.opacity = '0';
          mist.style.visibility = 'hidden';
        }
        finish(id);
      };
      E.wipeRaf = requestAnimationFrame(step);
    };

    E.go = (id: number) => {
      if (id < 0 || id >= hero.length) return;
      if (E.busy || id === E.visual) return;
      E.busy = true;
      setBusy(true);
      // UI (rail layout, caption, aria) switches immediately; the
      // outgoing slide keeps painting underneath until the wipe ends.
      setCurrent(id);
      if (E.reduced) {
        crossfade(id);
      } else {
        startWipe(id);
      }
    };

    return E;
  }, []);

  /* Sync the reduced-motion flag into the engine. */
  useEffect(() => {
    eng.reduced = reduced;
    if (reduced) {
      eng.px = 0;
      eng.py = 0;
      eng.tx = 0;
      eng.ty = 0;
      cancelAnimationFrame(eng.raf);
      eng.raf = 0;
    }
  }, [eng, reduced]);

  /* Pointer parallax (rAF-throttled by the ticker's lerp). */
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const onMove = (ev: PointerEvent) => {
      eng.tx = (ev.clientX / window.innerWidth - 0.5) * 2 * PARALLAX_X;
      eng.ty = (ev.clientY / window.innerHeight - 0.5) * 2 * PARALLAX_Y;
      eng.wake();
    };
    const onLeave = () => {
      eng.tx = 0;
      eng.ty = 0;
      eng.wake();
    };
    el.addEventListener('pointermove', onMove, { passive: true });
    el.addEventListener('pointerleave', onLeave, { passive: true });
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, [eng]);

  /* Hover within the hero pauses auto-advance. */
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const onEnter = () => setHovered(true);
    const onLeave = () => setHovered(false);
    el.addEventListener('pointerenter', onEnter, { passive: true });
    el.addEventListener('pointerleave', onLeave, { passive: true });
    return () => {
      el.removeEventListener('pointerenter', onEnter);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  /* Focus within the hero pauses auto-advance. */
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const onFocusIn = () => setFocusWithin(true);
    const onFocusOut = (e: FocusEvent) => {
      if (!el.contains(e.relatedTarget as Node | null)) setFocusWithin(false);
    };
    el.addEventListener('focusin', onFocusIn);
    el.addEventListener('focusout', onFocusOut);
    return () => {
      el.removeEventListener('focusin', onFocusIn);
      el.removeEventListener('focusout', onFocusOut);
    };
  }, []);

  /* Hidden tabs pause auto-advance (rAF already stalls there). */
  useEffect(() => {
    const onVisibility = () =>
      setTabHidden(document.visibilityState === 'hidden');
    document.addEventListener('visibilitychange', onVisibility);
    return () =>
      document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  /* Scroll choreography: ONE rAF-throttled passive listener writing
   * custom properties; transforms/opacity do the rest. */
  useEffect(() => {
    if (reduced) return undefined;
    let ticking = false;
    const apply = () => {
      ticking = false;
      const root = rootRef.current;
      if (!root) return;
      const y = window.scrollY;
      const vh = window.innerHeight;
      const rpx = (v: number) => `${v.toFixed(1)}px`;
      root.style.setProperty('--par-stack-y', rpx(y * 0.42));
      root.style.setProperty('--par-cloud-y', rpx(-y * 0.38));
      root.style.setProperty(
        '--par-cloud-s',
        (1 + 0.35 * (y / vh)).toFixed(4),
      );
      root.style.setProperty(
        '--par-top-op',
        clamp(y / (0.45 * vh), 0, 1).toFixed(3),
      );
      root.style.setProperty('--par-top-y', rpx(-y * 0.2));
      root.style.setProperty('--par-rail-y', rpx(y * 0.2));
      root.style.setProperty(
        '--par-rail-op',
        clamp(1 - y / (0.5 * vh), 0, 1).toFixed(3),
      );
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(apply);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [reduced]);

  /* Auto-advance: 1 -> 2 -> 3 -> 1 every 5.2s. Paused while hovered,
   * focused-within, on hidden tabs or mid-switch; disabled entirely
   * under prefers-reduced-motion. */
  useEffect(() => {
    if (reduced || hovered || focusWithin || tabHidden || busy) return undefined;
    const t = window.setTimeout(() => eng.go((current + 1) % hero.length), AUTO_MS);
    return () => window.clearTimeout(t);
  }, [current, reduced, hovered, focusWithin, tabHidden, busy, eng]);

  /* Unmount: kill every rAF/timer the engine owns. */
  useEffect(
    () => () => {
      cancelAnimationFrame(eng.raf);
      cancelAnimationFrame(eng.wipeRaf);
      cancelAnimationFrame(eng.fadeRaf);
      window.clearTimeout(eng.captionTimer);
    },
    [eng],
  );

  return {
    current,
    busy,
    captionHidden,
    go: eng.go,
    rootRef,
    slideRefs,
    photoRefs,
    mistRef,
  };
}
