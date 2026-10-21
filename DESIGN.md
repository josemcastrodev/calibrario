# Calibrario — sistema de diseño

Basado en el DESIGN.md de **Sigmaphoto** del catálogo de Refero Styles («galería monocroma para instrumentos de precisión»), elegido el 21/10/2026 por el dueño. El original está en `design/marca/sigmaphoto-DESIGN.md`; esta es la versión adaptada a Calibrario. Todo lo que no se diga aquí se hace como dice el original.

## Estructura copiada de sigmaphoto.com (revisada en el navegador el 21/10/2026)

1. Barra oscura de aviso arriba, en mayúsculas.
2. Navegación blanca: enlaces en mayúsculas a la izquierda, marca en serif centrada, utilidades a la derecha.
3. Foto a sangre que ocupa casi toda la pantalla, sin texto encima.
4. Titular gigante en mayúsculas, centrado, en serif (88 px, interletraje −0,035 em), con un párrafo corto y un enlace de texto debajo.
5. Etiqueta de sección en serif mayúscula centrada («DESTACADOS DEL CATÁLOGO») y dos fotos verticales enormes, una al lado de otra, con el título en blanco y mayúsculas centrado encima y un enlace de texto.
6. **Una banda roja a sangre** con titular gigante blanco (Sigma también la usa). En Calibrario lleva el asistente en la portada y el ajuste de muñeca en la ficha.
7. Tres columnas con producto recortado sobre blanco, título en mayúsculas, texto y enlace.
8. (Sin boletín: el dueño lo quitó el 21/10/2026.)
9. Ficha de producto: titular gigante centrado, foto a sangre, y debajo la foto del producto a dos tercios con la columna de compra a la derecha (nombre, precio, botón, lista de características).

**Todas las fotos en blanco y negro** (`filter: grayscale(1) contrast(1.06)`): unifica fotos de procedencias distintas y deja el rojo como único color.

## Adaptaciones para Calibrario

| Qué | Original Sigmaphoto | Calibrario |
|---|---|---|
| Color de acción (el único color) | Cobalto `#0048ff` | **Rojo rubí `#b5122b`** (los rubíes del calibre). Solo en el botón principal y en el mejor dato de una comparativa |
| Texto de lectura | Sigma Serif (sustituto Cormorant Garamond) 16 px `#707070` | **Newsreader 18–19 px `#333333`**: Cormorant resultaba demasiado fino; las fichas se leen de verdad |
| Uso del rojo | Solo el botón | Botón, mejor dato de cada fila **y una banda roja a sangre por página** |
| Banner superior | Promoción | **Aviso de afiliado de Amazon**, que debe ser visible en todas las páginas |
| Marca en la barra | «SIGMA» en serif 24 px centrado | Logotipo «Calibrario» en Playfair Display 27 px, centrado, con **los puntos de las dos íes en rojo rubí** (los rubíes del calibre). En el pie, el mismo logotipo a tamaño gigante en blanco. Componente `src/components/Logo.astro` |
| Fondo oscuro de las fotos | Degradado de estudio carbón→negro | Igual: `radial-gradient(#2a2a2a, #000)` detrás de la foto de producto, único degradado permitido |
| Tablas de datos | No las hay en el original | Líneas de 1 px: `#333333` arriba de la cabecera y `#d9d9d9` entre filas; cifras tabulares; nada de zebra ni fondos |
| Dibujo técnico | — | Trazo `#333333` de 1,4 px sobre blanco o niebla (blanco sobre la banda roja); es un dato, no decoración |
| Favicon | — | Cuadrado `#141414` con un aro blanco y un punto rubí en el centro (`public/favicon.svg`; el `.ico` y los PNG salen de `scripts/favicons.mjs`) |
| Idiomas | — | Selector discreto «ES» con flecha a la derecha de la navegación, fila de idiomas en el menú del móvil y en el pie |

