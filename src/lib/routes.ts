// Direcciones de la web en cada idioma. Cada página tiene una «clave» común a todos los idiomas
// (ficha:seiko-5-sports-srpd55k1, guia:reserva, listado:buceo…) y href() la convierte en la URL
// de ese idioma, con sus segmentos traducidos: /relojes/…, /en/watches/…, /de/uhren/…
import type { Seg } from '../i18n/types';
import type { Reloj } from '../content.config';
import { prefix, type Lang } from '../i18n/langs';
import { DICTS, LANGS_ON } from '../i18n';
import { getRelojes, pares } from './watches';
import { LISTADOS, aplicar } from './listados';
import { FAMILIAS } from '../data/calibres';
import { GUIAS } from '../data/guias';
import { MARCAS, MIN_MARCA, relojesDe } from '../data/marcas';

export const STATIC_KEYS = ['home', 'relojes', 'comparar', 'calibres', 'marcas', 'guias', 'asistente', 'glosario', 'metodo', 'contacto', 'creditos', 'afiliado', 'privacidad', 'cookies', 'legal'] as const;

export function href(lang: Lang, key: string): string {
  const [k, hash] = key.split('#');
  const d = DICTS[lang] ?? DICTS.es!;
  const i = k.indexOf(':');
  const t = i < 0 ? k : k.slice(0, i), id = i < 0 ? '' : k.slice(i + 1);
  let path: string;
  switch (t) {
    case 'home': path = '/'; break;
    case 'ficha': path = `/${d.seg.relojes}/${id}/`; break;
    case 'par': path = `/${d.seg.comparar}/${id}/`; break;
    case 'calibre': path = `/${d.seg.calibres}/${id}/`; break;
    case 'marca': path = `/${d.seg.marcas}/${id}/`; break;
    case 'guia': path = `/${d.seg.guias}/${d.guias[id as keyof typeof d.guias].slug}/`; break;
    case 'listado': path = `/${d.listados[id as keyof typeof d.listados].slug}/`; break;
    default: path = `/${d.seg[t as Seg]}/`;
  }
  return `${prefix(lang)}${path}${hash ? `#${hash}` : ''}`;
}

export const fichaKey = (r: Pick<Reloj, 'id'>) => `ficha:${r.id}`;
/** Función de URL de ficha para un idioma, para pasarla a listas y JSON-LD. */
export const fichaHref = (lang: Lang) => (r: Pick<Reloj, 'id'>) => href(lang, fichaKey(r));

let keysCache: string[] | null = null;
/** Todas las páginas de esta compilación (las mismas en todos los idiomas). */
export async function allKeys(): Promise<string[]> {
  if (keysCache) return keysCache;
  const all = await getRelojes();
  keysCache = [
    ...STATIC_KEYS,
    ...all.map(fichaKey),
    ...pares(all).map((p) => `par:${p.slug}`),
    ...FAMILIAS.filter((f) => all.some((r) => f.match(r.caliber))).map((f) => `calibre:${f.slug}`),
    ...MARCAS.filter((m) => relojesDe(m, all).length >= MIN_MARCA).map((m) => `marca:${m.slug}`),
    ...GUIAS.map((g) => `guia:${g.key}`),
    ...LISTADOS.filter((l) => aplicar(l, all).length >= 3).map((l) => `listado:${l.key}`),
  ];
  return keysCache;
}

let setCache: Set<string> | null = null;
/** Las fichas, comparativas, calibres y listados dependen de los relojes publicados: esto evita enlaces rotos. */
export async function disponibles() {
  setCache ??= new Set(await allKeys());
  return setCache;
}
export const existeEn = (set: Set<string>, key: string) => set.has(key.split('#')[0]);

/** ¿Va al sitemap? Las páginas con algún reloj sin verificar llevan noindex y se quedan fuera. */
export async function indexable(key: string) {
  const all = await getRelojes();
  const ok = (list: Reloj[]) => list.length > 0 && list.every((r) => r.verified);
  const i = key.indexOf(':');
  const t = i < 0 ? key : key.slice(0, i), id = i < 0 ? '' : key.slice(i + 1);
  if (t === 'ficha') return ok(all.filter((r) => r.id === id));
  if (t === 'par') { const p = pares(all).find((x) => x.slug === id); return !!p && ok([p.a, p.b]); }
  if (t === 'calibre') { const f = FAMILIAS.find((x) => x.slug === id)!; return ok(all.filter((r) => f.match(r.caliber))); }
  if (t === 'listado') { const l = LISTADOS.find((x) => x.key === id)!; return ok(aplicar(l, all)); }
  if (t === 'marca') { const m = MARCAS.find((x) => x.slug === id)!; return ok(relojesDe(m, all)); }
  return true;
}

/** La misma página en cada idioma, para hreflang y el selector de idioma. */
export const alternates = (key: string) => LANGS_ON.map((l) => [l, href(l, key)] as const);

/** Rutas de [...slug].astro: una por clave e idioma. Falla si dos páginas caen en la misma URL. */
export async function staticPaths() {
  const keys = await allKeys();
  const seen = new Map<string, string>();
  const out: { params: { slug: string | undefined }; props: { lang: Lang; key: string } }[] = [];
  for (const lang of LANGS_ON) {
    for (const key of keys) {
      const path = href(lang, key);
      if (seen.has(path)) throw new Error(`Dirección repetida ${path}: ${seen.get(path)} y ${key}`);
      seen.set(path, key);
      out.push({ params: { slug: path === '/' ? undefined : path.slice(1, -1) }, props: { lang, key } });
    }
  }
  return out;
}
