export interface Service {
  /** Anchor id on the /services page. */
  id: string;
  index: string;
  title: string;
  description: string;
  href: string;
}

export const services: Service[] = [
  {
    id: 'duka-manager',
    index: '01',
    title: 'Duka Manager',
    description:
      'Finance, sales and stock tracking for small shops. Works on any phone, with owner, manager and cashier roles. Already running with 3 businesses.',
    href: '/services#duka-manager',
  },
  {
    id: 'custom',
    index: '02',
    title: 'Custom business apps',
    description:
      'Web apps built around how your business actually works: React, Node or FastAPI, PostgreSQL.',
    href: '/services#custom',
  },
  {
    id: 'pipelines',
    index: '03',
    title: 'Data pipelines & warehousing',
    description: 'Bring scattered sales, finance or ERP data into one clean, reportable place.',
    href: '/services#pipelines',
  },
  {
    id: 'dashboards',
    index: '04',
    title: 'Dashboards & reporting',
    description:
      'Power BI or web dashboards so owners see profit, stock and trends at a glance.',
    href: '/services#dashboards',
  },
];
