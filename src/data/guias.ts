// Guías: claves comunes a todos los idiomas y la foto de cabecera de cada una. El texto está en el diccionario.
import type { GuiaKey } from '../i18n/types';
import type { AMBIENTE } from '../lib/photos';

export const GUIAS: { key: GuiaKey; hero: keyof typeof AMBIENTE }[] = [
  { key: 'elegir', hero: 'bench' },
  { key: 'reserva', hero: 'rotor' },
  { key: 'cristal', hero: 'chrono1' },
  { key: 'muneca', hero: 'prospex' },
  { key: 'hermeticidad', hero: 'prospex2' },
  { key: 'parada', hero: 'snzh' },
  { key: 'frecuencia', hero: 'zenith' },
  { key: 'funcionamiento', hero: 'movement' },
  { key: 'parado', hero: 'rotor' },
  { key: 'ajustar', hero: 'chrono2' },
  { key: 'precision', hero: 'bench' },
  { key: 'gmt', hero: 'snzh' },
  { key: 'aviador', hero: 'laco2' },
  { key: 'cuidados', hero: 'longines' },
];
