// Marcas del catálogo. Una marca tiene página propia cuando hay al menos dos relojes suyos publicados.
// La frase de cada marca, en cada idioma, está en extra.ts (marcas).
import type { Reloj } from '../content.config';
import { slugify } from '../lib/format';

export type Marca = { slug: string; name: string; brands: string[]; origin: string };

export const MARCAS: Marca[] = [
  { slug: 'seiko', name: 'Seiko', brands: ['Seiko'], origin: 'Japón' },
  { slug: 'citizen', name: 'Citizen', brands: ['Citizen'], origin: 'Japón' },
  { slug: 'orient', name: 'Orient', brands: ['Orient', 'Orient Star'], origin: 'Japón' },
  { slug: 'tissot', name: 'Tissot', brands: ['Tissot'], origin: 'Suiza' },
  { slug: 'hamilton', name: 'Hamilton', brands: ['Hamilton'], origin: 'Suiza' },
  { slug: 'mido', name: 'Mido', brands: ['Mido'], origin: 'Suiza' },
  { slug: 'laco', name: 'Laco', brands: ['Laco'], origin: 'Alemania' },
  { slug: 'glycine', name: 'Glycine', brands: ['Glycine'], origin: 'Suiza' },
  { slug: 'timex', name: 'Timex', brands: ['Timex'], origin: 'EE. UU.' },
  { slug: 'invicta', name: 'Invicta', brands: ['Invicta'], origin: 'EE. UU.' },
  { slug: 'bulova', name: 'Bulova', brands: ['Bulova'], origin: 'EE. UU.' },
  { slug: 'vostok', name: 'Vostok', brands: ['Vostok'], origin: 'Rusia' },
  { slug: 'swatch', name: 'Swatch', brands: ['Swatch'], origin: 'Suiza' },
  { slug: 'junghans', name: 'Junghans', brands: ['Junghans'], origin: 'Alemania' },
  { slug: 'frederique-constant', name: 'Frederique Constant', brands: ['Frederique Constant'], origin: 'Suiza' },
  { slug: 'alpina', name: 'Alpina', brands: ['Alpina'], origin: 'Suiza' },
  { slug: 'victorinox', name: 'Victorinox', brands: ['Victorinox'], origin: 'Suiza' },
];

export const relojesDe = (m: Marca, all: Reloj[]) => all.filter((r) => m.brands.includes(r.brand));
export const marcaDe = (r: Pick<Reloj, 'brand'>) => MARCAS.find((m) => m.brands.includes(r.brand)) ?? { slug: slugify(r.brand), name: r.brand, brands: [r.brand], origin: '' };
/** Mínimo de relojes para que una marca tenga página propia. */
export const MIN_MARCA = 2;
