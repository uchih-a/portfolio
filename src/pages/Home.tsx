import Hero from '../components/sections/hero/Hero';
import Contact from '../components/sections/contact/Contact';
import Projects from '../components/sections/projects/Projects';
import Timeline from '../components/sections/timeline/Timeline';
import { usePageMeta } from '../hooks/usePageMeta';

/** Home page: the cinematic hero, selected projects, timeline, contact. */
export default function Home() {
  usePageMeta(
    'Alexander Nzaywa — Data engineer & software developer',
    'Alexander Mutsala Nzaywa — data engineer who builds software, from pipelines to production APIs. Kenya, open to remote.',
  );

  return (
    <>
      <Hero />
      <Projects />
      <Timeline />
      <Contact />
    </>
  );
}
