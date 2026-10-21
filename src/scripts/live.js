// Calibrario · interactividad de la web. Todo el contenido existe sin script; esto solo añade
// el asistente, el comparador, el ajuste de muñeca y los filtros del catálogo, en el idioma de la página.
import { enhanceSelects } from './dropdown.js';

const dataEl = document.getElementById('cal-data');
const CAL = dataEl ? JSON.parse(dataEl.textContent || '{}') : {};
const D = CAL.w || [];
const T = CAL.t || {};
const LOC = CAL.loc || 'es-ES';
const EN = CAL.lang === 'en';
const byId = Object.fromEntries(D.map((r) => [r.id, r]));
const num = (n, d = 0) => Number(n).toLocaleString(LOC, { minimumFractionDigits: 0, maximumFractionDigits: d, useGrouping: 'always' });
const nb = ' ';
const eur = (n) => (EN ? `€${num(n)}` : `${num(n)}${nb}€`);
const price = (r) => (EN ? `€${num(r.priceRange[0])}–${num(r.priceRange[1])}` : `${num(r.priceRange[0])}–${num(r.priceRange[1])}${nb}€`);
const mm = (n) => (n == null ? '—' : `${num(n, 1)}${nb}mm`);
const yn = (b) => (b ? T.yes : T.no);
const fullName = (r) => `${r.brand} ${r.model}`;
const mid = (r) => (r.priceRange[0] + r.priceRange[1]) / 2;
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const fill = (s, v) => String(s).replace(/\{(\w+)\}/g, (_, k) => (v[k] ?? ''));
// En alemán los sustantivos van con mayúscula: «Saphirglas».
const crystalLow = (r) => (r.crystal === 'Hardlex' || CAL.lang === 'de' ? r.tCrystal : r.tCrystal.toLowerCase());

// --- asistente: presupuesto, uso y muñeca → tres relojes
const USE = { diario: ['Deportivo', 'Vestir', 'Campo'], agua: ['Buceo'], vestir: ['Vestir'], campo: ['Campo', 'Piloto'] };
const BUDGET = { b1: [0, 300], b2: [300, 600], b3: [600, 1000], b4: [1000, 9999] };
const WRIST = { w1: [35, 40, 46.5], w2: [38, 42.5, 48.5], w3: [40, 46, 52] };
function recommend(budget, use, wrist) {
  const [lo, hi] = BUDGET[budget], types = USE[use], [dmin, dmax, lmax] = WRIST[wrist];
  return D.map((r) => {
    let s = 0;
    const m = mid(r);
    if (m >= lo && m <= hi) s += 4; else if (m >= lo * 0.85 && m <= hi * 1.15) s += 1.5; else s -= 6;
    s += types.indexOf(r.type) === 0 ? 3 : types.includes(r.type) ? 2 : -3;
    if (r.diameterMm >= dmin && r.diameterMm <= dmax) s += 2; else s -= 1.5;
    if (r.lugToLugMm && r.lugToLugMm <= lmax) s += 1; else if (r.lugToLugMm) s -= 2;
    if (r.crystal === 'Zafiro') s += 0.6;
    if (r.hacking) s += 0.4;
    if (r.reserveHours >= 70) s += 0.5;
    if (r.waterResistanceM >= 100) s += 0.4;
    s += ((m - lo) / Math.max(1, hi - lo)) * 0.3;
    return { r, s };
  }).sort((a, b) => b.s - a.s).slice(0, 3).map((x) => x.r);
}
document.querySelectorAll('[data-assistant]').forEach((form) => {
  const out = form.querySelector('[data-assistant-out]');
  const run = () => {
    const g = (n) => form.querySelector(`[name="${n}"]`)?.value;
    const b = g('presupuesto'), u = g('uso'), w = g('muneca');
    if (!b || !u || !w || !D.length) return;
    out.innerHTML = recommend(b, u, w).map((r) =>
      `<li class="pick"><span class="pick-n">${esc(fullName(r))}</span><span class="pick-f">${esc(r.caliber)}, ${num(r.reserveHours)}${nb}h, ${esc(crystalLow(r))}, ${num(r.waterResistanceM)}${nb}m, ${mm(r.diameterMm)}</span><span class="pick-p">${price(r)}</span><a class="pick-a" href="${r.url}">${esc(T.seeSheet)}</a></li>`).join('');
    out.hidden = false;
  };
  form.addEventListener('change', run);
  form.addEventListener('submit', (e) => { e.preventDefault(); run(); });
});

