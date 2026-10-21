// Comprueba que todos los enlaces internos de dist/ apuntan a una página o archivo que existe: node scripts/comprobar-enlaces.mjs dist
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
const root = process.argv[2];
const files = [];
const walk = (d) => { for (const f of readdirSync(d)) { const p = join(d, f); statSync(p).isDirectory() ? walk(p) : p.endsWith('.html') && files.push(p); } };
walk(root);
const bad = new Map(); let total = 0; const ids = new Map();
for (const f of files) {
  const html = readFileSync(f, 'utf8');
  for (const m of html.matchAll(/(?:href|src)="(\/[^"#?]*)/g)) {
    total++; const u = m[1];
    const p = join(root, u);
    const ok = existsSync(p) && (statSync(p).isFile() || existsSync(join(p, 'index.html')));
    if (!ok) bad.set(u, (bad.get(u) || new Set()).add(f.replace(root, '')));
  }
  const t = (html.match(/<title>([^<]*)<\/title>/) || [])[1]; ids.set(t, (ids.get(t) || 0) + 1);
}
console.log('pages', files.length, 'links', total, 'broken', bad.size);
for (const [u, s] of bad) console.log('  ', u, '←', [...s].slice(0, 3).join(', '));
const dup = [...ids].filter(([, n]) => n > 1); console.log('duplicate titles', dup.length, dup.slice(0, 5));
if (bad.size) process.exitCode = 1;
