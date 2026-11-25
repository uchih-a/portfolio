import GhostButton from '../components/ui/GhostButton';
import { site } from '../data/site';

export default function NotFound() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 py-16 text-center">
      <p className="hero-heading text-[clamp(3rem,12vw,160px)] font-bold uppercase leading-[0.95]">
        404
      </p>
      <h1 className="text-2xl font-semibold text-ink">{site.notFound.title}</h1>
      <p className="max-w-md leading-relaxed text-muted">{site.notFound.body}</p>
      <GhostButton to={site.notFound.ctaHref}>{site.notFound.ctaLabel}</GhostButton>
    </section>
  );
}