Todo lo demás se mantiene: pesos 400 en todas las fuentes, esquinas a 0 px (1 px en campos), sin sombras, sin degradados en UI, etiquetas de sección en mayúsculas de 13 px `#707070` con tracking 0,08 em centradas, enlaces de texto en mayúsculas como acción secundaria, un solo botón relleno por pantalla, fotos de producto a sangre sobre fondo oscuro, bloques de texto centrados de 600 px como máximo, 80 px de aire entre bandas, 184 px entre secciones grandes.

## Colores

| Nombre | Valor | Uso |
|---|---|---|
| Tinta pizarra | `#333333` | Texto, bordes dominantes, enlaces de navegación |
| Blanco | `#ffffff` | Fondo de página |
| Negro ónice | `#000000` | Fondo de las fotos de producto, trazos de iconos |
| Niebla | `#f2f2f2` | Superficie secundaria: bloques que necesitan separarse del blanco (el hueso cálido del original se quitó: el dueño no quiere el crema) |
| Noche | `#141414` | Fondo del pie |
| Gris ceniza | `#707070` | Texto de apoyo, etiquetas de sección |
| Gris piedra | `#999999` | Bordes terciarios |
| **Rojo rubí** | `#b5122b` | **Botón principal y mejor dato**; nada más |

## Tipografía

- Titulares: **Playfair Display** 400. 48 px (tracking −0,3 px, interlineado 1,25) y 88 px (tracking −0,5 px, interlineado 1,1).
- Lectura, subtítulos y etiquetas de sección: **Newsreader** 400. 18–19 px de cuerpo (1,5); etiquetas en mayúsculas a 15 px con interletraje 0,06 em.
- Interfaz: **Inter** 400 a 13 px (mayúsculas, tracking 0,08 em) para navegación, botones, etiquetas; 16 px en campos. Inter 500 a 14 px solo para alguna microetiqueta.
- Cifras: Playfair Display 400 cuando son protagonistas (48 px); Inter con cifras tabulares dentro de tablas.

## Componentes de Calibrario

- **Barra de aviso**: `#333333`, 40 px, texto blanco 13 px centrado: «Calibrario participa en el Programa de Afiliados de Amazon EU» con enlace «CÓMO FUNCIONA» a la derecha.
- **Navegación**: 60 px, borde inferior 1 px `#333333`. Izquierda: RELOJES, COMPARAR, CALIBRES, GUÍAS. Centro: Calibrario. Derecha: ASISTENTE, BUSCAR.
- **Héroe**: 100 vw × 92 vh mínimo 600 px, fondo oscuro, una sola foto de reloj centrada. Sin texto encima.
- **Bloque editorial centrado**: titular 48 px, cuerpo 19 px, enlace de texto en mayúsculas.
- **Botón rojo**: rectángulo `#b5122b`, texto blanco 13 px mayúsculas, 11 × 16 px de relleno, 0 px de radio. «VER PRECIO EN AMAZON» con `rel="sponsored noopener"`.
- **Campo fantasma**: borde 1 px `#333333`, 7 × 11 px, radio 1 px, Inter 16 px. Vale para selectores del asistente y del comparador.
- **Tarjeta de producto**: blanca, sin sombra, 16 px de relleno, imagen 4:5 sobre fondo oscuro, nombre en Cormorant 19 px, gama en Inter 13 px `#707070`.
- **Banda con texto**: foto oscura a sangre con titular blanco 48 px y enlace de texto.
- **Tabla de datos**: cabecera Inter 13 px mayúsculas, cuerpo Cormorant 19 px, mejor dato en rojo.
- **Pie**: fondo noche `#141414`, texto blanco y gris claro, columnas Inter 13 px, idiomas, el logotipo gigante en blanco con sus puntos rubí, aviso de afiliado completo y créditos de fotos.
- **Comparador**: columnas del mismo ancho (`table-layout: fixed`). La cabecera de cada columna es su propio selector: el nombre del reloj, el chip «Cambiar» y un desplegable invisible encima, así selector y columna siempre cuadran. El pie de la tabla lleva «Ver precio en Amazon» y «Ver ficha» de cada reloj.

## Reglas de Amazon que el diseño respeta

Sin precios de Amazon (solo «gama orientativa»), botón único «Ver precio en Amazon», aviso de afiliado visible en todas las páginas.
