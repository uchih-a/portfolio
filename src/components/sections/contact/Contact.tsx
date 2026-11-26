import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowUpRight, LoaderCircle, RefreshCw } from 'lucide-react';
import { contactHeading, contactRules, INTERESTS } from '../../../data/contact';
import { site } from '../../../data/site';
import { cn } from '../../../lib/cn';
import FadeIn from '../../ui/FadeIn';
import GhostButton from '../../ui/GhostButton';
import PrimaryButton from '../../ui/PrimaryButton';
import SectionHeading from '../../ui/SectionHeading';

type Status = 'idle' | 'submitting' | 'success' | 'error';
type FieldName = 'name' | 'email' | 'interest' | 'message';
type Errors = Partial<Record<FieldName, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface ContactProps {
  /** Pre-selected value for the interest select (e.g. "Duka Manager demo"). */
  defaultInterest?: string;
}

/**
 * Contact form shared by the Home page and the Services page.
 * Client-side validation matches the server rules (name 2-80, email
 * format, message 10-2000, interest from the allowed list). The
 * honeypot ("company") and the page source are read from FormData so
 * bot tooling that writes DOM values directly is still caught, and
 * the elapsed-since-render time accompanies every submission.
 * Status changes are announced through an aria-live="polite" region;
 * success swaps the form for a thank-you note with a "Send another"
 * reset. No email address is ever rendered client-side.
 */