// --- comparador: el selector de cada columna está en su cabecera; al cambiarlo se rehacen las filas
// y el pie, el mejor dato de cada fila va en rojo y la selección queda en la URL.
const RANK = { Zafiro: 3, Hardlex: 2, Mineral: 1, Acrílico: 0 };
const ROWS = [
  ['gama', (r) => price(r), (r) => -r.priceRange[0]],
  ['calibre', (r) => esc(r.caliber)],
  ['reserva', (r) => `${num(r.reserveHours)}${nb}h`, (r) => r.reserveHours],
  ['frecuencia', (r) => `${num(r.bph)}${nb}${T.bph}`, (r) => r.bph],
  ['cristal', (r) => esc(r.tCrystal), (r) => RANK[r.crystal] || 0],
  ['hermeticidad', (r) => `${num(r.waterResistanceM)}${nb}m`, (r) => r.waterResistanceM],
  ['diametro', (r) => mm(r.diameterMm)],
  ['grosor', (r) => mm(r.thicknessMm), (r) => (r.thicknessMm == null ? null : -r.thicknessMm)],
  ['asas', (r) => mm(r.lugToLugMm)],
  ['parada', (r) => yn(r.hacking), (r) => (r.hacking ? 1 : 0)],
  ['carga', (r) => yn(r.handWinding), (r) => (r.handWinding ? 1 : 0)],
  ['bisel', (r) => yn(r.rotatingBezel)],
  ['correa', (r) => esc(r.tStrap)],
  ['origen', (r) => esc(r.tOrigin)],
];
const bestOf = (scores) => {
  const ok = scores.filter((s) => s != null);
  if (new Set(ok).size <= 1) return [];
  const m = Math.max(...ok);
  return scores.map((s, i) => (s === m ? i : -1)).filter((i) => i >= 0);
};
const bodyHTML = (list) => ROWS.map(([key, val, score]) => {
  const best = score ? bestOf(list.map(score)) : [];
  return `<tr><th scope="row">${esc(T.labels?.[key] ?? key)}</th>${list.map((r, i) => `<td${best.includes(i) ? ' class="best"' : ''}>${val(r)}</td>`).join('')}</tr>`;
}).join('');
const footHTML = (list) => `<tr><td></td>${list.map((r) => `<td><a class="btn" href="${r.amazon}" rel="sponsored noopener">${esc(T.buy)}</a><a class="link" href="${r.url}">${esc(T.seeSheet)}</a></td>`).join('')}</tr>`;
document.querySelectorAll('[data-compare]').forEach((box) => {
  const table = box.querySelector('[data-cmp-table]');
  if (!table) return;
  const selects = [...table.querySelectorAll('select[data-slot]')];
  const body = table.querySelector('[data-cmp-body]'), foot = table.querySelector('[data-cmp-foot]');
  const syncUrl = box.hasAttribute('data-compare-url');
  const render = () => {
    const list = selects.map((s) => byId[s.value]).filter(Boolean);
    if (list.length < 2) return;
    selects.forEach((s) => { const nm = s.closest('th')?.querySelector('[data-nm]'); const r = byId[s.value]; if (nm && r) nm.textContent = fullName(r); });
    body.innerHTML = bodyHTML(list);
    if (foot) foot.innerHTML = footHTML(list);
    if (syncUrl) {
      const q = new URLSearchParams(); list.forEach((r, i) => q.set('abc'[i], r.id));
      history.replaceState(null, '', `${location.pathname}?${q}`);
    }
  };
  if (syncUrl) {
    const p = new URLSearchParams(location.search);
    let changed = false;
    ['a', 'b', 'c'].forEach((k, i) => { const v = p.get(k); if (v && byId[v] && selects[i]) { selects[i].value = v; changed = true; } });
    if (changed) render();
  }
  selects.forEach((s) => s.addEventListener('change', render));
});

