// Fotografías de muestra con licencia Creative Commons (Wikimedia Commons, Flickr), hasta tener las oficiales
// (PA-API de Amazon o material de prensa). Cada una lleva su nota: qué muestra de verdad.
import type { ImageMetadata } from 'astro';
import creditos from '../data/creditos-fotos.json';
import type { Ctx } from '../i18n/types';

const files = import.meta.glob<{ default: ImageMetadata }>('../assets/fotos/*.jpg', { eager: true });
export function foto(file: string): ImageMetadata {
  const m = files[`../assets/fotos/${file}`];
  if (!m) throw new Error(`Falta la foto ${file}`);
  return m.default;
}

/** `key`: clave de traducción cuando el mismo archivo se usa con otro texto (foto del modelo frente a foto de ambiente). */
export type Foto = { file: string; alt: string; note: string; pos?: string; key?: string };

/** Foto por reloj. `note` dice qué modelo aparece realmente, porque varias son de un modelo parecido. */
export const FOTO_RELOJ: Record<string, Foto> = {
  'invicta-pro-diver-8926ob': { file: 'invicta-mens-automatic-pro-diver-watch-8926-2.jpg', alt: 'Invicta Pro Diver 8926 sobre fondo liso', note: 'El modelo exacto' },
  'orient-bambino-v2-fac00009w0': { file: 'orient-watch-bambino-er24005w-29121883374.jpg', alt: 'Orient Bambino con correa de piel sobre una mesa de madera', note: 'Un Bambino de la generación anterior', pos: '50% 46%' },
  'orient-mako-iii-ra-aa0002l': { file: 'orient-new-mako-automatic-200m-diver-s.jpg', alt: 'Orient Mako de esfera negra con bisel giratorio', note: 'Un Mako de la generación anterior', pos: '45% 50%' },
  'seiko-5-sports-field-srpg27k1': { file: 'seiko-5.jpg', alt: 'Seiko 5 con correa de nailon', note: 'Otro Seiko 5 de estilo campo', pos: '50% 40%' },
  'seiko-5-sports-srpd55k1': { file: 'seiko-skx009k-divers-200.jpg', alt: 'Seiko SKX009 con bisel azul y rojo', note: 'Un SKX009, el antecesor del 5 Sports' },
  'citizen-promaster-diver-ny0120-01z': { file: 'citizen-promaster-eco-drive-ap0440-14f-diver.jpg', alt: 'Citizen Promaster Diver sobre correa de nailon', note: 'Un Promaster Eco-Drive, la versión de cuarzo' },
  'orient-kamasu-ra-aa0003r': { file: 'orient-blue-mako-cem65002d.jpg', alt: 'Orient Mako azul sobre fondo oscuro', note: 'Un Mako azul, con caja parecida a la del Kamasu', pos: '60% 50%' },
  'seiko-prospex-turtle-srpe99k1': { file: 'modern-monday-seiko-turtle-divewatch-srp.jpg', alt: 'Seiko Turtle en la muñeca', note: 'Un Turtle de otra referencia' },
  'seiko-5-sports-gmt-ssk033k1': { file: 'seiko-5-ssk003.jpg', alt: 'Seiko 5 Sports GMT en su caja', note: 'La variante SSK003, con bisel naranja y negro', pos: '50% 42%' },
  'laco-augsburg-39-861988': { file: 'laco-faro-b-muster-designed-after-beobachtungsuhr.jpg', alt: 'Laco Faro, reloj de aviador con esfera tipo B', note: 'Un Laco Faro, con la misma esfera tipo B' },
  'hamilton-khaki-field-auto-h70515137': { file: 'hamilton-khaki-field.jpg', alt: 'Hamilton Khaki Field sobre correa de nailon', note: 'Un Khaki Field de otra referencia', pos: '50% 40%' },
  'tissot-prx-powermatic-80-35': { file: 'tissot-watch-prx-collection-23-january-2025-2.jpg', alt: 'Tissot PRX en un expositor', note: 'Un PRX cronógrafo en un expositor', pos: '50% 40%' },
  'seiko-prospex-spb143j1': { file: 'seiko-prospex-spb143j1.jpg', key: 'seiko-prospex-spb143j1.jpg#modelo', alt: 'Seiko Prospex SPB143 en la muñeca', note: 'El modelo exacto', pos: '45% 55%' },
  'mido-ocean-star-200': { file: 'my-mido.jpg', alt: 'Mido de esfera azul sobre una mesa', note: 'Otro modelo de Mido', pos: '40% 50%' },
};

