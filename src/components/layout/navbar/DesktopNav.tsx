import { ChevronDown } from 'lucide-react';
import type { FocusEvent as ReactFocusEvent } from 'react';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { Link, useLocation } from 'react-router-dom';
import { nav } from '../../../data/nav';
import { cn } from '../../../lib/cn';
import PrimaryButton from '../../ui/PrimaryButton';
import Brand from './Brand';
import ServicesPanel from './ServicesPanel';
import WorkPanel from './WorkPanel';

type PanelId = keyof typeof nav.menus;
type Direction = 'ltr' | 'rtl';

/** Desktop dropdown panel boxes (px): work = Discover-style, services = Journeys-style. */
const PANELS: Record<PanelId, { width: number; height: number }> = {
  work: { width: 664, height: 358 },
  services: { width: 446, height: 308 },
};
const PANEL_ORDER: PanelId[] = ['work', 'services'];
/** Grace period between a pointer-leave and the actual close (ms). */
const CLOSE_GRACE_MS = 140;
/** How long the outgoing layer keeps animating (matches --content-out). */
const LEAVE_MS = 200;
/** Horizontal gutter kept between the panel and the viewport edges (px). */
const VIEWPORT_MARGIN = 16;
/** Vertical gap between the header bar and the panel (px). */
const PANEL_GAP = 10;

/**
 * Desktop navbar with a morphing dropdown.
 *
 * - first open snaps into place (no size animation);
 * - switching between "Work" and "Services" morphs the panel box
 *   (left/top/width/height over --morph) while the contents swap with a
 *   direction-aware blur slide;
 * - a 140ms close grace cancels when the pointer re-enters;
 * - Escape closes and restores focus to the trigger, a pointerdown
 *   outside the header closes, Tab out of the header closes, resize
 *   re-places the panel;
 * - hover opens for pointerType "mouse" only; click toggles for
 *   touch and keyboard;
 * - no transform is ever applied to the <nav> element: the dropdown
 *   uses the fixed <header> as its containing block.
 */
