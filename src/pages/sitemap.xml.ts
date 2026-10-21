// Sitemap con todas las páginas indexables y, en cada una, sus versiones en los demás idiomas
// (xhtml:link hreflang), como recomienda Google para webs multidioma con direcciones traducidas.
import type { APIRoute } from 'astro';
import { allKeys, alternates, indexable } from '../lib/routes';
import { HREFLANG, DEFAULT_LANG } from '../i18n/langs';
import { abs } from '../lib/seo';

const esc = (s: string) => s.replace(/&/g, '&amp;');
export const GET: APIRoute = async () => {
  const keys = (await Promise.all((await allKeys()).map(async (k) => ((await indexable(k)) ? k : null)))).filter(Boolean) as string[];
  const hoy = new Date().toISOString().slice(0, 10);
  const urls: string[] = [];
  for (const key of keys) {
    const alts = alternates(key);
    const links = alts.map(([l, u]) => `<xhtml:link rel="alternate" hreflang="${HREFLANG[l]}" href="${esc(abs(u))}"/>`).join('');
    const def = alts.find(([l]) => l === DEFAULT_LANG)?.[1];
    const xdef = def ? `<xhtml:link rel="alternate" hreflang="x-default" href="${esc(abs(def))}"/>` : '';
    for (const [, u] of alts) urls.push(`<url><loc>${esc(abs(u))}</loc><lastmod>${hoy}</lastmod>${links}${xdef}</url>`);
  }
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
