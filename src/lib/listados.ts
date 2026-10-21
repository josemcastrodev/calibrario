// Listados por filtro (SEO programático). Los textos y la dirección de cada uno están en el diccionario
// de cada idioma; aquí solo el criterio. Solo se publican si tienen al menos tres relojes.
import type { Reloj } from '../content.config';
import type { ListadoKey } from '../i18n/types';
import { mid } from './format';

export type Listado = { key: ListadoKey; filter: (r: Reloj) => boolean; orden?: (a: Reloj, b: Reloj) => number; limit?: number };

const porPrecio = (a: Reloj, b: Reloj) => a.priceRange[0] - b.priceRange[0];
const porReserva = (a: Reloj, b: Reloj) => b.reserveHours - a.reserveHours || porPrecio(a, b);
const porDiametro = (a: Reloj, b: Reloj) => a.diameterMm - b.diameterMm || porPrecio(a, b);
const porGrosor = (a: Reloj, b: Reloj) => (a.thicknessMm ?? 99) - (b.thicknessMm ?? 99) || porPrecio(a, b);

/** Puntos de un reloj según sus datos, para el listado de calidad-precio. La fórmula se explica en la página. */
export function puntos(r: Reloj) {
  const cristal = { Zafiro: 3, Hardlex: 1.5, Mineral: 1, Acrílico: 0.5 }[r.crystal] ?? 0;
  return cristal
    + (r.hacking ? 1 : 0) + (r.handWinding ? 0.5 : 0)
    + (r.reserveHours >= 70 ? 2 : r.reserveHours >= 50 ? 1 : 0)
    + (r.waterResistanceM >= 200 ? 1.5 : r.waterResistanceM >= 100 ? 1 : 0)
    + (r.bph >= 28800 ? 0.5 : 0) + (r.exhibitionCaseback ? 0.3 : 0);
}
/** Puntos por cada 100 € de gama orientativa media. */
export const valor = (r: Reloj) => puntos(r) / (mid(r) / 100);

export const LISTADOS: Listado[] = [
  { key: 'buceo', filter: (r) => r.type === 'Buceo' },
  { key: 'vestir', filter: (r) => r.type === 'Vestir' },
  { key: 'campo', filter: (r) => r.type === 'Campo' },
  { key: 'deportivo', filter: (r) => r.type === 'Deportivo' },
  { key: 'piloto', filter: (r) => r.type === 'Piloto' },
  { key: 'calidadPrecio', filter: () => true, orden: (a, b) => valor(b) - valor(a), limit: 12 },
  { key: 'menos200', filter: (r) => mid(r) <= 200 },
  { key: 'menos300', filter: (r) => mid(r) <= 300 },
  { key: 'menos400', filter: (r) => mid(r) <= 400 },
  { key: 'menos500', filter: (r) => mid(r) <= 500 },
  { key: 'menos800', filter: (r) => mid(r) <= 800 },
  { key: 'menos1000', filter: (r) => mid(r) <= 1000 },
  { key: 'buceoBaratos', filter: (r) => r.type === 'Buceo' && mid(r) <= 500 },
  { key: 'vestirBaratos', filter: (r) => r.type === 'Vestir' && mid(r) <= 500 },
  { key: 'zafiro600', filter: (r) => r.crystal === 'Zafiro' && mid(r) <= 600 },
  { key: 'zafiro', filter: (r) => r.crystal === 'Zafiro' },
  { key: 'mm38', filter: (r) => r.diameterMm <= 39.5, orden: porDiametro },
  { key: 'mm40', filter: (r) => r.diameterMm > 39.5 && r.diameterMm <= 41, orden: porDiametro },
  { key: 'grandes', filter: (r) => r.diameterMm >= 42, orden: porDiametro },
  { key: 'finos', filter: (r) => !!r.thicknessMm && r.thicknessMm <= 11, orden: porGrosor },
  { key: 'reserva70', filter: (r) => r.reserveHours >= 70, orden: porReserva },
  { key: 'wr200', filter: (r) => r.waterResistanceM >= 200 },
  { key: 'gmt', filter: (r) => r.complications.includes('GMT') },
  { key: 'fondoVisto', filter: (r) => r.exhibitionCaseback === true },
  { key: 'brazalete', filter: (r) => /^Acero|^Titanio/.test(r.strap) },
  { key: 'piel', filter: (r) => r.strap === 'Piel' },
  { key: 'suizos', filter: (r) => r.origin === 'Suiza' },
  { key: 'suizosBaratos', filter: (r) => r.origin === 'Suiza' && mid(r) <= 800 },
  { key: 'japoneses', filter: (r) => r.origin === 'Japón' },
  { key: 'alemanes', filter: (r) => r.origin === 'Alemania' },
];

export const aplicar = (l: Listado, all: Reloj[]) => {
  const list = all.filter(l.filter).sort(l.orden ?? porPrecio);
  return l.limit ? list.slice(0, l.limit) : list;
};
/** Estilo → listado, para los enlaces del pie y de las fichas. */
export const LISTADO_DE_ESTILO: Record<string, ListadoKey> = { Buceo: 'buceo', Vestir: 'vestir', Campo: 'campo', Deportivo: 'deportivo', Piloto: 'piloto' };
