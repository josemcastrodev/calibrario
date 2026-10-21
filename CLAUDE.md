# Calibrario — comparador de relojes automáticos

Contexto completo del proyecto para Claude Code. Léelo entero antes de escribir código.

## 0. Nombre y dominio

- **Marca: Calibrario.** El nombre juega con «calibre», el motor del reloj, y se entiende en español, francés e italiano.
- **Dominio: calibrario.com.** Está libre a 21/10/2026 y el dueño va a registrarlo. Si es posible, registrar también calibrario.es y redirigirlo al .com.

## 1. Qué es y cómo gana dinero

- Web comparadora de **relojes automáticos de 90 a 1.500 €**, en español primero y luego en alemán, francés e italiano.
- Se monetiza con el **Programa de Afiliados de Amazon EU** (Amazon.es). Cada ficha lleva un botón «Ver precio en Amazon» con la etiqueta de afiliado.
- Amazon.es paga **6 %** en la categoría Relojes (misma tarifa que moda y lujo; joyería 5 %, electrodomésticos 2,5 %). Verificado el 21/10/2026 en https://afiliados.amazon.es/help/node/topic/GRXPHT8U84RAYDXZ
- **Global Earning** (verificado el 21/10/2026 en https://www.amazon.es/b?node=219877691031): con una sola cuenta se cobran comisiones en 10 países: EE. UU., Canadá, Reino Unido, Alemania, Francia, Italia, España, Países Bajos, Polonia y Suecia. Los creadores de la UE quedan inscritos automáticamente, sin cambiar los enlaces. Un visitante de Alemania se redirige a Amazon.de (producto exacto; si no existe, uno similar o la búsqueda) y se cobra la **tarifa del país de compra**. Cada país paga por separado al alcanzar su umbral; EE. UU. y Canadá exigen rellenar datos fiscales adicionales. Por eso la web será multidioma.
- Cambios de Amazon del 14/04/2026 (verificados en el registro de cambios del Operating Agreement):
  - La regla de «comisión solo por el mismo ASIN» afecta a los enlaces **dentro de Amazon** (vídeos de creadores, listas, storefront), **no** a los enlaces externos de una web. Desde la web se sigue cobrando por todo lo que el cliente compre en la sesión de 24 horas (y hasta 90 días para lo que añada al carrito). Aun así, cada enlace debe apuntar al modelo concreto: es lo que espera el usuario y lo que mejor convierte.
  - El pedido debe pagarse y enviarse en 180 días para comisionar.
  - Las compras de visitantes que llegaron a Amazon desde **anuncios de pago** no comisionan.
  - El contenido debe aportar análisis, comentario o transformación propia (nuestras tablas y comparativas lo cumplen).
  - La cookie de sesión dura 24 horas.

## 2. Estrategia (decisiones ya tomadas con el dueño)

- **El dueño no va a hacer pruebas reales de los relojes.** No escribas nunca «lo hemos probado», «tras 3 meses de uso» ni nada que lo insinúe. El valor de la web son los **datos ordenados y comparables**, el asistente y las comparativas, no las reseñas.
- El SEO de afiliados en 2026 está muy castigado: las webs de afiliación genéricas han perdido de media el 85 % del tráfico desde 2022, y las AI Overviews resumen las listas tipo «los 10 mejores». Por eso la web se diferencia siendo una **herramienta**: filtros, comparador, calculadoras y fichas técnicas completas.
- **SEO programático**. Una sola base de datos de relojes genera cientos de páginas de cola larga:
  - Ficha por modelo: `/relojes/seiko-5-sports-srpd55/`
  - Comparativa A vs B: `/comparar/seiko-5-sports-vs-orient-kamasu/` (generar solo los pares con sentido: mismo estilo y precio parecido)
  - Listados por filtro: `/automaticos-con-zafiro-menos-de-400-euros/`, `/relojes-de-buceo-automaticos/`, `/relojes-automaticos-38-mm/`, `/relojes-con-calibre-powermatic-80/`
  - Páginas de calibre: `/calibres/seiko-4r36/` (qué es y qué relojes lo llevan)
  - Guías informativas: qué es la reserva de marcha, zafiro vs Hardlex, cómo medir la muñeca, etc.
- Cada página tiene que aportar algo real: tabla de datos, comparación calculada y texto que explique la diferencia. Nada de páginas vacías o duplicadas, porque Google las penaliza.

## 3. Stack

- **Astro** como generador de sitio estático (sin WordPress). Todo es HTML ligero y rápido.
- Datos en `src/data/relojes.json` (o colección de contenido de Astro con esquema Zod).
- i18n con rutas: `/` español, `/en/`, `/de/`, `/fr/`, `/it/`, con `hreflang` y direcciones traducidas. Desde el 21/10/2026 están los cinco idiomas activos (lo pidió el dueño). Las traducciones las genera Claude, pero deben revisarse antes de promocionarlas.
- Interactividad (asistente, filtros, comparador) en JavaScript ligero, como islas de Astro o vanilla JS. Sin frameworks pesados.
- Hosting en **Cloudflare Pages** (gratis), con despliegue desde GitHub.
- SEO técnico obligatorio:
  - `<title>` y meta description únicos
  - Datos estructurados JSON-LD (`Product` sin precio de Amazon, `BreadcrumbList`, `FAQPage` cuando aplique)
  - Sitemap y robots.txt
  - URLs canónicas
  - Core Web Vitals en verde

## 4. Reglas de Amazon que el código debe respetar

- **Precios.** Amazon no permite mostrar precios de Amazon que no vengan de su API (PA-API) actualizados. Hasta tener la API, muestra un **rango orientativo** («Gama: 250–300 €») o «Ver precio en Amazon», nunca «Precio en Amazon: 269 €».
- **Imágenes.** No uses fotos de Amazon sin la API. Mientras tanto, usa imágenes con licencia o material de prensa permitido (ver sección 6).
- **Acceso a la PA-API.** Llega cuando la cuenta tiene ventas. Deja preparada una capa `src/lib/amazon.ts` para conectarla después (precio, imagen y disponibilidad), con caché.
- **Enlaces.**
  - Formato `https://www.amazon.es/dp/{ASIN}?tag={AMAZON_TAG}`, con la etiqueta en una variable de entorno `AMAZON_TAG`.
  - Atributo `rel="sponsored noopener"` en todos los enlaces de afiliado.
  - Si aún no hay ASIN, usa la búsqueda `https://www.amazon.es/s?k={marca+referencia}&tag=...`.
- **Aviso de afiliado.** Debe ser visible en todas las páginas: «Calibrario participa en el Programa de Afiliados de Amazon EU…».
- No uses marcas registradas (Seiko, Rolex…) en el dominio ni en el logotipo.

## 5. Modelo de datos (un reloj)

```ts
{
  id: "seiko-5-sports-srpd55",   // slug
  brand: "Seiko",
  model: "5 Sports",
  ref: "SRPD55K1",
  asin: null,                     // rellenar cuando se verifique
  type: "Buceo" | "Vestir" | "Campo" | "Deportivo" | "Piloto",
  priceRange: [250, 300],         // € orientativo, NO precio de Amazon
  caliber: "4R36",
  reserveHours: 41,
  bph: 21600,
  crystal: "Zafiro" | "Hardlex" | "Mineral",
  waterResistanceM: 100,
  diameterMm: 42.5,
  thicknessMm: 13.4,
  lugToLugMm: null,
  hacking: true,                  // parada de segundero
  handWinding: true,              // carga manual
  origin: "Japón" | "Suiza" | "Alemania",
  rotatingBezel: true,
  images: [],                     // rutas o URLs con licencia
  summary: "Una frase de por qué elegirlo",
  verified: false                 // true cuando se hayan comprobado los datos con la web del fabricante
}
```

Lista inicial de 28 modelos, con datos orientativos sin verificar:

| Marca | Modelo | Ref. | Estilo | Calibre | Reserva | Cristal | WR | Ø mm | Gama € |
|---|---|---|---|---|---|---|---|---|---|
| Invicta | Pro Diver | 8926OB | Buceo | NH35A | 41 h | Mineral | 200 m | 40 | 90–110 |
| Orient | Bambino V2 | FAC00005W0 | Vestir | F6724 | 40 h | Mineral | 30 m | 40,5 | 150–190 |
| Swatch | Sistem51 | SUTB403 | Deportivo | Sistem51 | 90 h | Mineral | 30 m | 42 | 160–200 |
| Orient | Mako III | RA-AA0001B | Buceo | F6922 | 40 h | Mineral | 200 m | 41,8 | 210–250 |
| Seiko | 5 Sports Field | SRPG27K1 | Campo | 4R36 | 41 h | Hardlex | 100 m | 39,4 | 240–280 |
| Seiko | 5 Sports | SRPD55K1 | Buceo | 4R36 | 41 h | Hardlex | 100 m | 42,5 | 250–300 |
| Citizen | Promaster Diver | NY0120-01EE | Buceo | 8204 | 42 h | Mineral | 200 m | 41 | 260–300 |
| Citizen | Promaster Fugu | NY0040-09EE | Buceo | 8203 | 42 h | Mineral | 200 m | 42 | 280–320 |
| Orient | Kamasu | RA-AA0003R | Buceo | F6922 | 40 h | Zafiro | 200 m | 41,8 | 300–350 |
| Citizen | Tsuyosa | NJ0150-81Z | Deportivo | 8210 | 40 h | Zafiro | 50 m | 40 | 300–350 |
| Seiko | Prospex Turtle | SRPE93K1 | Buceo | 4R36 | 41 h | Hardlex | 200 m | 45 | 380–450 |
| Seiko | Presage Cocktail Time | SRPB43J1 | Vestir | 4R35 | 41 h | Hardlex | 50 m | 40,5 | 380–450 |
| Seiko | 5 Sports GMT | SSK001K1 | Deportivo | 4R34 | 41 h | Hardlex | 100 m | 42,5 | 420–480 |
| Laco | Aachen 39 | 862988 | Piloto | Laco 21 | 40 h | Mineral | 50 m | 39 | 440–500 |
| Orient Star | Classic Semi Skeleton | RE-AT0001S | Vestir | F8B63 | 50 h | Zafiro | 50 m | 38,7 | 450–520 |
| Tissot | Le Locle Powermatic 80 | T006.407.11.033.00 | Vestir | Powermatic 80 | 80 h | Zafiro | 30 m | 39,3 | 550–620 |
| Hamilton | Khaki Navy Scuba Auto | H82515130 | Buceo | H-10 | 80 h | Zafiro | 100 m | 40 | 600–680 |
| Hamilton | Khaki Field Auto 38 | H70305193 | Campo | H-10 | 80 h | Zafiro | 100 m | 38 | 650–720 |
| Tissot | PRX Powermatic 80 | T137.407.11.041.00 | Deportivo | Powermatic 80 | 80 h | Zafiro | 100 m | 40 | 680–750 |
| Seiko | Prospex Alpinist | SPB121J1 | Campo | 6R35 | 70 h | Zafiro | 200 m | 39,5 | 700–800 |
| Tissot | Seastar 1000 Powermatic 80 | T120.407.11.041.03 | Buceo | Powermatic 80 | 80 h | Zafiro | 300 m | 43 | 720–800 |
| Seiko | Presage Sharp Edged | SPB167J1 | Vestir | 6R35 | 70 h | Zafiro | 100 m | 39,3 | 720–820 |
| Tissot | Gentleman Powermatic 80 Silicium | T127.407.11.041.00 | Vestir | Powermatic 80 | 80 h | Zafiro | 100 m | 40 | 750–820 |
| Certina | DS Action Diver | C032.407.11.051.00 | Buceo | Powermatic 80 | 80 h | Zafiro | 300 m | 43 | 800–900 |
| Hamilton | Jazzmaster Open Heart | H32675140 | Vestir | H-10 | 80 h | Zafiro | 50 m | 40 | 850–950 |
| Mido | Ocean Star 200 | M042.430.11.041.00 | Buceo | Calibre 80 | 80 h | Zafiro | 200 m | 42,5 | 950–1.050 |
| Hamilton | Khaki Aviation Pilot Day Date | H64615135 | Piloto | H-30 | 80 h | Zafiro | 100 m | 42 | 950–1.050 |
| Citizen | Series 8 870 | NA1004-87E | Deportivo | 0950 | 50 h | Zafiro | 100 m | 40,8 | 1.300–1.450 |

Los datos están escritos de memoria. Antes de publicar, verifica cada uno con la web oficial del fabricante y marca `verified: true`. Las páginas con `verified: false` no se publican. Objetivo: ampliar a 80–150 modelos.

## 6. Diseño: está por hacer

Se hizo un primer prototipo y **el dueño lo ha rechazado**: le parece feo y se nota mucho que está hecho con IA. **No hay diseño aprobado.** El diseño hay que proponerlo desde cero y validarlo con el dueño antes de construir el resto.

Lo que el dueño quiere: una web **muy profesional**, que transmita confianza y no parezca una plantilla ni una web generada con IA.

### Qué evitar (lo que delata una web hecha con IA)

- Hero gigante centrado con frase grandilocuente y dos botones.
- Fila de «estadísticas» con números grandes que no aportan nada.
- Tarjetas idénticas con borde redondeado y sombra en todo.
- Etiquetas tipo «eyebrow» en mayúsculas sobre cada sección.
- Degradados morado-azul, fondo crema con serif y acento terracota, o negro con un único color neón.
- Emojis como iconos.
- Ilustraciones genéricas, o relojes dibujados por código que parezcan de juguete.
- Textos de relleno, frases hechas y tono de folleto.

### Referentes reales del sector (inspiración, no copia)

- **Webs de relojería y joyería de calidad:** mucha fotografía, mucho espacio en blanco, tipografía contenida y datos técnicos bien ordenados.
- **Comparadores técnicos serios** como RTINGS o GSMArena: densidad de datos, tablas claras y filtros potentes. El dato manda.
- **Medios relojeros** como Hodinkee o Monochrome Watches: tono editorial, fotografía protagonista.

### Imágenes

Las fotos son lo que más pesa en lo profesional que parece una web de relojes. Opciones a valorar con el dueño:

- Imágenes oficiales de la API de Amazon (PA-API), cuando haya acceso.
- Material de prensa de las marcas, revisando sus condiciones de uso.
- Fotos de producto con licencia.

Evita los relojes dibujados con SVG o canvas como imagen principal.

### Funcionalidades que sí se mantienen

- **Asistente** de tres preguntas (presupuesto, uso y tamaño de muñeca) que recomienda tres relojes.
- **Catálogo con filtros:** precio, estilo, diámetro, cristal de zafiro, 100 m o más, parada de segundero y origen.
- **Comparador** de hasta tres relojes, resaltando el mejor dato de cada fila.
- **Glosario** de calibre, reserva de marcha, frecuencia (A/h), cristal, hermeticidad y parada de segundero.

### Tono

Claro, cercano y técnico sin ser pedante. Español de España.

### Proceso

Antes de programar todas las plantillas, propone 2 o 3 direcciones visuales para la home y una ficha de reloj. El dueño elige una, y a partir de ahí se construye el resto.

## 7. Plan de trabajo

1. Proponer 2 o 3 direcciones de diseño (home y ficha), que el dueño elija una y montar el proyecto Astro con ella.
2. Migrar los 28 relojes al JSON con el esquema de arriba.
3. Crear las plantillas de ficha, comparativa, listado, calibre y guía, más la home con asistente y catálogo.
4. Implementar el SEO técnico: sitemap, hreflang preparado, JSON-LD y metadatos.
5. Escribir las páginas legales: aviso de afiliado, privacidad, cookies y aviso legal.
6. Desplegar en Cloudflare Pages con el dominio.
7. Después: verificar y ampliar datos, generar la versión alemana, conectar la PA-API cuando haya ventas y añadir una newsletter de ofertas (Black Friday, Prime Day).

### Estado a 21/10/2026

- Hecho: pasos 1 a 6. Diseño elegido (DESIGN.md, base Sigmaphoto, rojo rubí) y web completa en Astro, publicada en https://calibrario.com desde el 21/10/2026 (Cloudflare Pages conectado a GitHub `josemcastrodev/calibrario`, cada push a `main` despliega solo). Ver README.md.
- Multidioma (lo pidió el dueño el 21/10/2026): español, inglés, alemán, francés e italiano, con direcciones traducidas (`/en/watches/…`, `/de/uhren/…`), hreflang y selector de idioma. 1.156 páginas en borrador y 146 en producción. Las traducciones las ha hecho Claude: conviene que las revise un nativo antes de promocionarlas.
- Catálogo: 59 relojes de 17 marcas, todos con ASIN y página de producto en Amazon.es comprobada a mano el 21/10/2026 (botón de compra y stock). Los modelos sin stock se sustituyeron por su versión vigente o por un equivalente. Los enlaces van al producto exacto (`/dp/{ASIN}`), nunca a una búsqueda.
- Sin boletín de ofertas: el dueño lo quitó.
- SEO ampliado: páginas de marca, 29 listados, 14 guías, sitemap con hreflang y buscador en el JSON-LD de la portada. Los textos nuevos están en `src/i18n/extra2.ts`, `guias-es-en.ts` y `guias-de-fr-it.ts`.
- Desplegables propios (`src/scripts/dropdown.js`) en lugar de los nativos del navegador.
- Verificación (empezada el 21/10/2026): 19 de 59 relojes comprobados con la web oficial (Seiko, Citizen y Orient), con `verifiedAt` y `sources` en `relojes.json`; la ficha enseña la fecha y las fuentes. Regla: si el fabricante no publica un dato opcional (grosor, entre asas, ancho de correa), se deja en `null` y la ficha muestra un guion; no se ponen medidas de tiendas. Si el modelo ya no está en la web oficial, vale su ficha oficial archivada en web.archive.org. Bloqueo principal: la mayoría de marcas suizas y Glycine, Alpina, Invicta, Timex y Bulova no publican la frecuencia ni si para el segundero (y Frederique Constant, el cristal); el dueño tiene que decidir si se aceptan esos datos de la documentación del fabricante del calibre (ETA, Sellita, Miyota, TMI). Las correcciones oficiales ya están aplicadas y anotadas en `dataNotes`. Hamilton, Mido y Certina bloquean el acceso desde la conexión del dueño; Tissot ha retirado 5 de los 6 modelos. Amazon.es comprobado el 21/10/2026: los 59 enlaces tienen ficha, compra y referencia correctas, y los precios caen en su gama.
- Pendiente: terminar de verificar los datos, datos del titular en las páginas legales, fotos oficiales, revisar la disponibilidad en Amazon cada mes y dar de alta la web en Google Search Console. calibrario.com ya está en la lista de webs de la cuenta de Afiliados.
- Afiliados: el 21/10/2026 se creó el ID de seguimiento `calibrario-21` en la cuenta del dueño (la misma que usa `tcgstockup-21`). Global Earning está activo en los 10 países y los datos fiscales de EE. UU. y Canadá están completados.

## 8. Expectativas realistas

Con un ticket medio de unos 400 € al 6 %, cada venta deja unos 20 € (la comisión se calcula sin IVA). Con unas 20.000 visitas al mes, se pueden esperar unos 2.000–2.500 €/mes. Llegar a ese tráfico suele llevar entre 18 y 24 meses de publicación constante.
