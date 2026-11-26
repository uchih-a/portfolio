import { useEffect } from 'react';
import { SITE_URL } from '../data/site';

/**
 * Sets the document title, meta description and canonical URL for the
 * current page. No router integration and no extra dependency — call
 * it from a page component with static strings for that page.
 */
export function usePageMeta(title: string, description?: string): void {
  useEffect(() => {
    document.title = title;

    if (description !== undefined) {
      let tag = document.querySelector<HTMLMetaElement>('meta[name="description"]');
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', 'description');
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', description);
    }

    // Canonical URL for this route (path only; hash/query excluded).
    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.href = `${SITE_URL}${window.location.pathname}`;
  }, [title, description]);
}
