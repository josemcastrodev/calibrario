// Dibujo técnico a escala (alzado con Ø y entre asas, perfil con grosor) y aros comparados.
// Es un dato, no una ilustración: se dibuja con las medidas reales de la ficha.
import type { Reloj } from '../content.config';
import type { Ctx } from '../i18n/types';
import { fill } from '../i18n';

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!));

type Opts = { s?: number; ink?: string; label?: boolean; id?: string; view?: 'both' | 'front' | 'side'; dims?: string[]; hands?: boolean; frame?: number };

export function drawing(r: Reloj, c: Ctx, { s = 4.2, ink = 'currentColor', label = true, id = r.id, view = 'both', dims = ['D', 'L', 'T'], hands = true, frame = 0 }: Opts = {}) {
  const dec = c.f.dec;
  const D = r.diameterMm, T = r.thicknessMm ?? 12, L = r.lugToLugMm ?? D + 5, W = r.lugWidthMm ?? Math.round(D * 0.5);
  const R = (D / 2) * s, hl = (L / 2) * s, hw = (W / 2) * s;
  const front = view !== 'side', side = view !== 'front';
  const F = frame ? frame * s : 0;
  const cx = F ? F / 2 : front ? R + (dims.includes('L') ? 46 : 14) : 0, cy = F ? F / 2 : hl + 26;
  const sideX = front ? cx + R + 110 : 24, sideW = T * s;
  const width = F || (side ? sideX + sideW + 40 : cx + R + 20), height = F || cy + hl + (dims.length ? 54 : 20);
  const tick = (x: number, y: number, dx: number, dy: number) => `<line x1="${x - dx}" y1="${y - dy}" x2="${x + dx}" y2="${y + dy}"/>`;
  const txt = (x: number, y: number, t: string, rot = 0) => (label ? `<text x="${x}" y="${y}" text-anchor="middle" transform="rotate(${rot} ${x} ${y})" stroke="none">${t}</text>` : '');
  const lugs = `<path d="M${cx - hw} ${cy - hl} h${2 * hw} v${hl - R * 0.78} h-${2 * hw} z M${cx - hw} ${cy + hl} h${2 * hw} v-${hl - R * 0.78} h-${2 * hw} z" fill="none"/>`;
  const crown = `<rect x="${cx + R - 1}" y="${cy - 2.2 * s}" width="${2.4 * s}" height="${4.4 * s}" rx="1.5" fill="none"/>`;
  const bezel = r.rotatingBezel
    ? `<circle cx="${cx}" cy="${cy}" r="${R * 0.84}" fill="none"/>` +
      Array.from({ length: 60 }, (_, i) => {
        const a = (i * 6 * Math.PI) / 180, len = i % 5 === 0 ? R * 0.09 : R * 0.045;
        return `<line x1="${(cx + Math.sin(a) * (R - 1.5)).toFixed(1)}" y1="${(cy - Math.cos(a) * (R - 1.5)).toFixed(1)}" x2="${(cx + Math.sin(a) * (R - 1.5 - len)).toFixed(1)}" y2="${(cy - Math.cos(a) * (R - 1.5 - len)).toFixed(1)}"/>`;
      }).join('')
    : `<circle cx="${cx}" cy="${cy}" r="${R * 0.9}" fill="none"/>`;
  const indices = Array.from({ length: 12 }, (_, i) => {
    const a = (i * 30 * Math.PI) / 180, ri = R * (r.rotatingBezel ? 0.76 : 0.82), len = i % 3 === 0 ? R * 0.12 : R * 0.08;
    return `<line x1="${(cx + Math.sin(a) * ri).toFixed(1)}" y1="${(cy - Math.cos(a) * ri).toFixed(1)}" x2="${(cx + Math.sin(a) * (ri - len)).toFixed(1)}" y2="${(cy - Math.cos(a) * (ri - len)).toFixed(1)}" stroke-width="2"/>`;
  }).join('');
  const handsSvg = hands ? `<line x1="${cx}" y1="${cy}" x2="${cx + R * 0.38}" y2="${cy - R * 0.38}" stroke-width="2.4"/><line x1="${cx}" y1="${cy}" x2="${cx - R * 0.22}" y2="${cy - R * 0.5}" stroke-width="2.4"/>` : '';
  const dy = cy + hl + 22;
  const dimD = `<line x1="${cx - R}" y1="${dy}" x2="${cx + R}" y2="${dy}"/>${tick(cx - R, dy, 0, 5)}${tick(cx + R, dy, 0, 5)}${txt(cx, dy + 16, `Ø ${dec(D)} mm`)}`;
  const dx = cx - R - 28;
  const dimL = `<line x1="${dx}" y1="${cy - hl}" x2="${dx}" y2="${cy + hl}"/>${tick(dx, cy - hl, 5, 0)}${tick(dx, cy + hl, 5, 0)}${txt(dx - 10, cy, fill(c.t.drawLug, { l: dec(L) }), -90)}`;
  const top = cy - R;
  const prof = `<rect x="${sideX}" y="${top}" width="${sideW}" height="${2 * R}" rx="2" fill="none"/><path d="M${sideX + sideW} ${top + R * 0.1} q${T * s * 0.18} ${R * 0.9} 0 ${R * 1.8}" fill="none"/><rect x="${sideX + sideW}" y="${cy - 2.2 * s}" width="${2.2 * s}" height="${4.4 * s}" fill="none"/>`;
  const dimT = `<line x1="${sideX}" y1="${dy}" x2="${sideX + sideW}" y2="${dy}"/>${tick(sideX, dy, 0, 5)}${tick(sideX + sideW, dy, 0, 5)}${txt(sideX + sideW / 2, dy + 16, `${dec(T)} mm`)}`;
  const parts = [
    front ? `<circle cx="${cx}" cy="${cy}" r="${R}" fill="none"/>${bezel}${indices}${handsSvg}${lugs}${crown}` : '',
    front && dims.includes('D') ? dimD : '',
    front && dims.includes('L') ? dimL : '',
    side ? prof : '',
    side && dims.includes('T') ? dimT : '',
  ].join('');
  const title = esc(fill(c.t.drawTitle, { x: c.name(r), d: dec(D), l: dec(L), t: dec(T) }));
  return `<svg class="drawing" viewBox="0 0 ${Math.ceil(width)} ${Math.ceil(height)}" width="${Math.ceil(width)}" height="${Math.ceil(height)}" role="img" aria-labelledby="${id}-t"><title id="${id}-t">${title}</title><g stroke="${ink}" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" font-size="13" fill="${ink}">${parts}</g></svg>`;
}

