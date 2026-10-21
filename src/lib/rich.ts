// Texto enriquecido de los diccionarios: [[clave|texto]] es un enlace interno (solo si la página existe),
// **negrita** y *cursiva*. Todo lo demás se escapa.
import type { Lang } from '../i18n/langs';
import { href, existeEn } from './routes';

const esc = (s: string) => s.replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[ch]!);

export function inline(text: string, lang: Lang, avail: Set<string>) {
  return esc(text)
    .replace(/\[\[([^|\]]+)\|([^\]]+)\]\]/g, (_, key: string, label: string) => (existeEn(avail, key) ? `<a href="${href(lang, key)}">${label}</a>` : label))
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>');
}

/** Quita el marcado para textos planos (title, description, JSON-LD). */
export const plain = (text: string) => text.replace(/\[\[[^|\]]+\|([^\]]+)\]\]/g, '$1').replace(/\*\*?([^*]+)\*\*?/g, '$1');
