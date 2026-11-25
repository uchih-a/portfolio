export interface TimelineEntry {
  id: string;
  /** Human-readable period, e.g. "2025-05 – 2025-08" or "2026". */
  period: string;
  title: string;
  org?: string;
  description: string;
}

/**
 * Oldest first.
 * landiq and EDW periods verified against commit history via the GitHub MCP
 * (landiq: first commit 2026-04, latest 2026-11; EDW: first commit 2026-10-18, latest 2026-11-01).
 */
export const timeline: TimelineEntry[] = [
  {
    id: 'ampath-attachment',
    period: '2025-05 – 2025-08',
    title: 'Monitoring & Evaluation Attachee',
    org: 'USAID AMPATH Uzima (Moi Teaching & Referral Hospital), Eldoret',
    description:
      'Validated programme data in DHIS2 against Ministry of Health indicators and built dashboards in DHIS2, Power BI, Excel and R Shiny.',
  },
  {
    id: 'landiq',
    period: '2026-04 – 2026-11',
    title: 'Property24 scraper and LandIQ',
    description: 'Built a resumable Scrapy pipeline, then the LandIQ valuation platform.',
  },
  {
    id: 'enterprise-data-warehouse',
    period: '2026-10 – 2026-11',
    title: 'Enterprise Data Warehouse',
    description:
      'Designed a Medallion-architecture warehouse in SQL Server with ETL, quality tests and a data catalog.',
  },
  {
    id: 'duka-live',
    period: '2026-08',
    title: 'Duka Manager goes live',
    description: 'Finance, sales and stock tracking web app for small shops, used by 3 businesses.',
  },
  {
    id: 'bsc-data-science',
    period: '2026',
    title: 'BSc Data Science',
    org: 'Meru University of Science and Technology',
    description: '',
  },
];

/** Certification chips shown with the timeline (no issuers). */
export const certifications: string[] = [
  'Cisco Python course',
  'National HIV Program DHIS2',
  'Data Quality Assessment',
];
