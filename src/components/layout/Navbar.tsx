import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { nav } from '../../data/nav';
import { cn } from '../../lib/cn';
import PrimaryButton from '../ui/PrimaryButton';

/** Flat top-level entries rendered by the chunk-1 navbar (mega menus land later). */
const topLinks = [
  { label: nav.menus.work.label, href: nav.menus.work.href },
  { label: nav.menus.services.label, href: nav.menus.services.href },
  ...nav.links,
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur-sm">
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2 sm:px-6 lg:px-8"
      >
        <Link
          to={nav.brand.href}
          className="flex min-h-11 items-center text-sm font-bold uppercase tracking-widest text-ink"
        >
          {nav.brand.label}
        </Link>

        {/* Desktop */}
        <ul className="hidden items-center gap-1 md:flex">
          {topLinks.map((item) => (
            <li key={item.href}>
              <Link
                to={item.href}
                className="flex min-h-11 items-center rounded-full px-4 text-sm font-medium text-muted transition-colors hover:bg-white/5 hover:text-ink"
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li className="ml-2">
            <PrimaryButton to={nav.cta.href}>{nav.cta.label}</PrimaryButton>
          </li>
        </ul>

        {/* Mobile toggle */}
        <button
          type="button"
          className="flex min-h-11 min-w-11 items-center justify-center rounded-full text-ink hover:bg-white/5 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
        </button>
      </nav>

      {/* Mobile panel */}
      <div id="mobile-nav" className={cn('md:hidden', open ? 'block' : 'hidden')}>
        <ul className="border-t border-line px-2 pb-4 pt-2">
          {topLinks.map((item) => (
            <li key={item.href}>
              <Link
                to={item.href}
                className="flex min-h-11 items-center rounded-xl px-4 text-base font-medium text-ink hover:bg-white/5"
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li className="mt-3 px-2">
            <PrimaryButton to={nav.cta.href} className="w-full">
              {nav.cta.label}
            </PrimaryButton>
          </li>
        </ul>
      </div>
    </header>
  );
}
