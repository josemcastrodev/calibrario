// Desplegables propios con el estilo de la web, en lugar de la lista nativa del sistema (que en Windows sale
// blanca con el elegido en azul). El <select> original se queda escondido y sincronizado: el resto de
// scripts y los formularios siguen leyendo su valor y escuchando su evento «change». Sin script, se ve
// el <select> normal.
//
// Teclado: Intro, espacio o flecha abajo abren; flechas mueven; Intro elige; Esc cierra; con muchas
// opciones aparece un buscador arriba.

const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
let uid = 0;
let openOne = null;

export function enhanceSelects(root = document, t = {}) {
  root.querySelectorAll('select:not([data-native]):not([data-dd])').forEach((sel) => build(sel, t));
}

function labelOf(sel) {
  if (sel.getAttribute('aria-label')) return sel.getAttribute('aria-label');
  const byFor = sel.id && document.querySelector(`label[for="${sel.id}"]`);
  if (byFor) return byFor.textContent.trim();
  const wrap = sel.closest('label');
  if (wrap) return [...wrap.childNodes].filter((n) => n !== sel && n.nodeType === 1 ? !n.matches('select,output,.dd') : n.nodeType === 3).map((n) => n.textContent).join(' ').replace(/\s+/g, ' ').trim();
  return '';
}

