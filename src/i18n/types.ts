// Estructura común de los diccionarios de idioma. Todos los idiomas rellenan lo mismo; si falta un
// término de los datos (correa, esfera, bisel…), se muestra el valor original en español.
import type { Reloj } from '../content.config';
import type { Fmt } from './fmt';
import type { Lang } from './langs';
import type { uiEs } from './ui-es';

/** Bloques de texto de guías y páginas. Dentro del texto: [[clave|texto]] es un enlace interno
 *  (solo se pinta si la página existe), **negrita** y *cursiva*. */
export type Block =
  | { h2: string; id?: string }
  | { h3: string }
  | { p: string }
  | { ul: string[] }
  | { ol: string[] }
  | { table: 'tramos' | 'reserva' | 'cristales' | 'munecas' | 'hermeticidad' | 'frecuencia' | 'gmt' | 'pilotos' }
  | { gen: 'sinParada' | 'reserva70' }
  | { note: string };

export type Seg = 'relojes' | 'comparar' | 'calibres' | 'guias' | 'asistente' | 'glosario' | 'metodo' | 'contacto' | 'creditos' | 'afiliado' | 'privacidad' | 'cookies' | 'legal' | 'marcas';
export type PageKey = 'asistente' | 'metodo' | 'contacto' | 'creditos' | 'afiliado' | 'privacidad' | 'cookies' | 'legal';
export type GuiaKey = 'elegir' | 'reserva' | 'cristal' | 'muneca' | 'hermeticidad' | 'parada' | 'frecuencia'
  | 'funcionamiento' | 'parado' | 'ajustar' | 'precision' | 'gmt' | 'aviador' | 'cuidados';
export type ListadoKey =
  | 'buceo' | 'vestir' | 'campo' | 'deportivo' | 'piloto' | 'menos300' | 'menos500' | 'menos1000' | 'zafiro600' | 'zafiro'
  | 'mm38' | 'mm40' | 'grandes' | 'reserva70' | 'wr200' | 'suizos' | 'japoneses'
  | 'menos200' | 'menos400' | 'menos800' | 'calidadPrecio' | 'gmt' | 'alemanes' | 'finos' | 'fondoVisto' | 'buceoBaratos' | 'vestirBaratos' | 'suizosBaratos' | 'brazalete' | 'piel';
export type CalibreKey = 'powermatic-80' | 'seiko-4r' | 'nh35' | 'seiko-6r35' | 'orient-f6' | 'citizen-82' | 'citizen-0950' | 'miyota-821' | 'sellita-sw200'
  | 'seiko-7s26' | 'citizen-90' | 'eta-2892' | 'sistem51' | 'vostok-2416';

export type SpecKey =
  | 'gama' | 'estilo' | 'calibre' | 'fabricante' | 'reserva' | 'frecuencia' | 'parada' | 'carga' | 'cristal' | 'hermeticidad'
  | 'diametro' | 'grosor' | 'asas' | 'correaAncho' | 'bisel' | 'caja' | 'correa' | 'esfera' | 'complicaciones' | 'fondo' | 'origen';

export type Terms = {
  type: Record<string, string>;
  /** Estilo en plural para enlaces: «Deportivos», «Sports watches». */
  typePlural: Record<string, string>;
  crystal: Record<string, string>;
  /** Cristal dentro de una frase: «cristal de zafiro», «a sapphire crystal». */
  crystalPhrase: Record<string, string>;
  origin: Record<string, string>;
  /** «una marca de Japón» / «a Japanese brand». */
  originBrand: Record<string, string>;
  material: Record<string, string>;
  strap: Record<string, string>;
  color: Record<string, string>;
  complication: Record<string, string>;
  bezel: Record<string, string>;
  maker: Record<string, string>;
};

export type Ctx = {
  lang: Lang;
  f: Fmt;
  d: Dict;
  t: Dict['ui'];
  name: (r: Pick<Reloj, 'brand' | 'model'>) => string;
  tr: (group: keyof Terms, v: string | null | undefined) => string;
};
export type QA = [string, string];

export type PageText = { title: string; h1: string; description: string; lead?: string; body: Block[]; updated?: string };

type ListadoText = { slug: string; h1: string; title: string; description: string; criterio: string };
type GuiaText = { slug: string; h1: string; title: string; description: string; lead: string; body: Block[]; faqs: QA[] };

/** Lo que escribe cada archivo de idioma. Lo nuevo de la ampliación (extra.ts, guias-extra.ts) se mezcla en index.ts. */
export interface DictBase {
  lang: Lang;
  seg: Record<Seg, string>;
  ui: Record<keyof typeof uiEs, string>;
  terms: Terms;
  labels: Record<SpecKey, string>;
  groups: [string, SpecKey[]][];
  faqs: QA[];
  glosario: { id: string; t: string; d: string; guia?: string }[];
  /** Las familias añadidas con la ampliación del catálogo están en extra.ts; index.ts las mezcla. */
  calibres: Partial<Record<CalibreKey, { nombre: string; fabricante: string; resumen: string; texto: string[]; paraQuien: string }>>;
  listados: Partial<Record<ListadoKey, ListadoText>>;
  guias: Partial<Record<GuiaKey, GuiaText>>;
  pages: Record<PageKey, PageText>;
  /** Textos alternativos y notas de las fotos de muestra, por archivo. */
  photo: Record<string, { alt: string; note: string }>;
  /** Resumen de cada reloj (en español está en relojes.json). */
  resumen: Record<string, string>;
  gen: {
    homeLead: (n: number) => string;
    fichaTitle: (r: Reloj, c: Ctx) => string;
    fichaDescription: (r: Reloj, c: Ctx) => string;
    fichaBullets: (r: Reloj, c: Ctx) => string[];
    fichaFaqs: (r: Reloj, familia: string | null, c: Ctx) => QA[];
    versus: (a: Reloj, b: Reloj, c: Ctx) => { puntos: string[]; paraA: string[]; paraB: string[]; faqs: QA[] };
    eligeSi: (razones: string[]) => string;
    listado: (list: Reloj[], c: Ctx) => { intro: string; faqs: QA[] };
    calibreFaqs: (nombre: string, list: Reloj[], c: Ctx) => QA[];
    sinParada: (sin: Reloj[], sinCarga: Reloj[], total: number, link: (r: Reloj) => string) => string[];
    reserva70: (n: number, desde: string) => string;
    count: (n: number) => string;
    /** «Reloj 1», «Watch 1». */
    slot: (i: number) => string;
    /** «Todo sobre el 4R36», «All about the 4R36». */
    allAbout: (x: string) => string;
    /** «Elige el Turtle», «Choose the Turtle». */
    chooseThe: (x: string) => string;
    /** «Turtle frente a Kamasu». */
    pairLabel: (a: string, b: string) => string;
  };
}

/** El diccionario completo que usan las plantillas: todo lo de DictBase, ya mezclado y sin huecos. */
export type DictExtra = {
  calibres: Record<CalibreKey, { nombre: string; fabricante: string; resumen: string; texto: string[]; paraQuien: string }>;
  listados: Record<ListadoKey, ListadoText>;
  guias: Record<GuiaKey, GuiaText>;
  /** Una o dos frases sobre cada marca, por su slug. */
  marcas: Record<string, string>;
  genx: {
    brandIntro: (name: string, list: Reloj[], c: Ctx) => string;
    brandFaqs: (name: string, list: Reloj[], c: Ctx) => QA[];
  };
};
export type Dict = DictBase & DictExtra;
