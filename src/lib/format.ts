// Utilidades sin idioma: slugs y nombre del reloj.
import type { Reloj } from '../content.config';

export const name = (r: Pick<Reloj, 'brand' | 'model'>) => `${r.brand} ${r.model}`;
export const slugify = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export const shortSlug = (r: Pick<Reloj, 'brand' | 'model'>) => slugify(name(r));
export const mid = (r: Pick<Reloj, 'priceRange'>) => (r.priceRange[0] + r.priceRange[1]) / 2;
