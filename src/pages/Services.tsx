import {
  CircleCheck,
  FileText,
  MessageSquare,
  ShieldCheck,
  Smartphone,
  Store,
  Users,
  Wallet,
  Wrench,
} from 'lucide-react';
import Contact from '../components/sections/contact/Contact';
import FadeIn from '../components/ui/FadeIn';
import GhostButton from '../components/ui/GhostButton';
import PrimaryButton from '../components/ui/PrimaryButton';
import Video from '../components/ui/Video';
import { media } from '../data/media';
import { services } from '../data/services';
import { usePageMeta } from '../hooks/usePageMeta';

/** Plain-language Duka Manager feature rows (lucide icons). */
const DUKA_FEATURES = [
  {
    icon: Store,
    title: 'Sales and stock',
    text: 'Record every sale and see what is left on the shelf right away.',
  },
  {
    icon: Wallet,
    title: 'Expenses and cash flow',
    text: 'Track what goes out and what comes in, day by day.',
  },
  {
    icon: FileText,
    title: 'Reports you can read',
    text: 'Simple summaries of profit, stock levels and best sellers.',
  },
  {
    icon: Smartphone,
    title: 'Works on any phone',
    text: 'No expensive computer needed — it runs in the browser.',
  },
  {
    icon: Users,
    title: 'Owner, manager and cashier roles',
    text: 'Each person sees only what they need to.',
  },
];

/** Three-step "How it works" cards. */
const HOW_IT_WORKS = [
  {
    icon: MessageSquare,
    step: '1',
    title: 'Talk',
    text: 'Tell me how your business runs.',
  },
  {
    icon: Wrench,
    step: '2',
    title: 'Build or set up',
    text: 'I configure or build it.',
  },
  {
    icon: ShieldCheck,
    step: '3',
    title: 'Support',
    text: 'I stay available as you use it.',
  },
];

/**
 * /services — written for small-business owners (not recruiters):
 * hero, the Duka Manager product block, the numbered services list,
 * how it works, and the shared contact form pre-set to "Duka Manager
 * demo". Reuses Navbar/Footer from the layout and the Contact section.
 */
