import { AnimatePresence, m } from 'framer-motion';
import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ScrollToTop from './components/layout/ScrollToTop';
import Home from './pages/Home';

/* Route-level code splitting: the landing page stays eager (best LCP);
 * the other routes load on demand. */
const Services = lazy(() => import('./pages/Services'));
const NotFound = lazy(() => import('./pages/NotFound'));

/** Shown while a lazily-loaded route chunk arrives. */
function RouteFallback() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="grid min-h-[60vh] place-items-center px-6"
    >
      <p className="text-sm text-muted">Loading…</p>
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <m.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <Suspense fallback={<RouteFallback />}>
          <Routes location={location}>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </m.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AnimatedRoutes />
    </BrowserRouter>
  );
}
