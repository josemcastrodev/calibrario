// Genera los favicons PNG e ICO a partir de public/favicon.svg: node scripts/favicons.mjs
import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'node:fs';
const svg = readFileSync('public/favicon.svg');
const png = (size) => sharp(svg, { density: 512 }).resize(size, size).png().toBuffer();
for (const [name, size] of [['apple-touch-icon.png', 180], ['icon-192.png', 192], ['icon-512.png', 512], ['favicon-32.png', 32]]) writeFileSync(`public/${name}`, await png(size));
// ICO con dos PNG incrustados (16 y 32 px)
const imgs = [await png(16), await png(32)];
const header = Buffer.alloc(6); header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(imgs.length, 4);
let offset = 6 + 16 * imgs.length;
const dir = imgs.map((b, i) => { const s = [16, 32][i]; const e = Buffer.alloc(16); e.writeUInt8(s, 0); e.writeUInt8(s, 1); e.writeUInt8(0, 2); e.writeUInt8(0, 3); e.writeUInt16LE(1, 4); e.writeUInt16LE(32, 6); e.writeUInt32LE(b.length, 8); e.writeUInt32LE(offset, 12); offset += b.length; return e; });
writeFileSync('public/favicon.ico', Buffer.concat([header, ...dir, ...imgs]));
writeFileSync('public/site.webmanifest', JSON.stringify({ name: 'Calibrario', short_name: 'Calibrario', icons: [{ src: '/icon-192.png', sizes: '192x192', type: 'image/png' }, { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }], theme_color: '#141414', background_color: '#ffffff', display: 'browser' }, null, 2));
console.log('favicons listos');