// --- ajuste de muñeca: ancho ≈ 0,33 × contorno; el entre asas no debe superarlo
document.querySelectorAll('[data-fit]').forEach((box) => {
  const input = box.querySelector('input[type=range]'), out = box.querySelector('[data-fit-out]'), bar = box.querySelector('[data-fit-bar]');
  const pick = box.querySelector('select[data-fit-pick]');
  let r = byId[box.dataset.fit];
  if (!input || !out) return;
  const run = () => {
    if (pick) {
      r = byId[pick.value];
      box.querySelectorAll('[data-fit-drawing]').forEach((el) => (el.hidden = el.dataset.fitDrawing !== pick.value));
    }
    if (!r) return;
    const cm = Number(input.value), width = cm * 10 * 0.33;
    box.querySelectorAll('[data-fit-cm]').forEach((el) => (el.textContent = num(cm, 1)));
    if (!r.lugToLugMm) { out.textContent = T.fitNoData; return; }
    const pct = Math.round((r.lugToLugMm / width) * 100);
    const verdict = T.v[pct <= 82 ? 0 : pct <= 95 ? 1 : pct <= 105 ? 2 : 3];
    out.innerHTML = fill(T.fitOut, { cm: num(cm, 1), w: num(width), lug: num(r.lugToLugMm, 1), model: esc(r.model), pct: `${num(pct)}${nb}%`, verdict });
    if (bar) bar.style.setProperty('--pct', Math.min(120, pct) + '%');
    box.dataset.verdict = pct <= 95 ? 'ok' : pct <= 105 ? 'just' : 'no';
  };
  input.addEventListener('input', run);
  pick?.addEventListener('change', run);
  run();
});

// --- filtros del catálogo (con lectura de ?estilo=, ?origen= y ?q= en la URL)
document.querySelectorAll('[data-catalog]').forEach((cat) => {
  const grid = cat.querySelector('[data-grid]'), form = cat.querySelector('form'), count = cat.querySelector('[data-count]'), empty = cat.querySelector('[data-empty]');
  if (!form || !grid) return;
  const items = [...grid.querySelectorAll('[data-item]')];
  const p = new URLSearchParams(location.search);
  for (const [k, v] of p) { const el = form.elements.namedItem(k); if (el && 'value' in el) { if (el.type === 'checkbox') el.checked = v === '1'; else el.value = v; } }
  const DIAM = { s: [0, 39.5], m: [39.6, 41], l: [41.1, 99] };
  const SORT = { precio: (a, b) => a.priceRange[0] - b.priceRange[0], reserva: (a, b) => b.reserveHours - a.reserveHours, diametro: (a, b) => a.diameterMm - b.diameterMm, hermeticidad: (a, b) => b.waterResistanceM - a.waterResistanceM };
  const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const run = () => {
    const f = new FormData(form);
    const max = Number(f.get('max') || 9999), type = f.get('estilo') || '', diam = f.get('diametro') || '', origin = f.get('origen') || '';
    const zaf = f.has('zafiro'), wr = f.has('wr100'), hack = f.has('parada');
    const q = norm(String(f.get('q') || '').trim());
    let n = 0;
    items.forEach((el) => {
      const r = byId[el.dataset.item]; if (!r) return;
      const hay = norm(`${r.brand} ${r.model} ${r.ref} ${r.caliber}`);
      const [dlo, dhi] = DIAM[diam] || [0, 99];
      const show = r.priceRange[0] <= max && (!type || r.type === type) && (!origin || r.origin === origin) && r.diameterMm >= dlo && r.diameterMm <= dhi &&
        (!zaf || r.crystal === 'Zafiro') && (!wr || r.waterResistanceM >= 100) && (!hack || r.hacking) && (!q || hay.includes(q));
      el.hidden = !show; if (show) n++;
    });
    const sort = SORT[f.get('orden')] || SORT.precio;
    items.map((el) => [byId[el.dataset.item], el]).sort((a, b) => sort(a[0], b[0])).forEach(([, el]) => grid.appendChild(el));
    if (count) count.textContent = (n === 1 ? T.count[0] : T.count[1]).replace(/\d+/, String(n));
    if (empty) empty.hidden = n > 0;
    cat.querySelectorAll('[data-max-out]').forEach((el) => (el.textContent = max >= 1500 ? T.noLimit : eur(max)));
  };
  form.addEventListener('input', run);
  form.addEventListener('change', run);
  form.addEventListener('submit', (e) => e.preventDefault());
  run();
  if (location.hash === '#buscar') form.querySelector('input[type=search]')?.focus();
});

// --- desplegables propios: al final, cuando los demás scripts ya han puesto los valores de la URL
enhanceSelects(document, T);

// --- selector de idioma de la cabecera: se cierra al elegir fuera
document.addEventListener('click', (e) => {
  document.querySelectorAll('.lng details[open]').forEach((d) => { if (!d.contains(e.target)) d.removeAttribute('open'); });
});
