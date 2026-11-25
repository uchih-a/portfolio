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

export const site: SiteData = {
  name: 'Alexander Mutsala Nzaywa',
  tagline: 'Data engineer who builds software, from pipelines to production APIs.',
  location: 'Kenya (remote)',
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
