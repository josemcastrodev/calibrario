// Datos estructurados JSON-LD. Product sin precio (Amazon no permite mostrar precios que no vengan de su API).
import type { Reloj } from '../content.config';
import type { Ctx } from '../i18n/types';
import { HREFLANG } from '../i18n/langs';

export const SITE = 'https://calibrario.com';
export const abs = (path: string) => new URL(path, SITE).href;

/** Resumen del reloj en el idioma de la página (en español, el de relojes.json). */
export const resumenDe = (r: Reloj, c: Ctx) => c.d.resumen[r.id] ?? r.summary;

export function breadcrumbLd(items: [string, string][]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map(([n, url], i) => ({ '@type': 'ListItem', position: i + 1, name: n, item: abs(url) })),
  };
}

export function productLd(r: Reloj, c: Ctx, image?: string) {
  const l = c.d.labels;
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: c.name(r),
    brand: { '@type': 'Brand', name: r.brand },
    model: r.ref,
    sku: r.ref,
    description: resumenDe(r, c),
    ...(image ? { image: abs(image) } : {}),
    additionalProperty: [
      [l.calibre, r.caliber],
      [l.reserva, c.f.h(r.reserveHours)],
      [l.frecuencia, c.f.bph(r.bph)],
      [l.cristal, c.tr('crystal', r.crystal)],
      [l.hermeticidad, c.f.m(r.waterResistanceM)],
      [l.diametro, c.f.mm(r.diameterMm)],
    ].map(([n, v]) => ({ '@type': 'PropertyValue', name: n, value: v })),
  };
}

export function faqLd(faqs: [string, string][]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a.replace(/\[\[[^|\]]+\|([^\]]+)\]\]/g, '$1') } })),
  };
}

export function itemListLd(list: Reloj[], url: (r: Reloj) => string, c: Ctx) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: list.map((r, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name(r), url: abs(url(r)) })),
  };
}

export function articleLd(headline: string, description: string, path: string, c: Ctx) {
  return { '@context': 'https://schema.org', '@type': 'Article', headline, description, inLanguage: HREFLANG[c.lang], mainEntityOfPage: abs(path), author: { '@type': 'Organization', name: 'Calibrario' }, publisher: { '@type': 'Organization', name: 'Calibrario' } };
}