export const AMBIENTE = {
  prospex: { file: 'seiko-prospex-spb143j1.jpg', alt: 'Reloj de buceo Seiko en la muñeca', note: 'Un Seiko Prospex en la muñeca' },
  snzh: { file: 'seiko-5-sports-snzh53k1.jpg', alt: 'Esfera azul de un Seiko 5 Sports, de cerca', note: 'Un Seiko 5 Sports, de cerca' },
  zenith: { file: 'zenith-el-primero-automatic-chronograph-movement.jpg', alt: 'Calibre automático con el rotor y los rubíes a la vista', note: 'Un calibre automático por dentro' },
  rotor: { file: 'mechanics-movement-feinmechanik-wrist-watch-clock-automatic.jpg', alt: 'Fondo de un reloj automático con el rotor', note: 'El rotor de un automático' },
  movement: { file: 'standard-movement.jpg', alt: 'Calibre de un reloj, con los puentes y las ruedas', note: 'Un calibre mecánico' },
  longines: { file: 'longines-4-grand-prix-pocket-watch-clockwork.jpg', alt: 'Reloj de bolsillo abierto con la maquinaria a la vista, sobre blanco', note: 'Un mecanismo de bolsillo' },
  chrono1: { file: 'black-seiko-watch-close-up.jpg', alt: 'Esfera de un cronógrafo Seiko, de cerca', note: 'Una esfera de cerca' },
  chrono2: { file: 'black-seiko-watch-close-up-detail.jpg', alt: 'Detalle de la esfera de un cronógrafo', note: 'Detalle de una esfera' },
  bench: { file: 'watchmaking-skills.jpg', alt: 'Manos de un relojero en el banco de trabajo', note: 'Un relojero trabajando' },
  invictaCut: { file: 'invicta-mens-automatic-pro-diver-watch-8926.jpg', alt: 'Invicta Pro Diver sobre fondo blanco', note: 'Invicta Pro Diver' },
  citizenCut: { file: 'citizen-promaster-eco-drive-ap0440-14f-diver.jpg', alt: 'Citizen Promaster sobre fondo blanco', note: 'Citizen Promaster' },
  monster: { file: 'seiko-skx781-orange-monster-diver-watch-2026.jpg', alt: 'Seiko Orange Monster', note: 'Un Seiko de buceo' },
  murph: { file: 'hamilton-khaki-field-murph-38mm.jpg', alt: 'Hamilton Khaki Field Murph en su caja', note: 'Un Hamilton Khaki Field' },
  prospex2: { file: 'seiko-prospex-2026-08-07-philippines.jpg', alt: 'Seiko Prospex de buceo con brazalete', note: 'Un Seiko Prospex' },
  laco2: { file: 'laco-faro-b-muster-beobachtungsuhr-fliegeruhr-pilotenuhr.jpg', alt: 'Reloj de aviador Laco con esfera tipo B', note: 'Un reloj de aviador' },
} satisfies Record<string, Foto>;

/** Texto alternativo y nota de una foto en el idioma de la página (el español está aquí mismo). */
export function txt(f: Foto, c: Ctx) {
  const t = c.d.photo[f.key ?? f.file];
  return { alt: t?.alt ?? f.alt, note: t?.note ?? f.note };
}

/** Foto a sangre de cabecera según el estilo del reloj. */
export const HERO_ESTILO: Record<string, keyof typeof AMBIENTE> = {
  Buceo: 'prospex',
  Vestir: 'zenith',
  Campo: 'murph',
  Deportivo: 'snzh',
  Piloto: 'laco2',
};

/** Créditos de cada foto, leídos del registro de descargas. */
type Credito = { file: string; title: string; creator?: string | null; license: string; licenseUrl: string; page: string; via?: string };
const porBase = new Map<string, Credito>();
for (const c of creditos as Credito[]) porBase.set(c.file.split('/').pop()!.replace(/\.[a-z]+$/i, ''), c);
export function credito(file: string) {
  return porBase.get(file.replace(/\.[a-z]+$/i, ''));
}
export function creditosUsados() {
  const usados = new Set([...Object.values(FOTO_RELOJ), ...Object.values(AMBIENTE)].map((f) => f.file));
  return [...usados].map((f) => ({ file: f, c: credito(f) })).filter((x) => x.c);
}
