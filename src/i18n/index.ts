// Diccionarios disponibles y el «contexto» de idioma que reciben las plantillas.
import type { Ctx, Dict, DictBase, Terms } from './types';
import { LANGS, type Lang } from './langs';
import { makeFmt } from './fmt';
import { es } from './es';
import { en } from './en';
import { de } from './de';
import { fr } from './fr';
import { it } from './it';
import { EXTRA } from './extra';
import { EXTRA2 } from './extra2';
import { GUIAS_ES, GUIAS_EN } from './guias-es-en';
import { GUIAS_DE, GUIAS_FR, GUIAS_IT } from './guias-de-fr-it';

const GUIAS_X = { es: GUIAS_ES, en: GUIAS_EN, de: GUIAS_DE, fr: GUIAS_FR, it: GUIAS_IT };

// Cada diccionario se completa con la ampliación del catálogo (extra.ts: términos, familias y resúmenes),
// el SEO ampliado (extra2.ts: listados, marcas y textos de marca) y las guías nuevas.
function withExtra(d: DictBase): Dict {
  const x = EXTRA[d.lang], y = EXTRA2[d.lang];
  const terms = Object.fromEntries(Object.entries(d.terms).map(([k, v]) => [k, { ...v, ...(x.terms[k as keyof Terms] ?? {}) }])) as Terms;
  return {
    ...d, terms,
    calibres: { ...EXTRA.es.calibres, ...d.calibres, ...x.calibres },
    resumen: { ...d.resumen, ...x.resumen },
    listados: { ...d.listados, ...y.listados },
    guias: { ...d.guias, ...GUIAS_X[d.lang] },
    marcas: y.marcas,
    genx: y.genx,
  } as Dict;
}
export const DICTS: Partial<Record<Lang, Dict>> = Object.fromEntries([es, en, de, fr, it].map((d) => [d.lang, withExtra(d)]));
/** Idiomas con diccionario: se generan sus páginas, su selector y sus hreflang. */
export const LANGS_ON = LANGS.filter((l) => DICTS[l]);

const cache = new Map<Lang, Ctx>();
export function ctx(lang: Lang): Ctx {
  const hit = cache.get(lang);
  if (hit) return hit;
  const d = DICTS[lang] ?? DICTS.es!;
  const c: Ctx = {
    lang,
    f: makeFmt(lang),
    d,
    t: d.ui,
    name: (r) => `${r.brand} ${r.model}`,
    tr: (group: keyof Terms, v) => (v == null ? '' : d.terms[group][v] ?? v),
  };
  cache.set(lang, c);
  return c;
}

/** Rellena {x}, {a}… en un texto de la interfaz. */
export const fill = (s: string, vars: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));
