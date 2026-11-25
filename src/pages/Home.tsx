import Hero from '../components/sections/hero/Hero';

/**
 * Home page: the cinematic hero, then placeholder sections whose
 * content lands in later chunks. ids and heights make hash
 * navigation verifiable right now.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <section id="projects" aria-label="Selected work" className="min-h-screen border-t border-line" />
      <section id="timeline" aria-label="Timeline" className="min-h-screen border-t border-line" />
      <section id="contact" aria-label="Contact" className="min-h-screen border-t border-line" />
    </>
  );
}
