import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { nav } from '../../../data/nav';
import { media } from '../../../data/media';
import { cn } from '../../../lib/cn';

interface WorkPanelProps {
  /** Index of the project whose thumbnail is crossfaded in on the right. */
  activeIndex: number;
  onActivate: (index: number) => void;
}

/**
 * Discover-style work panel: a list of the three projects on the left
 * and a crossfading thumbnail (from media.ts) on the right.
 * Panel box: 664 x 358 on desktop.
 */
export default function WorkPanel({ activeIndex, onActivate }: WorkPanelProps) {
  const items = nav.menus.work.workItems;

  return (
    <div className="flex h-full gap-3.5 p-3.5">
      <ul className="flex w-[288px] shrink-0 flex-col gap-1">
        {items.map((item, index) => (
          <li key={item.id} className="flex-1">
            <Link
              to={item.href}
              onPointerEnter={(event) => {
                if (event.pointerType === 'mouse') onActivate(index);
              }}
              onFocus={() => onActivate(index)}
              className={cn(
                'flex h-full flex-col justify-center gap-1 rounded-xl px-4 py-3 transition-colors duration-200 hover:bg-white/5',
                activeIndex === index && 'bg-white/5',
              )}
            >
              <span className="flex items-center gap-1.5 text-sm font-semibold text-ink">
                {item.label}
                <ArrowUpRight
                  size={14}
                  aria-hidden="true"
                  className={cn(
                    'text-ink opacity-0 transition-opacity duration-200',
                    activeIndex === index && 'opacity-70',
                  )}
                />
              </span>
              <span className="line-clamp-2 text-[13px] leading-snug text-muted">
                {item.description}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {/* Decorative preview of the hovered project; the list itself carries the labels. */}
      <div className="dd-media flex-1" aria-hidden="true">
        {items.map((item, index) => (
          <img
            key={item.id}
            src={media(item.imageKey)}
            alt=""
            data-active={index === activeIndex}
            loading="lazy"
            decoding="async"
          />
        ))}
      </div>
    </div>
  );
}