/** Los diámetros de varios relojes, uno junto a otro, con el mismo factor de escala. */
export function scaleRings(list: Reloj[], c: Ctx, { s = 3.6, ink = 'currentColor' } = {}) {
  const dec = c.f.dec;
  let x = 10;
  const maxR = (Math.max(...list.map((r) => r.diameterMm)) * s) / 2;
  const items = list.map((r) => {
    const R = (r.diameterMm * s) / 2, cx = x + R;
    x += 2 * R + 34;
    return `<g><circle cx="${cx}" cy="${maxR + 6}" r="${R}" fill="none" stroke="${ink}" stroke-width="1.6"/><circle cx="${cx}" cy="${maxR + 6}" r="${R * 0.86}" fill="none" stroke="${ink}" stroke-width="1" opacity=".5"/><text x="${cx}" y="${maxR * 2 + 34}" text-anchor="middle" font-size="13" fill="${ink}">${esc(r.model)}</text><text x="${cx}" y="${maxR * 2 + 52}" text-anchor="middle" font-size="13" fill="${ink}">${dec(r.diameterMm)} mm</text></g>`;
  });
  return `<svg class="rings" viewBox="0 0 ${Math.ceil(x)} ${Math.ceil(maxR * 2 + 62)}" width="${Math.ceil(x)}" height="${Math.ceil(maxR * 2 + 62)}" role="img" aria-label="${esc(c.t.ringsLabel)}: ${esc(list.map((r) => `${r.model} ${dec(r.diameterMm)} mm`).join(', '))}">${items.join('')}</svg>`;
}
