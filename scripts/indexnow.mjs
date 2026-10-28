// Avisa a Bing (y al resto de buscadores de IndexNow: Yandex, Seznam, Naver) de las páginas publicadas.
// Lee el sitemap de la web en vivo, así que se lanza después de cada despliegue con cambios de contenido.
// Uso: node scripts/indexnow.mjs            → envía todas las URLs del sitemap
//      node scripts/indexnow.mjs URL [URL…] → envía solo esas
// La clave es pública por diseño: está en public/<clave>.txt para que el buscador compruebe que la web es nuestra.
const HOST = 'calibrario.com';
const KEY = '2aaab7dcc103763bcc1b85bf77f8681e';

let urls = process.argv.slice(2);
if (!urls.length) {
  const xml = await (await fetch(`https://${HOST}/sitemap.xml`)).text();
  urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}
const res = await fetch('https://www.bing.com/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: urls }),
});
// 200 o 202: recibido. 403: la clave no está publicada. 422: alguna URL no es del dominio.
console.log(`IndexNow: ${urls.length} URLs → HTTP ${res.status} ${await res.text()}`);