export default function DesktopNav() {
  const [openId, setOpenId] = useState<PanelId | null>(null);
  const [leavingId, setLeavingId] = useState<PanelId | null>(null);
  const [direction, setDirection] = useState<Direction>('ltr');
  const [activeWork, setActiveWork] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(() => window.innerWidth);
  const location = useLocation();

  const openIdRef = useRef<PanelId | null>(null);
  const snapRef = useRef(false);
  const triggerRefs = useRef<Partial<Record<PanelId, HTMLButtonElement | null>>>({});
  const navRef = useRef<HTMLElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const leaveTimerRef = useRef<number | null>(null);

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const clearLeaveTimer = useCallback(() => {
    if (leaveTimerRef.current !== null) {
      window.clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
  }, []);

  const closePanel = useCallback(
    (restoreFocus: boolean) => {
      clearCloseTimer();
      clearLeaveTimer();
      const previous = openIdRef.current;
      if (previous === null) return;
      const trigger = triggerRefs.current[previous];
      openIdRef.current = null;
      setOpenId(null);
      setLeavingId(null);
      if (restoreFocus) trigger?.focus();
    },
    [clearCloseTimer, clearLeaveTimer],
  );

  const openPanel = useCallback(
    (id: PanelId) => {
      clearCloseTimer();
      const previous = openIdRef.current;
      if (previous === id) return;
      if (previous !== null) {
        // switching between open panels: morph the box, slide the contents
        setDirection(
          PANEL_ORDER.indexOf(previous) < PANEL_ORDER.indexOf(id) ? 'ltr' : 'rtl',
        );
        setLeavingId(previous);
        clearLeaveTimer();
        leaveTimerRef.current = window.setTimeout(() => setLeavingId(null), LEAVE_MS);
      } else {
        // first open: snap into place with no size animation
        snapRef.current = true;
        setActiveWork(0);
      }
      openIdRef.current = id;
      setOpenId(id);
    },
    [clearCloseTimer, clearLeaveTimer],
  );

  /** Arm the 140ms close grace; cancelled by re-entering nav or panel. */
  const armClose = useCallback(() => {
    if (openIdRef.current === null) return;
    if (closeTimerRef.current === null) {
      closeTimerRef.current = window.setTimeout(() => {
        closeTimerRef.current = null;
        closePanel(false);
      }, CLOSE_GRACE_MS);
    }
  }, [closePanel]);

  /* Place the panel box: centred under the active trigger, clamped to
     the viewport. Runs before paint, so the first open never flashes. */
  useLayoutEffect(() => {
    if (openId === null) return;
    const dropdown = dropdownRef.current;
    const trigger = triggerRefs.current[openId];
    const header = dropdown?.closest('header');
    if (!dropdown || !trigger || !header) return;

    const { width, height } = PANELS[openId];
    const headerRect = header.getBoundingClientRect();
    const triggerRect = trigger.getBoundingClientRect();
    const desiredLeft =
      triggerRect.left + triggerRect.width / 2 - width / 2 - headerRect.left;
    const maxLeft = Math.max(headerRect.width - width - VIEWPORT_MARGIN, VIEWPORT_MARGIN);
    const left = Math.min(Math.max(desiredLeft, VIEWPORT_MARGIN), maxLeft);
    const top = triggerRect.bottom - headerRect.top + PANEL_GAP;

    const apply = () => {
      dropdown.style.left = `${left}px`;
      dropdown.style.top = `${top}px`;
      dropdown.style.width = `${width}px`;
      dropdown.style.height = `${height}px`;
    };

    if (snapRef.current) {
      dropdown.setAttribute('data-snap', 'true');
      apply();
      void dropdown.offsetHeight; // flush: the snap lands while the transition is off
      dropdown.removeAttribute('data-snap');
      snapRef.current = false;
    } else {
      apply();
    }
  }, [openId, viewportWidth]);

  /* Escape closes and restores focus to the opening trigger; a
     pointerdown outside the header closes. */
  useEffect(() => {
    if (openId === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closePanel(true);
    };
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      const header = navRef.current?.closest('header');
      if (!target || !header || !header.contains(target)) closePanel(false);
    };
    window.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown, true);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown, true);
    };
  }, [openId, closePanel]);

  /* Keyboard focus leaving the whole header (nav + panel) closes. */
  const handleFocusOut = useCallback(
    (event: ReactFocusEvent<HTMLElement>) => {
      const next = event.relatedTarget as Node | null;
      if (openIdRef.current === null || next === null) return;
      if (navRef.current?.contains(next)) return;
      if (dropdownRef.current?.contains(next)) return;
      closePanel(false);
    },
    [closePanel],
  );

  /* Any navigation (usually a link inside the panel) closes it. */
  useEffect(() => {
    closePanel(false);
  }, [location.pathname, location.hash, closePanel]);

  /* Resize re-places the panel without animation. */
  useEffect(() => {
    const onResize = () => {
      if (openIdRef.current === null) return;
      snapRef.current = true;
      setViewportWidth(window.innerWidth);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  /* Clear pending timers when the desktop nav unmounts (mode switch). */
  useEffect(
    () => () => {
      clearCloseTimer();
      clearLeaveTimer();
    },
    [clearCloseTimer, clearLeaveTimer],
  );

  return (
    <>
      <nav
        ref={navRef}
        aria-label="Main"
        className="mx-auto flex h-[var(--header-h)] w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8"
        onPointerEnter={(event) => {
          if (event.pointerType === 'mouse') clearCloseTimer();
        }}
        onPointerLeave={armClose}
        onBlur={handleFocusOut}
      >
        <Brand />

        <ul className="flex items-center gap-1">
          {PANEL_ORDER.map((id) => {
            const menu = nav.menus[id];
            const isOpen = openId === id;
            const isActiveRoute = location.pathname === menu.href.split('#')[0];
            return (
              <li key={id}>
                <button
                  type="button"
                  ref={(element) => {
                    triggerRefs.current[id] = element;
                  }}
                  aria-expanded={isOpen}
                  aria-controls="nav-dropdown"
                  onClick={() =>
                    openIdRef.current === id ? closePanel(false) : openPanel(id)
                  }
                  onPointerEnter={(event) => {
                    if (event.pointerType === 'mouse') openPanel(id);
                  }}
                  className={cn(
                    'flex min-h-11 items-center gap-1.5 rounded-full px-4 text-sm font-medium transition-colors duration-200',
                    isActiveRoute || isOpen
                      ? 'text-ink'
                      : 'text-muted hover:bg-white/5 hover:text-ink',
                  )}
                >
                  {menu.label}
                  <ChevronDown
                    size={14}
                    aria-hidden="true"
                    className={cn(
                      'transition-transform duration-200',
                      isOpen && 'rotate-180',
                    )}
                  />
                </button>
              </li>
            );
          })}

          {nav.links.map((item) => (
            <li key={item.href}>
              <Link
                to={item.href}
                className="flex min-h-11 items-center rounded-full px-4 text-sm font-medium text-muted transition-colors duration-200 hover:bg-white/5 hover:text-ink"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <PrimaryButton to={nav.cta.href}>{nav.cta.label}</PrimaryButton>
      </nav>

      {openId !== null && (
        <div
          id="nav-dropdown"
          ref={dropdownRef}
          role="region"
          aria-label={`${nav.menus[openId].label} menu`}
          className="dd"
          data-direction={direction}
          onPointerEnter={clearCloseTimer}
          onPointerLeave={armClose}
          onBlur={handleFocusOut}
        >
          <div
            className="dd-layer"
            data-active={openId === 'work'}
            data-leaving={leavingId === 'work'}
          >
            <WorkPanel activeIndex={activeWork} onActivate={setActiveWork} />
          </div>
          <div
            className="dd-layer"
            data-active={openId === 'services'}
            data-leaving={leavingId === 'services'}
          >
            <ServicesPanel />
          </div>
        </div>
      )}
    </>
  );
}
