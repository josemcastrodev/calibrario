# Calibrario

Comparador de relojes automáticos de 90 a 1.500 €, en Astro y en cinco idiomas. El diseño sigue [DESIGN.md](DESIGN.md) (basado en el de Sigmaphoto, con el rojo rubí como único color) y el contexto del proyecto está en [CLAUDE.md](CLAUDE.md).

## Arrancar

```bash
npm install
npm run dev
```

`npm run dev` abre la web en http://localhost:4321 con **todos** los relojes, también los que aún no están verificados.

## Compilar

| Orden | Qué hace |
|---|---|
| `npm run build` | Producción. Solo publica los relojes con `verified: true` en `src/data/relojes.json` (regla de CLAUDE.md). Hoy ninguno lo está, así que salen 146 páginas sin fichas y el catálogo avisa de que está «en preparación». |
| `npm run build:borrador` | Borrador para revisar. Incluye los relojes sin verificar, con `noindex` y un aviso visible en cada página. Lee `.env.borrador`. No se debe desplegar. |
| `npm run preview` | Sirve `dist/` en http://localhost:4322. |
| `npm run check` | Comprueba los tipos, también que los cinco diccionarios tienen todos los textos. |
| `npm run check:enlaces` | Comprueba que ningún enlace interno de `dist/` está roto y que no hay títulos repetidos. |

## Idiomas

| Idioma | Portada | Ejemplo de ficha |
|---|---|---|
| Español | `/` | `/relojes/seiko-5-sports-srpd55k1/` |
| Inglés | `/en/` | `/en/watches/seiko-5-sports-srpd55k1/` |
| Alemán | `/de/` | `/de/uhren/seiko-5-sports-srpd55k1/` |
| Francés | `/fr/` | `/fr/montres/seiko-5-sports-srpd55k1/` |
| Italiano | `/it/` | `/it/orologi/seiko-5-sports-srpd55k1/` |

Cada idioma tiene sus propias direcciones (`/de/ratgeber/gangreserve/`, `/fr/montres-de-plongee-automatiques/`), su `hreflang` hacia los otros cuatro y un selector de idioma en la cabecera, el menú del móvil y el pie. Los visitantes de Países Bajos, Polonia y Suecia ven la versión inglesa. Los enlaces de Amazon apuntan a Amazon.es: con Global Earning, Amazon lleva a cada visitante a la tienda de su país.

Las traducciones las ha hecho Claude. Antes de promocionar un idioma conviene que lo lea un nativo, sobre todo las páginas legales (llevan una nota: «prevalece la versión en español»).

## Qué páginas genera

Con los 59 relojes del borrador salen 1.156 páginas: 231 por idioma más la 404.

- Portada, catálogo con filtros y 59 fichas.
- Comparador de tres (guarda la selección en la URL) y las comparativas A frente a B, solo entre relojes del mismo estilo y precio parecido.
- 14 páginas de calibre y su índice.
- Páginas de marca (las 9 con dos o más relojes) y el índice de marcas, con todas las marcas del catálogo.
- 29 listados por filtro (buceo, vestir, aviador, menos de 300/400/500/800/1.000 €, calidad-precio, GMT, alemanes, finos, fondo visto, brazalete, piel…), solo si tienen al menos tres relojes. El de calidad-precio explica su fórmula (`puntos()` en `src/lib/listados.ts`).
- 14 guías (las 7 nuevas: cómo funciona, por qué se para, ponerlo en hora, precisión, GMT, aviador y mantenimiento), el glosario y el asistente.
- Aviso de afiliado, privacidad, cookies, aviso legal, cómo trabajamos, contacto y créditos de fotos.
- `404.html`, `sitemap.xml` (propio, en `src/pages/sitemap.xml.ts`, con las versiones de cada idioma y solo las páginas indexables) y `robots.txt`.

Cada página lleva título y descripción propios, URL canónica, `hreflang` y JSON-LD (`Product` sin precio, `BreadcrumbList`, `FAQPage`, `ItemList`, `Article`).

## Dónde se toca cada cosa

| Qué | Dónde |
|---|---|
| Datos de los relojes y sus ASIN | `src/data/relojes.json` (validado con Zod en `src/content.config.ts`) |
| Todos los textos, por idioma | `src/i18n/es.ts` y `ui-es.ts` (español), `en.ts`, `de.ts`, `fr.ts`, `it.ts` |
| Direcciones de cada idioma | `seg`, `listados[].slug` y `guias[].slug` en cada diccionario; las arma `src/lib/routes.ts` |
| Qué calibre va en cada familia | `src/data/calibres.ts` |
| Criterios de los listados | `src/lib/listados.ts` |
| Plantillas de cada tipo de página | `src/views/*.astro` (todas salen de `src/pages/[...slug].astro`) |
| Fotos y créditos | `src/assets/fotos/`, `src/lib/photos.ts`, `src/data/creditos-fotos.json` |
| Enlaces de Amazon y futura PA-API | `src/lib/amazon.ts` (etiqueta en `AMAZON_TAG`) |
| Estilos | `src/styles/global.css` |
| Interactividad (asistente, comparador, muñeca, filtros) | `src/scripts/live.js` |
| Logotipo y favicon | `src/components/Logo.astro`, `public/favicon.svg` y `node scripts/favicons.mjs` para regenerar el `.ico` y los PNG |

## Disponibilidad en Amazon

Cada reloj enlaza a su página exacta (`https://www.amazon.es/dp/{ASIN}?tag=…`). El 21/10/2026 se comprobó a mano que las 59 páginas tenían botón de compra y stock; la fecha está en el campo `amazonChecked` y aparece en la ficha. Las existencias cambian, así que conviene repetirlo una vez al mes: abrir cada enlace, y si un modelo ya no se vende, cambiar su `asin` por el de la versión vigente (otra esfera o referencia) o retirarlo. Cuando llegue la PA-API, `src/lib/amazon.ts` podrá hacerlo solo.

## Antes de publicar

1. **Verificar los datos** de cada reloj con la web del fabricante y poner `verified: true`. Cada entrada tiene `dataNotes` con lo dudoso (las medidas marcadas como estimadas, sobre todo).
2. **Rellenar los datos del titular** en el aviso legal y la privacidad (están entre corchetes) y el correo de contacto (`src/views/Page.astro`).
3. **Etiqueta de Amazon**: `calibrario-21`, ya creada en la cuenta de Afiliados el 21/10/2026. Falta añadir calibrario.com a la lista de webs de la cuenta cuando esté el dominio.
4. **Sustituir las fotos de muestra** por las oficiales cuando haya PA-API o material de prensa.
5. **Revisar las traducciones** con un nativo de cada idioma.
6. **Despliegue (hecho el 21/10/2026)**: Cloudflare Pages, proyecto `calibrario`, conectado al repositorio privado `josemcastrodev/calibrario` (rama `main`). Cada `git push` publica solo en unos 30 segundos. Orden `npm run build`, carpeta `dist`, Node 24 (`.node-version`). Dominios: calibrario.com, y www.calibrario.com redirige con 301 a la dirección sin www (regla «Redirect from WWW to root» de la zona). `public/_headers` pone `noindex` en calibrario.pages.dev. Si GitHub tiene incidencias y no avisa a Cloudflare, se publica a mano con el deploy hook guardado en `.env` (`CF_DEPLOY_HOOK`, no se sube): `curl -X POST <esa dirección>`.

Las maquetas de diseño anteriores siguen en `design/` como historial; no forman parte de la web.
