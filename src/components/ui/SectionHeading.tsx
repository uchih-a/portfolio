import { cn } from '../../lib/cn';

interface SectionHeadingProps {
  title: string;
  /** Small uppercase kicker above the title. */
  eyebrow?: string;
  className?: string;
  /** Heading level, defaults to h2. */
  as?: 'h1' | 'h2';
}

/** Big display heading in the gradient hero-heading style. */
export default function SectionHeading({
  title,
  eyebrow,
  className,
  as: Tag = 'h2',
}: SectionHeadingProps) {
  return (
    <div className={cn(className)}>
      {eyebrow && (
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-accent">{eyebrow}</p>
      )}
      <Tag className="hero-heading text-[clamp(3rem,12vw,160px)] font-bold uppercase leading-[0.95] tracking-tight">
        {title}
      </Tag>
    </div>
  );
}