export default function Services() {
  usePageMeta(
    'Services — Duka Manager & custom software | Alexander Nzaywa',
    'Software and data systems for small businesses: Duka Manager for finance, sales and stock, custom apps, data pipelines and dashboards that work on any phone.',
  );

  const clouds = `url("${media('clouds')}")`;

  return (
    <>
      {/* 1. Hero — dark, full viewport on desktop, min 70svh on mobile */}
      <section
        aria-label="Software and data systems for small businesses"
        className="relative flex min-h-[70svh] flex-col justify-center overflow-hidden px-5 pb-16 pt-28 sm:px-8 md:px-10 lg:min-h-screen lg:pt-20"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.16] mix-blend-screen"
          style={{
            backgroundImage: clouds,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center bottom',
          }}
        />
        <div className="relative mx-auto w-full max-w-7xl">
          <FadeIn y={40}>
            <h1 className="hero-heading max-w-[16ch] text-[clamp(2.1rem,7vw,7rem)] font-bold uppercase leading-[0.95] tracking-tight">
              Software and data systems for small businesses.
            </h1>
          </FadeIn>
          <FadeIn delay={0.15} y={24}>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
              I build tools that make shop and office work simpler: finance,
              stock, reports.
            </p>
          </FadeIn>
          <FadeIn delay={0.3} y={24}>
            <div className="mt-10 flex flex-wrap gap-3">
              <PrimaryButton to="#contact">Book a demo</PrimaryButton>
              <GhostButton to="#duka-manager">See Duka Manager</GhostButton>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 2. Duka Manager block */}
      <section
        id="duka-manager"
        aria-label="Duka Manager"
        className="px-5 py-20 sm:px-8 md:px-10 md:py-28"
      >
        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-2 md:gap-16 lg:gap-20">
          <FadeIn y={24}>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-accent">Product</p>
            <h2 className="hero-heading mt-3 text-3xl font-bold uppercase leading-[0.95] sm:text-4xl md:text-5xl">
              Duka Manager
            </h2>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-muted sm:text-lg">
              Finance, sales and stock tracking for small shops — in one
              place, on any phone.
            </p>

            <ul className="mt-8 border-t border-line">
              {DUKA_FEATURES.map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex items-start gap-4 border-b border-line py-4 sm:py-5">
                  <span className="flex h-11 w-11 flex-none items-center justify-center rounded-2xl border border-line bg-white/5 text-accent">
                    <Icon size={19} aria-hidden="true" strokeWidth={1.6} />
                  </span>
                  <div>
                    <p className="font-semibold">{title}</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-muted">{text}</p>
                  </div>
                </li>
              ))}
            </ul>

            <p className="mt-6 flex items-center gap-2 text-sm font-medium text-muted">
              <CircleCheck size={16} aria-hidden="true" strokeWidth={1.6} className="text-accent" />
              Running with 3 small businesses.
            </p>

            <PrimaryButton to="#contact" className="mt-8">
              Book a demo
            </PrimaryButton>
          </FadeIn>

          <FadeIn y={24} delay={0.1}>
            <Video
              src={media('duka-demo')}
              poster={media('duka-poster')}
              alt="Duka Manager demo video"
              className="aspect-[4/3] w-full rounded-[24px] border border-line sm:rounded-[32px] md:rounded-[40px]"
            />
            <div className="mt-4 grid grid-cols-3 gap-3 sm:gap-4">
              {(['duka-1', 'duka-2', 'duka-3'] as const).map((key, i) => (
                <img
                  key={key}
                  src={media(key)}
                  alt={`Duka Manager screenshot ${i + 1}`}
                  className="aspect-[4/3] w-full rounded-[14px] border border-line object-cover sm:rounded-[18px]"
                  loading="lazy"
                  decoding="async"
                />
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 3. Numbered services list — white sheet, big numbers, 1px rows */}
      <section
        id="custom"
        aria-label="Services"
        className="relative z-0 rounded-t-[40px] bg-white px-5 py-20 sm:rounded-t-[50px] sm:px-8 sm:py-24 md:rounded-t-[60px] md:px-10 md:py-32"
      >
        <h2 className="text-center text-[clamp(3rem,12vw,160px)] font-black uppercase leading-none text-[#0C0C0C]">
          Services
        </h2>

        <div className="mx-auto mt-16 max-w-5xl sm:mt-20 md:mt-28">
          {services.map((service, i) => (
            <FadeIn key={service.id} delay={i * 0.1} y={24}>
              <div
                className={`grid grid-cols-[minmax(4.5rem,auto)_minmax(0,1fr)] gap-x-6 border-[rgba(12,12,12,0.15)] py-8 sm:gap-x-10 sm:py-10 md:py-12 ${
                  i === 0 ? 'border-t' : 'border-y'
                }`}
              >
                <p className="text-[clamp(2.1rem,9vw,140px)] font-black leading-[0.85] text-[#0C0C0C]">
                  {service.index}
                </p>
                <div>
                  <h3 className="text-[clamp(1.1rem,2.2vw,2.1rem)] font-medium uppercase text-[#0C0C0C]">
                    {service.title}
                  </h3>
                  <p className="mt-3 max-w-2xl text-[clamp(0.9rem,1.6vw,1.25rem)] font-light leading-relaxed text-[#0C0C0C]/60">
                    {service.description}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* 4. How it works — dark sheet pulled up under the white one */}
      <section
        aria-label="How it works"
        className="relative z-10 -mt-10 rounded-t-[40px] bg-bg px-5 pb-4 pt-16 sm:-mt-12 sm:rounded-t-[50px] sm:px-8 md:-mt-14 md:rounded-t-[60px] md:px-10 md:pt-20"
      >
        <div className="mx-auto max-w-5xl">
          <FadeIn y={24}>
            <h2 className="hero-heading text-3xl font-bold uppercase leading-[0.95] sm:text-4xl md:text-5xl">
              How it works
            </h2>
          </FadeIn>
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6">
            {HOW_IT_WORKS.map(({ icon: Icon, step, title, text }, i) => (
              <li key={step} className="h-full">
                <FadeIn delay={i * 0.1} y={24} className="h-full">
                  <div className="h-full rounded-[26px] border border-line bg-panel p-6">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full border border-line bg-white/5 text-accent">
                        <Icon size={18} aria-hidden="true" strokeWidth={1.6} />
                      </span>
                      <p className="hero-heading text-3xl font-bold">{step}</p>
                    </div>
                    <h3 className="mt-4 text-lg font-bold">{title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
                  </div>
                </FadeIn>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 5. Contact, pre-set to a Duka Manager demo */}
      <Contact defaultInterest="Duka Manager demo" />
    </>
  );
}
