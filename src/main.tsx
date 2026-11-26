import '@fontsource-variable/urbanist/index.css';
import { LazyMotion, domAnimation } from 'framer-motion';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './globals.css';

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    {/* domAnimation covers every animation used here (fades, in-view
        reveals, scroll transforms) at a smaller bundle than domMax;
        `strict` forbids accidental `motion.` imports. */}
    <LazyMotion features={domAnimation} strict>
      <App />
    </LazyMotion>
  </StrictMode>,
);
