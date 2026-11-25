import { useEffect, useState } from 'react';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { cn } from '../../lib/cn';
import DesktopNav from './navbar/DesktopNav';
import MobileNav from './navbar/MobileNav';

/** Scroll threshold after which the header frosts over (fraction of viewport height). */
const SCROLL_THRESHOLD = 0.3;

/**
 * Fixed site header. Transparent at the top of the page; once the page
 * has been scrolled past 30% of the viewport it gains the frosted
 * background (rgba(12,12,12,.8) + 14px blur + 1px line border,
 * .5s transition). Swaps between the desktop morphing-dropdown nav
 * and the mobile sheet nav at the 860px breakpoint.
 */
export default function Navbar() {
  const isMobile = useMediaQuery('(max-width: 860px)');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > window.innerHeight * SCROLL_THRESHOLD);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={cn('site-header', scrolled && 'is-scrolled')}>
      {isMobile ? <MobileNav /> : <DesktopNav />}
    </header>
  );
}
