import type { MediaKey } from './media';
import type { ProjectId } from './projects';

export interface NavLinkItem {
  label: string;
  href: string;
}

/** Rich entry inside the "work" mega menu (used by later chunks). */
export interface NavWorkItem {
  id: ProjectId;
  label: string;
  description: string;
  imageKey: MediaKey;
  href: string;
}

/** Card inside the "services" mega menu (used by later chunks). */
export interface NavServiceCard {
  id: string;
  label: string;
  description: string;
  href: string;
}

export interface NavMenu {
  label: string;
  /** Top-level destination when the menu is not opened. */
  href: string;
  workItems?: NavWorkItem[];
  serviceCards?: NavServiceCard[];
}

export interface NavData {
  brand: NavLinkItem;
  menus: {
    work: NavMenu;
    services: NavMenu;
  };
  links: NavLinkItem[];
  cta: NavLinkItem;
}

export const nav: NavData = {
  brand: { label: 'Alexander', href: '/' },
  menus: {
    work: {
      label: 'Work',
      href: '/#projects',
      workItems: [
        {
          id: 'landiq',
          label: 'LandIQ',
          description: 'Kenya land valuation platform with ML price estimates.',
          imageKey: 'thumb-1',
          href: '/#project-landiq',
        },
        {
          id: 'enterprise-data-warehouse',
          label: 'Enterprise Data Warehouse',
          description: 'Medallion-architecture warehouse consolidating ERP and CRM data.',
          imageKey: 'thumb-2',
          href: '/#project-enterprise-data-warehouse',
        },
        {
          id: 'voxign',
          label: 'Voxign',
          description: 'Real-time sign-language recognition research prototype.',
          imageKey: 'thumb-3',
          href: '/#project-voxign',
        },
      ],
    },
    services: {
      label: 'Services',
      href: '/services',
      serviceCards: [
        {
          id: 'duka-manager',
          label: 'Duka Manager',
          description: 'Finance, sales and stock tracking for small shops.',
          href: '/services#duka-manager',
        },
        {
          id: 'custom',
          label: 'Custom apps',
          description: 'Web apps built around how your business actually works.',
          href: '/services#custom',
        },
      ],
    },
  },
  links: [
    { label: 'Timeline', href: '/#timeline' },
    { label: 'Contact', href: '/#contact' },
  ],
  cta: { label: 'Get in touch', href: '/#contact' },
};
