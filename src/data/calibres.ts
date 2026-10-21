// Familias de calibres del catálogo. Qué calibre pertenece a cada una; los textos están en el diccionario.
import type { CalibreKey } from '../i18n/types';

export type Familia = { slug: CalibreKey; match: (caliber: string) => boolean };

export const FAMILIAS: Familia[] = [
  { slug: 'powermatic-80', match: (c) => /Powermatic 80|^H-(10|30|40)$|^Caliber 80$/.test(c) },
  { slug: 'seiko-4r', match: (c) => /^4R3[4568]$/.test(c) },
  { slug: 'nh35', match: (c) => /^NH35/.test(c) },
  { slug: 'seiko-6r35', match: (c) => /^6R35$/.test(c) },
  { slug: 'orient-f6', match: (c) => /^F6/.test(c) },
  { slug: 'citizen-82', match: (c) => /^82(00|03|04|10)$/.test(c) },
  { slug: 'citizen-0950', match: (c) => /^0950$/.test(c) },
  { slug: 'miyota-821', match: (c) => /^Laco 21$|^Miyota 82/.test(c) },
  { slug: 'sellita-sw200', match: (c) => /SW200|^GL224$|^FC-303$|^AL-525$|^J800|^Laco 24$|2824|2836/.test(c) },
  { slug: 'eta-2892', match: (c) => /2892|^Mido 1192$/.test(c) },
  { slug: 'seiko-7s26', match: (c) => /^7S26$/.test(c) },
  { slug: 'citizen-90', match: (c) => /^905\d$/.test(c) },
  { slug: 'sistem51', match: (c) => /^Sistem51$/.test(c) },
  { slug: 'vostok-2416', match: (c) => /^2416/.test(c) },
];

export const familiaDe = (caliber: string) => FAMILIAS.find((f) => f.match(caliber));
