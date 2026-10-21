// Acceso a los datos del catálogo y la lógica que comparten las páginas en todos los idiomas:
// qué se publica, ficha técnica, comparador, rivales y pares de comparativas.
import { getCollection } from 'astro:content';
import type { Reloj } from '../content.config';
import type { Ctx, SpecKey } from '../i18n/types';
import { low1, CRYSTAL_RANK } from '../i18n/shared';
import { mid, shortSlug } from './format';
import { affiliateUrl } from './amazon';

// CLAUDE.md: los relojes con verified:false no se publican. En desarrollo (astro dev) y en el modo
// «borrador» (astro build --mode borrador) se incluyen con noindex y un aviso visible para poder revisarlos.
export const INCLUIR_NO_VERIFICADOS = import.meta.env.DEV || import.meta.env.PUBLIC_INCLUIR_NO_VERIFICADOS === 'true';

let cache: Reloj[] | null = null;
export async function getRelojes(): Promise<Reloj[]> {
  if (cache) return cache;
  const all = (await getCollection('relojes')).map((e) => e.data as Reloj);
  cache = all.filter((r) => r.verified || INCLUIR_NO_VERIFICADOS).sort((a, b) => a.priceRange[0] - b.priceRange[0] || a.id.localeCompare(b.id));
  return cache;
}

export const TIPOS = ['Buceo', 'Vestir', 'Campo', 'Deportivo', 'Piloto'] as const;

/** Valor de cada dato de la ficha, ya traducido y con unidades. */
export function specValue(r: Reloj, k: SpecKey, c: Ctx): string {
  const { f, t, tr } = c;
  switch (k) {
    case 'gama': return f.price(r.priceRange);
    case 'estilo': return tr('type', r.type);
    case 'calibre': return r.caliber;
    case 'fabricante': return tr('maker', r.caliberMaker);
    case 'reserva': return f.h(r.reserveHours);
    case 'frecuencia': return f.bph(r.bph);
    case 'parada': return f.bool(r.hacking);
    case 'carga': return f.bool(r.handWinding);
    case 'cristal': return tr('crystal', r.crystal);
    case 'hermeticidad': return f.m(r.waterResistanceM);
    case 'diametro': return f.mm(r.diameterMm);
    case 'grosor': return f.mm(r.thicknessMm);
    case 'asas': return f.mm(r.lugToLugMm);
    case 'correaAncho': return r.lugWidthMm ? f.mm(r.lugWidthMm) : t.integrated;
    case 'bisel': return r.rotatingBezel ? `${f.bool(true)}${r.bezelNote ? `, ${low1(tr('bezel', r.bezelNote))}` : ''}` : r.bezelNote ? tr('bezel', r.bezelNote) : f.bool(false);
    case 'caja': return tr('material', r.caseMaterial);
    case 'correa': return tr('strap', r.strap);
    case 'esfera': return tr('color', r.dialColor);
    case 'complicaciones': return r.complications.length ? r.complications.map((x) => tr('complication', x)).join(', ') : t.timeOnly;
    case 'fondo': return r.exhibitionCaseback == null ? '—' : f.bool(r.exhibitionCaseback);
    case 'origen': return tr('origin', r.origin);
  }
}

type Row = { key: SpecKey; score?: (r: Reloj) => number | null; value?: (r: Reloj, c: Ctx) => string };
/** Filas del comparador. Las que tienen `score` marcan en rojo el mejor valor. */
export const COMPARE_ROWS: Row[] = [
  { key: 'gama', score: (r) => -r.priceRange[0] },
  { key: 'calibre' },
  { key: 'reserva', score: (r) => r.reserveHours },
  { key: 'frecuencia', score: (r) => r.bph },
  { key: 'cristal', score: (r) => CRYSTAL_RANK[r.crystal] || 0 },
  { key: 'hermeticidad', score: (r) => r.waterResistanceM },
  { key: 'diametro' },
  { key: 'grosor', score: (r) => (r.thicknessMm == null ? null : -r.thicknessMm) },
  { key: 'asas' },
  { key: 'parada', score: (r) => (r.hacking ? 1 : 0) },
  { key: 'carga', score: (r) => (r.handWinding ? 1 : 0) },
  { key: 'bisel', value: (r, c) => c.f.bool(r.rotatingBezel) },
  { key: 'correa' },
  { key: 'origen' },
];

/** Índices ganadores de una fila (ninguno si todos empatan). */
export function best(scores: (number | null)[]) {
  const ok = scores.filter((s): s is number => s != null);
  if (new Set(ok).size <= 1) return [];
  const max = Math.max(...ok);
  return scores.map((s, i) => (s === max ? i : -1)).filter((i) => i >= 0);
}

export function compare(list: Reloj[], c: Ctx) {
  return COMPARE_ROWS.map((row) => ({
    key: row.key,
    label: c.d.labels[row.key],
    values: list.map((r) => (row.value ? row.value(r, c) : specValue(r, row.key, c))),
    best: row.score ? best(list.map(row.score)) : [],
  }));
}

/** Los n relojes del mismo estilo con la gama más cercana. */
export function rivals(all: Reloj[], r: Reloj, n = 2) {
  return all
    .filter((o) => o.id !== r.id && o.type === r.type)
    .map((o) => ({ o, d: Math.abs(mid(o) - mid(r)) }))
    .sort((a, b) => a.d - b.d)
    .slice(0, n)
    .map((x) => x.o);
}

// --- comparativas A frente a B: mismo estilo y precio parecido (el más caro como mucho un 60 % por encima)
export type Par = { slug: string; a: Reloj; b: Reloj };
let paresCache: Par[] | null = null;
export function pares(all: Reloj[]): Par[] {
  if (paresCache && all === cache) return paresCache;
  const seen = new Set<string>();
  const out: Par[] = [];
  for (const r of all) {
    const near = all
      .filter((o) => o.id !== r.id && o.type === r.type && Math.max(mid(o), mid(r)) / Math.min(mid(o), mid(r)) <= 1.6)
      .sort((x, y) => Math.abs(mid(x) - mid(r)) - Math.abs(mid(y) - mid(r)))
      .slice(0, 3);
    for (const o of near) {
      const [a, b] = [r, o].sort((x, y) => mid(x) - mid(y) || x.id.localeCompare(y.id));
      const key = `${a.id}|${b.id}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({ slug: `${shortSlug(a)}-vs-${shortSlug(b)}`, a, b });
    }
  }
  if (all === cache) paresCache = out;
  return out;
}
export const paresDe = (todos: Par[], r: Reloj) => todos.filter((p) => p.a.id === r.id || p.b.id === r.id);

/** Datos que necesita el script de la página (asistente, comparador, ajuste de muñeca y filtros), ya traducidos. */
export function slim(all: Reloj[], c: Ctx, url: (r: Reloj) => string) {
  return all.map((r) => ({
    id: r.id, brand: r.brand, model: r.model, ref: r.ref, type: r.type, priceRange: r.priceRange, caliber: r.caliber,
    reserveHours: r.reserveHours, bph: r.bph, crystal: r.crystal, waterResistanceM: r.waterResistanceM,
    diameterMm: r.diameterMm, thicknessMm: r.thicknessMm, lugToLugMm: r.lugToLugMm, hacking: r.hacking,
    handWinding: r.handWinding, origin: r.origin, rotatingBezel: r.rotatingBezel,
    tCrystal: c.tr('crystal', r.crystal), tOrigin: c.tr('origin', r.origin), tStrap: c.tr('strap', r.strap),
    amazon: affiliateUrl(r), url: url(r),
  }));
}
