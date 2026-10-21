// Formato de cifras por idioma: 42,5 mm en España, Alemania, Francia e Italia; 42.5 mm en inglés.
import { LOCALE, type Lang } from './langs';

const nbsp = ' ';
export type Fmt = ReturnType<typeof makeFmt>;

export function makeFmt(lang: Lang) {
  const loc = LOCALE[lang];
  // useGrouping 'always': «1.020 €» también con cuatro cifras, como en el resto de textos.
  const int = (n: number) => Number(n).toLocaleString(loc, { useGrouping: 'always' } as Intl.NumberFormatOptions);
  const dec = (n: number | null | undefined) => (n == null ? '—' : Number(n).toLocaleString(loc, { minimumFractionDigits: 0, maximumFractionDigits: 1, useGrouping: 'always' } as Intl.NumberFormatOptions));
  const yes = { es: 'Sí', en: 'Yes', de: 'Ja', fr: 'Oui', it: 'Sì' }[lang];
  const no = { es: 'No', en: 'No', de: 'Nein', fr: 'Non', it: 'No' }[lang];
  const bph = { es: 'A/h', en: 'bph', de: 'A/h', fr: 'A/h', it: 'A/h' }[lang];
  return {
    int,
    dec,
    mm: (n: number | null | undefined) => (n == null ? '—' : `${dec(n)}${nbsp}mm`),
    m: (n: number) => `${int(n)}${nbsp}m`,
    h: (n: number) => `${int(n)}${nbsp}h`,
    bph: (n: number) => `${int(n)}${nbsp}${bph}`,
    bphUnit: bph,
    eur: (n: number) => (lang === 'en' ? `€${int(n)}` : `${int(n)}${nbsp}€`),
    price: ([a, b]: [number, number] | number[]) => (lang === 'en' ? `€${int(a)}–${int(b)}` : `${int(a)}–${int(b)}${nbsp}€`),
    bool: (b: boolean) => (b ? yes : no),
  };
}
