export interface SiteSocial {
  github: string | null;
  linkedin: string | null;
}

export interface NotFoundContent {
  title: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
}

export interface SiteData {
  name: string;
  tagline: string;
  location: string;
  social: SiteSocial;
  notFound: NotFoundContent;
}

/**
 * Absolute origin used for the canonical link, Open Graph / Twitter
 * URLs and the generated sitemap.xml + robots.txt.
 *
 * PLACEHOLDER — change this constant (or set the SITE_URL environment
 * variable at build time, which wins) when the site moves to its real
 * domain. No trailing slash.
 */
export const SITE_URL = 'https://portfolio-alexander-nzaywa.vercel.app';

export const site: SiteData = {
  name: 'Alexander Mutsala Nzaywa',
  tagline: 'Data engineer who builds software, from pipelines to production APIs.',
  location: 'Kenya · Remote or on-site',
  social: {
    github: 'https://github.com/uchih-a',
    linkedin: null,
  },
  notFound: {
    title: 'Page not found',
    body: 'The page you are looking for does not exist or may have moved.',
    ctaLabel: 'Back to home',
    ctaHref: '/',
  },
};
