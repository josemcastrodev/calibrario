// @ts-check
import { defineConfig } from 'astro/config';

// Sitio estático para Cloudflare Pages. Español sin prefijo y /en/, /de/, /fr/, /it/ con sus propias
// direcciones traducidas (src/lib/routes.ts). El sitemap con hreflang lo genera src/pages/sitemap.xml.ts.
export default defineConfig({
  site: 'https://calibrario.com',
  trailingSlash: 'always',
  build: { inlineStylesheets: 'auto' },
});
