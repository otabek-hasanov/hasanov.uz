import { Router } from 'express';
import { config } from '../config.js';
import { getProjects } from '../services/portfolioService.js';

const router = Router();

function localePath(locale, segment = '') {
  const clean = segment.replace(/^\/+|\/+$/g, '');
  return clean === '' ? `/${locale}` : `/${locale}/${clean}`;
}

function localeFullUrl(locale, segment = '') {
  return `${config.app.url}${localePath(locale, segment)}`;
}

router.get('/robots.txt', (_req, res) => {
  res.type('text/plain').send(
    `User-agent: *\nDisallow: /admin\nDisallow: /api\nAllow: /\n\nSitemap: ${config.app.url}/sitemap.xml\n`
  );
});

router.get('/sitemap.xml', async (_req, res) => {
  const { supported, default: defaultLocale } = config.locales;
  const projects = await getProjects(false);

  const pages = ['', 'projects', ...projects.map((p) => `projects/${p.slug}`)];

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';

  for (const page of pages) {
    for (const locale of supported) {
      xml += `  <url>\n    <loc>${localeFullUrl(locale, page)}</loc>\n`;
      for (const alt of supported) {
        xml += `    <xhtml:link rel="alternate" hreflang="${alt}" href="${localeFullUrl(alt, page)}" />\n`;
      }
      xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${localeFullUrl(defaultLocale, page)}" />\n`;
      xml += '    <changefreq>weekly</changefreq>\n  </url>\n';
    }
  }
  xml += '</urlset>';

  res.type('application/xml').send(xml);
});

router.get('/manifest.json', (_req, res) => {
  res.json({
    name: config.app.name,
    short_name: config.app.name,
    start_url: localePath(config.locales.default),
    display: 'standalone',
    background_color: '#05070d',
    theme_color: '#05070d',
    icons: [
      { src: '/favicon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/favicon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  });
});

export default router;
