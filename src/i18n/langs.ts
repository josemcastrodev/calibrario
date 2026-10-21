// Idiomas de la web. El español va sin prefijo; el resto, con /en/, /de/, /fr/, /it/.
// Cubren siete de las diez tiendas de Amazon Global Earning (EE. UU., Canadá, Reino Unido, Alemania,
// Francia, Italia y España). Los visitantes de Países Bajos, Polonia y Suecia ven la versión inglesa.
export const LANGS = ['es', 'en', 'de', 'fr', 'it'] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = 'es';
export const LOCALE: Record<Lang, string> = { es: 'es-ES', en: 'en-GB', de: 'de-DE', fr: 'fr-FR', it: 'it-IT' };
export const OG_LOCALE: Record<Lang, string> = { es: 'es_ES', en: 'en_GB', de: 'de_DE', fr: 'fr_FR', it: 'it_IT' };
export const HREFLANG: Record<Lang, string> = { es: 'es', en: 'en', de: 'de', fr: 'fr', it: 'it' };
export const LANG_NAME: Record<Lang, string> = { es: 'Español', en: 'English', de: 'Deutsch', fr: 'Français', it: 'Italiano' };
export const prefix = (l: Lang) => (l === DEFAULT_LANG ? '' : `/${l}`);
