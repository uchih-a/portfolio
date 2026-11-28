export interface TimelineEntry {
  id: string;
  type: 'education' | 'experience' | 'achievement' | 'venture' | 'milestone' | 'now';
  startYear: number;
  period: string;
  title: string;
  org?: string;
  location?: string;
  summary: string;
  achievements?: string[];
  parts?: { title: string; detail: string }[];
  link?: { label: string; href: string } | null;
  todo?: string;
}

/**
 * Chronological, ascending (oldest first). One entry per stage of the
 * story; the /journey scroll-story retells these by id, so ids are stable.
 *
 * NOTE: `todo` fields are unresolved (surfaced, never fixed here).
 */
export const timeline: TimelineEntry[] = [
  {
    id: 'school',
    type: 'education',
    startYear: 2018,
    period: '2018 – 2022',
    title: "St. Mary's Kibabii School",
    org: 'National school, Bungoma',
    summary: 'Four years at a national school, starting in Form 1 in 2018.',
    achievements: ['Dorm prefect'],
  },

  {
    id: 'university',
    type: 'education',
    startYear: 2022,
    period: '2022 – Oct 2026',
    title: 'BSc Data Science',
    org: 'Meru University of Science and Technology',
    summary: 'Four years studying data science, from machine learning to data warehousing.',
  },

  {
    id: 'traffic-contest',
    type: 'achievement',
    startYear: 2024,
    period: '2024',
    title: 'Won a university contest',
    summary:
      'Built a traffic analysis system that predicts how severe a traffic jam will be, and won the contest.',
    link: null,
    todo: 'verify year (currently 2024); add repo URL to link if/when available',
  },

  {
    id: 'ampath',
    type: 'experience',
    startYear: 2025,
    period: 'May – Aug 2025',
    title: 'M&E Attachee, USAID AMPATH Uzima',
    org: 'Moi Teaching & Referral Hospital',
    location: 'Eldoret',
    summary:
      'Validated programme data in DHIS2 against Ministry of Health indicators and built dashboards in DHIS2, Power BI, Excel and R Shiny.',
  },

  {
    id: 'mtrh',
    type: 'experience',
    startYear: 2026,
    period: 'May – Sep 2026',
    title: 'Attachment, Moi Teaching & Referral Hospital',
    location: 'Eldoret',
    summary: 'Rotated through three departments and spent most of my time with the programmers.',
    parts: [
      { title: 'Cancer Registry', detail: 'Data entry' },
      { title: 'Research & Statistics', detail: 'Working with research data and statistics' },
      {
        title: 'Programmers Department',
        detail: 'Built scripts that automate reports and other system functions',
      },
    ],
  },

  {
    id: 'duka',
    type: 'venture',
    startYear: 2026,
    period: 'Aug 2026 – now',
    title: 'Duka Manager',
    summary: 'Finance, sales and stock tracking for small shops, used by 3 businesses.',
    link: { label: 'See services', href: '/services#duka-manager' },
  },

  {
    id: 'degree-complete',
    type: 'milestone',
    startYear: 2026,
    period: '23 Oct 2026',
    title: 'Completed my degree',
    summary: '',
  },

  {
    id: 'now',
    type: 'now',
    startYear: 2026,
    period: 'Now',
    title: 'Open to work',
    summary: 'Looking for data engineering and software roles, remote or on-site.',
    link: { label: 'Get in touch', href: '/#contact' },
  },
];