export default function Contact({ defaultInterest }: ContactProps) {
  const { pathname } = useLocation();
  const mountedAt = useRef(Date.now());

  const [values, setValues] = useState({
    name: '',
    email: '',
    interest:
      defaultInterest && INTERESTS.includes(defaultInterest as (typeof INTERESTS)[number])
        ? defaultInterest
        : INTERESTS[0],
    message: '',
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>('idle');

  const set = (field: FieldName, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): Errors => {
    const e: Errors = {};
    const name = values.name.trim();
    if (name.length < contactRules.nameMin || name.length > contactRules.nameMax) {
      e.name = `Please use ${contactRules.nameMin}-${contactRules.nameMax} characters.`;
    }
    const email = values.email.trim();
    if (!EMAIL_RE.test(email)) {
      e.email = 'Please enter a valid email address.';
    }
    if (!INTERESTS.includes(values.interest as (typeof INTERESTS)[number])) {
      e.interest = 'Please choose an option.';
    }
    const message = values.message.trim();
    if (message.length < contactRules.messageMin || values.message.length > contactRules.messageMax) {
      e.message = `Please use ${contactRules.messageMin}-${contactRules.messageMax} characters.`;
    }
    return e;
  };

  const handleSubmit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setStatus('submitting');

    const form = new FormData(ev.currentTarget);
    const payload = {
      name: values.name.trim(),
      email: values.email.trim(),
      interest: values.interest,
      message: values.message,
      company: String(form.get('company') ?? ''),
      source: String(form.get('source') ?? pathname),
      elapsed: Date.now() - mountedAt.current,
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      setStatus(res.ok ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  };

  const reset = () => {
    setValues({ name: '', email: '', interest: INTERESTS[0], message: '' });
    setErrors({});
    mountedAt.current = Date.now();
    setStatus('idle');
  };

  const inputBase =
    'min-h-11 w-full rounded-2xl border bg-white/5 px-4 py-3 text-sm text-ink placeholder:text-muted transition-colors focus:border-accent/60';

  return (
    <section
      id="contact"
      aria-label="Contact"
      className="px-5 py-20 sm:px-8 sm:py-24 md:px-10 md:py-32"
    >
      <div className="mx-auto max-w-2xl">
        <FadeIn y={40}>
          <SectionHeading title={contactHeading.title} className="text-center" />
        </FadeIn>
        <FadeIn delay={0.1}>
          <p className="mt-4 text-center text-sm text-muted sm:text-base">
            {contactHeading.intro}
          </p>
        </FadeIn>

        {status === 'success' ? (
          <div
            className="mt-10 rounded-[26px] border border-line bg-panel p-8 text-center sm:p-10"
            role="status"
          >
            <p className="text-lg font-bold sm:text-xl">Thank you — your message is on its way.</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              I usually reply within a couple of days.
            </p>
            <GhostButton className="mt-8" onClick={reset}>
              <RefreshCw size={14} aria-hidden="true" strokeWidth={1.75} />
              Send another
            </GhostButton>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            noValidate
            className="mt-10 rounded-[26px] border border-line bg-panel p-5 sm:p-8"
          >
            {/* Hidden page source */}
            <input type="hidden" name="source" value={pathname} />

            {/* Honeypot: visually hidden, out of tab order, bots only */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-[9999px] h-px w-px overflow-hidden"
            >
              <label htmlFor="company">Company</label>
              <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="contact-name"
                  className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted"
                >
                  Name
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  value={values.name}
                  onChange={(e) => set('name', e.target.value)}
                  autoComplete="name"
                  className={cn(inputBase, errors.name ? 'border-rose-500/70' : 'border-line')}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'contact-name-error' : undefined}
                />
                {errors.name && (
                  <p id="contact-name-error" className="mt-1.5 text-xs text-rose-400">
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="contact-email"
                  className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted"
                >
                  Email
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  value={values.email}
                  onChange={(e) => set('email', e.target.value)}
                  autoComplete="email"
                  placeholder="you@example.com"
                  className={cn(inputBase, errors.email ? 'border-rose-500/70' : 'border-line')}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'contact-email-error' : undefined}
                />
                {errors.email && (
                  <p id="contact-email-error" className="mt-1.5 text-xs text-rose-400">
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-5">
              <label
                htmlFor="contact-interest"
                className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted"
              >
                I'm interested in
              </label>
              <select
                id="contact-interest"
                name="interest"
                value={values.interest}
                onChange={(e) => set('interest', e.target.value)}
                className={cn(inputBase, 'appearance-none border-line', errors.interest && 'border-rose-500/70')}
              >
                {INTERESTS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.interest && (
                <p className="mt-1.5 text-xs text-rose-400">{errors.interest}</p>
              )}
            </div>

            <div className="mt-5">
              <label
                htmlFor="contact-message"
                className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted"
              >
                Message
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows={6}
                maxLength={contactRules.messageMax}
                value={values.message}
                onChange={(e) => set('message', e.target.value)}
                placeholder="A few lines about what you need..."
                className={cn(
                  inputBase,
                  'min-h-32 resize-y',
                  errors.message ? 'border-rose-500/70' : 'border-line',
                )}
                aria-invalid={!!errors.message}
                aria-describedby="contact-message-counter"
              />
              <p id="contact-message-counter" className="mt-1.5 text-right text-xs text-muted">
                {values.message.length} / {contactRules.messageMax}
              </p>
              {errors.message && (
                <p className="mt-1 text-xs text-rose-400">{errors.message}</p>
              )}
            </div>

            <p role="status" aria-live="polite" className="mt-5 min-h-5 text-sm">
              {status === 'error' && (
                <span className="text-rose-400">
                  Something went wrong — the message wasn't sent. Please try again.
                </span>
              )}
            </p>

            <PrimaryButton
              type="submit"
              disabled={status === 'submitting'}
              className="mt-3 min-w-44"
            >
              {status === 'submitting' ? (
                <>
                  <LoaderCircle className="animate-spin" size={16} aria-hidden="true" />
                  Sending...
                </>
              ) : (
                'Send message'
              )}
            </PrimaryButton>
          </form>
        )}

        <ul className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {site.social.github && (
            <li>
              <a
                href={site.social.github}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-line px-5 py-2.5 text-sm font-medium text-muted transition-colors hover:border-ink hover:text-ink"
              >
                GitHub
                <ArrowUpRight size={15} aria-hidden="true" strokeWidth={1.75} />
              </a>
            </li>
          )}
          {site.social.linkedin && (
            <li>
              <a
                href={site.social.linkedin}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-line px-5 py-2.5 text-sm font-medium text-muted transition-colors hover:border-ink hover:text-ink"
              >
                LinkedIn
                <ArrowUpRight size={15} aria-hidden="true" strokeWidth={1.75} />
              </a>
            </li>
          )}
        </ul>
      </div>
    </section>
  );
}
