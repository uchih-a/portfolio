import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { SITE_URL } from './src/data/site';

// The site's absolute origin. The constant lives in src/data/site.ts so
// runtime code (canonical links) and build-time files (sitemap, robots,
// Open Graph tags) share one source of truth. A SITE_URL environment
// variable set at build time wins — handy on Vercel.
const siteUrl = (process.env.SITE_URL || SITE_URL).replace(/\/+$/, '');

/** Replaces %SITE_URL% placeholders baked into index.html. */
function htmlSiteUrl(): Plugin {
  return {
    name: 'html-site-url',
    transformIndexHtml(html) {
      return html.replaceAll('%SITE_URL%', siteUrl);
    },
  };
}

/**
 * Preloads the self-hosted Urbanist variable font. The woff2 arrives
 * via @fontsource-variable/urbanist and is fingerprinted by Vite, so
 * the exact hashed URL is only known after the bundle is built — this
 * hook finds the asset and injects the <link rel="preload"> tag.
 */
function preloadUrbanistFont(): Plugin {
  return {
    name: 'preload-urbanist-font',
    apply: 'build',
    enforce: 'post',
    generateBundle(_, bundle) {
      // Prefer the `latin` subset — it is the one English content uses.
      const font =
        Object.values(bundle).find(
          (asset) =>
            asset.type === 'asset' && /urbanist-latin(?!-ext).*\.woff2$/.test(asset.fileName),
        ) ??
        Object.values(bundle).find(
          (asset) => asset.type === 'asset' && /urbanist.*\.woff2$/.test(asset.fileName),
        );
      const html = bundle['index.html'];
      if (!font || !html || html.type !== 'asset') return;
      html.source = String(html.source).replace(
        '</head>',
        `    <link rel="preload" as="font" type="font/woff2" crossorigin href="/${font.fileName}" />\n  </head>`,
      );
    },
  };
}

/** Emits robots.txt and sitemap.xml into dist with the final SITE_URL. */
function emitSeoFiles(): Plugin {
  return {
    name: 'emit-seo-files',
    apply: 'build',
    generateBundle() {
      const pages = [
        { path: '/', priority: '1.0' },
        { path: '/services', priority: '0.8' },
      ];
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: ['User-agent: *', 'Allow: /', '', `Sitemap: ${siteUrl}/sitemap.xml`, ''].join('\n'),
      });
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          ...pages.map(
            (page) =>
              `  <url><loc>${siteUrl}${page.path}</loc><changefreq>monthly</changefreq><priority>${page.priority}</priority></url>`,
          ),
          '</urlset>',
          '',
        ].join('\n'),
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), htmlSiteUrl(), preloadUrbanistFont(), emitSeoFiles()],
});
