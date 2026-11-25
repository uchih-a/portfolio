import { ArrowUpRight, Store, Wrench } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { nav } from '../../../data/nav';

/** Icon per service card id; labels, descriptions and hrefs come from nav.ts. */
const CARD_ICONS: Record<string, LucideIcon> = {
  'duka-manager': Store,
  custom: Wrench,
};

/**
 * Journeys-style services panel: two cards side by side.
 * Panel box: 446 x 308 on desktop.
 */
export default function ServicesPanel() {
  const cards = nav.menus.services.serviceCards;

  return (
    <div className="grid h-full grid-cols-2 gap-3 p-3.5">
      {cards.map((card) => {
        const Icon = CARD_ICONS[card.id] ?? Wrench;
        return (
          <Link
            key={card.id}
            to={card.href}
            className="group flex flex-col rounded-xl border border-line bg-white/[0.02] p-4 transition-colors duration-200 hover:border-white/15 hover:bg-white/5"
          >
            <Icon size={20} className="text-ink" aria-hidden="true" />
            <span className="mt-2.5 text-sm font-semibold text-ink">
              {card.label}
            </span>
            <span className="mt-1.5 text-[13px] leading-snug text-muted">
              {card.description}
            </span>
            <ArrowUpRight
              size={16}
              aria-hidden="true"
              className="mt-auto pt-3 text-muted transition-colors duration-200 group-hover:text-ink"
            />
          </Link>
        );
      })}
    </div>
  );
}