function build(sel, t) {
  sel.dataset.dd = '1';
  const id = `dd${++uid}`;
  const pick = !!sel.closest('.pickcol');
  const variant = pick ? 'dd-pick' : sel.closest('.redband') ? 'dd-light' : 'dd-ink';
  const opts = () => [...sel.options].filter((o) => !o.disabled && !o.hidden);
  const many = sel.options.length > 10;

  const box = document.createElement('div');
  box.className = `dd ${variant}`;
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'dd-btn';
  btn.setAttribute('aria-haspopup', 'listbox');
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-controls', `${id}-list`);
  const name = labelOf(sel);
  const pop = document.createElement('div');
  pop.className = 'dd-pop';
  pop.hidden = true;
  const q = many ? Object.assign(document.createElement('input'), { type: 'search', className: 'dd-q', placeholder: t.ddSearch || 'Buscar', autocomplete: 'off' }) : null;
  if (q) q.setAttribute('aria-label', t.ddSearch || 'Buscar');
  const list = document.createElement('ul');
  list.className = 'dd-list';
  list.id = `${id}-list`;
  list.setAttribute('role', 'listbox');
  list.tabIndex = -1;
  if (name) list.setAttribute('aria-label', name);
  const empty = document.createElement('p');
  empty.className = 'dd-empty';
  empty.textContent = t.ddNone || '—';
  empty.hidden = true;
  if (q) pop.append(q);
  pop.append(list, empty);

  let items = [];
  let active = -1;
  const render = () => {
    list.textContent = '';
    items = opts().map((o, i) => {
      const li = document.createElement('li');
      li.id = `${id}-o${i}`;
      li.setAttribute('role', 'option');
      li.dataset.v = o.value;
      li.textContent = o.textContent;
      li.setAttribute('aria-selected', String(o.selected && !sel.options[sel.selectedIndex]?.disabled));
      list.append(li);
      return li;
    });
  };
  const sync = () => {
    const o = sel.options[sel.selectedIndex];
    const placeholder = !o || o.disabled;
    const text = o ? o.textContent : '';
    if (!pick) {
      btn.textContent = text;
      btn.classList.toggle('is-ph', placeholder);
    }
    btn.setAttribute('aria-label', name ? `${name}: ${placeholder ? text : text}` : text);
    items.forEach((li) => li.setAttribute('aria-selected', String(li.dataset.v === sel.value && !placeholder)));
  };
  const visible = () => items.filter((li) => !li.hidden);
  const setActive = (li) => {
    items.forEach((x) => x.classList.remove('is-active'));
    if (!li) { active = -1; list.removeAttribute('aria-activedescendant'); return; }
    li.classList.add('is-active');
    active = items.indexOf(li);
    list.setAttribute('aria-activedescendant', li.id);
    const top = li.offsetTop, bottom = top + li.offsetHeight;
    if (top < list.scrollTop) list.scrollTop = top;
    else if (bottom > list.scrollTop + list.clientHeight) list.scrollTop = bottom - list.clientHeight;
  };
  const open = () => {
    if (openOne && openOne !== close) openOne();
    render();
    if (q) { q.value = ''; filter(''); }
    pop.hidden = false;
    box.classList.add('is-open');
    btn.setAttribute('aria-expanded', 'true');
    // Si no cabe a la derecha, el panel se alinea al borde derecho.
    pop.classList.remove('to-left');
    const r = pop.getBoundingClientRect();
    if (r.right > document.documentElement.clientWidth - 8) pop.classList.add('to-left');
    const cur = items.find((li) => li.dataset.v === sel.value) || visible()[0];
    setActive(cur);
    (q || list).focus({ preventScroll: true });
    openOne = close;
  };
  const close = (focusBtn = true) => {
    if (pop.hidden) return;
    pop.hidden = true;
    box.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
    if (openOne === close) openOne = null;
    if (focusBtn) btn.focus({ preventScroll: true });
  };
  const choose = (li) => {
    if (!li) return;
    if (sel.value !== li.dataset.v) {
      sel.value = li.dataset.v;
      sel.dispatchEvent(new Event('input', { bubbles: true }));
      sel.dispatchEvent(new Event('change', { bubbles: true }));
    }
    sync();
    close();
  };
  const filter = (text) => {
    const n = norm(text.trim());
    items.forEach((li) => (li.hidden = !!n && !norm(li.textContent).includes(n)));
    const v = visible();
    empty.hidden = v.length > 0;
    setActive(v[0]);
  };
  const move = (d) => {
    const v = visible();
    if (!v.length) return;
    const i = v.indexOf(items[active]);
    setActive(v[Math.max(0, Math.min(v.length - 1, i < 0 ? 0 : i + d))]);
  };
  const keys = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
    else if (e.key === 'Home' && e.target === list) { e.preventDefault(); setActive(visible()[0]); }
    else if (e.key === 'End' && e.target === list) { e.preventDefault(); const v = visible(); setActive(v[v.length - 1]); }
    else if (e.key === 'Enter' || (e.key === ' ' && e.target === list)) { e.preventDefault(); choose(items[active]); }
    else if (e.key === 'Escape') { e.preventDefault(); close(); }
    else if (e.key === 'Tab') close(false);
    else if (!q && e.key.length === 1) {
      // Sin buscador: saltar a la primera opción que empieza por esa letra.
      const hit = visible().find((li) => norm(li.textContent).startsWith(norm(e.key)));
      if (hit) setActive(hit);
    }
  };

  btn.addEventListener('click', () => (pop.hidden ? open() : close()));
  btn.addEventListener('keydown', (e) => { if (['ArrowDown', 'ArrowUp'].includes(e.key)) { e.preventDefault(); open(); } });
  list.addEventListener('keydown', keys);
  q?.addEventListener('keydown', keys);
  q?.addEventListener('input', () => filter(q.value));
  list.addEventListener('click', (e) => choose(e.target.closest('[role=option]')));
  list.addEventListener('mousemove', (e) => { const li = e.target.closest('[role=option]'); if (li && items.indexOf(li) !== active) setActive(li); });
  sel.addEventListener('change', sync);

  // El <select> sigue en el formulario, pero oculto y fuera del orden de tabulación.
  sel.tabIndex = -1;
  sel.setAttribute('aria-hidden', 'true');
  sel.classList.add('dd-src');
  if (pick) {
    btn.classList.add('dd-cover');
    sel.after(box);
    box.append(btn, pop);
  } else {
    sel.after(box);
    box.append(btn, pop);
  }
  // Si su <label> envolvía el select, que al pulsar la etiqueta se abra el desplegable.
  const wrapLabel = sel.closest('label');
  if (wrapLabel) wrapLabel.addEventListener('click', (e) => { if (!box.contains(e.target)) { e.preventDefault(); btn.focus(); } });
  render();
  sync();
}

document.addEventListener('click', (e) => {
  if (openOne && !e.target.closest('.dd')) openOne(false);
});
