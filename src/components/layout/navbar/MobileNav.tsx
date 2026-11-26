import { Menu, X } from 'lucide-react';
import type { KeyboardEvent as ReactKeyboardEvent, MouseEvent as ReactMouseEvent } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { nav } from '../../../data/nav';
import { cn } from '../../../lib/cn';
import PrimaryButton from '../../ui/PrimaryButton';
import Brand from './Brand';

const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled])';

/**
 * Mobile navbar (<= 860px): hamburger button plus a sheet grouped into
 * WORK / SERVICES / PAGES. While the sheet is open it traps focus,
 * locks body scroll, and closes on link click, Escape or an outside
 * pointerdown. The sheet is capped at calc(100svh - 90px) and scrolls
 * internally. Group labels are paragraphs (not headings) so the sheet,
 * which lives in the header before main, never breaks the page's
 * h1 -> h2 outline.
 */
export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const toggleRef = useRef<HTMLButtonElement | null>(null);
  const location = useLocation();

  const closeSheet = useCallback((restoreFocus: boolean) => {
    setOpen(false);
    if (restoreFocus) toggleRef.current?.focus();
  }, []);

  /* Any navigation closes the sheet. */
  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.hash]);

  /* Lock body scroll while open and move focus into the sheet. */
  useEffect(() => {
    if (!open) return;
    const body = document.body;
    const previousOverflow = body.style.overflow;
    const previousPaddingRight = body.style.paddingRight;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = 'hidden';
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;
    sheetRef.current?.focus();
    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPaddingRight;
    };
  }, [open]);

  /* Escape closes and restores focus to the hamburger; a pointerdown
     outside the header closes. */
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeSheet(true);
    };
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      const header = navRef.current?.closest('header');
      if (!target || !header || !header.contains(target)) closeSheet(false);
    };
    window.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown, true);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown, true);
    };
  }, [open, closeSheet]);

  /* Focus trap: Tab wraps inside the sheet. */
  const handleSheetKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Tab') return;
    const sheet = sheetRef.current;
    if (!sheet) return;
    const focusables = Array.from(
      sheet.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
    ).filter((element) => element.offsetParent !== null);
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement;
    if (event.shiftKey) {
      if (active === first || !sheet.contains(active)) {
        event.preventDefault();
        last.focus();
      }
    } else if (active === last || !sheet.contains(active)) {
      event.preventDefault();
      first.focus();
    }
  };

  /* Any link click navigates and closes the sheet. */
  const handleSheetClick = (event: ReactMouseEvent<HTMLDivElement>) => {
    const anchor = (event.target as HTMLElement).closest('a');
    if (anchor) closeSheet(true);
  };

  return (
    <>
      <nav
        ref={navRef}
        aria-label="Main"
        className="mx-auto flex h-[var(--header-h)] w-full items-center justify-between gap-2 px-4"
      >
        <Brand />
        <div className="flex items-center gap-2">
          <PrimaryButton to={nav.cta.href}>{nav.cta.label}</PrimaryButton>
          <button
            type="button"
            ref={toggleRef}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => (open ? closeSheet(true) : setOpen(true))}
            className="relative flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors duration-200 hover:bg-white/5"
          >
            <Menu
              size={22}
              aria-hidden="true"
              className={cn(
                'absolute transition-all duration-200',
                open ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100',
              )}
            />
            <X
              size={22}
              aria-hidden="true"
              className={cn(
                'absolute transition-all duration-200',
                open ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0',
              )}
            />
          </button>
        </div>
      </nav>

      <div
        id="mobile-nav"
        ref={sheetRef}
        role="region"
        aria-label="Site menu"
        tabIndex={-1}
        className="mobile-sheet"
        data-open={open}
        onKeyDown={handleSheetKeyDown}
        onClick={handleSheetClick}
      >
        <div className="flex flex-col gap-6 px-5 py-6">
          <section aria-labelledby="mobile-work-heading">
            {/* Group labels are paragraphs, not headings: the sheet lives in
                the <header> before <main>, so heading elements here would
                break the page's h1 -> h2 outline. */}
            <p id="mobile-work-heading">
              <Link
                to={nav.menus.work.href}
                className="flex min-h-11 items-center px-1 text-xs font-semibold uppercase tracking-widest text-muted transition-colors duration-200 hover:text-ink"
              >
                Work
              </Link>
            </p>
            <ul className="mt-1 flex flex-col">
              {nav.menus.work.workItems.map((item) => (
                <li key={item.id}>
                  <Link
                    to={item.href}
                    className="flex min-h-11 flex-col justify-center rounded-xl px-3 py-2.5 transition-colors duration-200 hover:bg-white/5"
                  >
                    <span className="text-[15px] font-semibold text-ink">{item.label}</span>
                    <span className="mt-0.5 text-[13px] leading-snug text-muted">
                      {item.description}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="mobile-services-heading">
            <p id="mobile-services-heading">
              <Link
                to={nav.menus.services.href}
                className="flex min-h-11 items-center px-1 text-xs font-semibold uppercase tracking-widest text-muted transition-colors duration-200 hover:text-ink"
              >
                Services
              </Link>
            </p>
            <ul className="mt-1 flex flex-col">
              {nav.menus.services.serviceCards.map((card) => (
                <li key={card.id}>
                  <Link
                    to={card.href}
                    className="flex min-h-11 flex-col justify-center rounded-xl px-3 py-2.5 transition-colors duration-200 hover:bg-white/5"
                  >
                    <span className="text-[15px] font-semibold text-ink">{card.label}</span>
                    <span className="mt-0.5 text-[13px] leading-snug text-muted">
                      {card.description}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="mobile-pages-heading">
            <p id="mobile-pages-heading">
              <span className="flex min-h-11 items-center px-1 text-xs font-semibold uppercase tracking-widest text-muted">
                Pages
              </span>
            </p>
            <ul className="mt-1 flex flex-col">
              {nav.links.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="flex min-h-11 items-center rounded-xl px-3 text-[15px] font-medium text-ink transition-colors duration-200 hover:bg-white/5"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <div className="px-1">
            <PrimaryButton to={nav.cta.href} className="w-full">
              {nav.cta.label}
            </PrimaryButton>
          </div>
        </div>
      </div>
    </>
  );
}
