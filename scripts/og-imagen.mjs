// Genera public/og-calibrario.jpg (1200×630): la imagen que muestran Google, WhatsApp o LinkedIn al compartir
// una página que no tiene foto propia. Foto en blanco y negro, banda inferior y la marca, como en DESIGN.md.
// Uso: node scripts/og-imagen.mjs
import sharp from 'sharp';

const W = 1200, H = 630;
const foto = 'src/assets/fotos/watchmaking-skills.jpg';
const base = await sharp(foto).resize(W, H, { fit: 'cover', position: 'centre' }).grayscale().modulate({ brightness: 0.8 }).toBuffer();
const capa = Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0.45" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.78"/></linearGradient></defs>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
  <rect x="72" y="452" width="56" height="4" fill="#b5122b"/>
  <text x="72" y="530" font-family="Georgia, 'Times New Roman', serif" font-size="76" fill="#fff">Calibrario</text>
  <text x="74" y="578" font-family="Arial, Helvetica, sans-serif" font-size="26" fill="#e6e6e6" letter-spacing="0.5">Relojes automáticos de 90 a 1.500 €, comparados en cifras</text>
</svg>`);
await sharp(base).composite([{ input: capa }]).jpeg({ quality: 82, mozjpeg: true }).toFile('public/og-calibrario.jpg');
console.log('public/og-calibrario.jpg');
