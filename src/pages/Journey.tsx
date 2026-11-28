import FadeIn from '../components/ui/FadeIn';
import { usePageMeta } from '../hooks/usePageMeta';

/** /journey placeholder: the scroll-story engine replaces this page. */
export default function Journey() {
  usePageMeta(
    'My journey — Alexander Nzaywa',
    'Coming soon: my journey from a Bungoma school to data engineering, told as one long walk.',
  );

  return (
    <section className="px-5 py-32 sm:px-8 md:px-10 md:py-40" aria-label="My journey">
      <div className="mx-auto max-w-3xl">
        <FadeIn y={40}>
          <h1 className="hero-heading text-[clamp(2.6rem, 8vw, 6rem)] font-bold uppercase leading-[0.95] tracking-tight">
            My journey
          </h1>
        </FadeIn>
        <FadeIn delay={0.15} y={24}>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            Coming soon — the walk from Form 1 to data engineering, told as one
            scroll.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
