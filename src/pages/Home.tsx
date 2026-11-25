/**
 * Placeholder sections — content lands in later chunks.
 * ids and heights make hash navigation verifiable right now.
 */
export default function Home() {
  return (
    <>
      <section id="hero" aria-label="Introduction" className="min-h-screen" />
      <section id="projects" aria-label="Selected work" className="min-h-screen border-t border-line" />
      <section id="timeline" aria-label="Timeline" className="min-h-screen border-t border-line" />
      <section id="contact" aria-label="Contact" className="min-h-screen border-t border-line" />
    </>
  );
}
