// SEO ampliado (21/10/2026): listados nuevos, frase de cada marca y textos calculados de las páginas de marca,
// en los cinco idiomas. Se mezcla con cada diccionario en index.ts.
import type { Reloj } from '../content.config';
import type { Ctx, DictExtra, ListadoKey, QA } from './types';
import type { Lang } from './langs';
import { extremos, joinWith } from './shared';

type L = { slug: string; h1: string; title: string; description: string; criterio: string };
type X = { listados: Partial<Record<ListadoKey, L>>; marcas: Record<string, string>; genx: DictExtra['genx'] };

const calibresDe = (list: Reloj[]) => [...new Set(list.map((r) => r.caliber))];
const zaf = (list: Reloj[]) => list.filter((r) => r.crystal === 'Zafiro').length;
/** ¿Tienen todos la misma reserva? Entonces no hay «el que más». */
const igual = (list: Reloj[]) => new Set(list.map((r) => r.reserveHours)).size === 1;

const y = joinWith('y'), and = joinWith('and'), und = joinWith('und'), et = joinWith('et'), e_ = joinWith('e');
const voyFr = (m: string) => /^[aeiouyàâéèêîôûAEIOUYÀÂÉÈÊÎÔÛ]/.test(m);
const laFr = (m: string) => (voyFr(m) ? `l’${m}` : `la ${m}`), LaFr = (m: string) => (voyFr(m) ? `L’${m}` : `La ${m}`);
const vocIt = (m: string) => /^[aeiouhAEIOUH]/.test(m), loIt = (m: string) => /^(s[^aeiou]|z|gn|ps|x|y)/i.test(m);
const ilIt = (m: string) => (vocIt(m) ? `l’${m}` : loIt(m) ? `lo ${m}` : `il ${m}`), IlIt = (m: string) => (vocIt(m) ? `L’${m}` : loIt(m) ? `Lo ${m}` : `Il ${m}`);

export const EXTRA2: Record<Lang, X> = {
  es: {
    listados: {
      calidadPrecio: { slug: 'relojes-automaticos-calidad-precio', h1: 'Relojes automáticos con mejor relación calidad-precio', title: 'Relojes automáticos calidad-precio: los 12 con más datos por euro', description: 'Los relojes automáticos del catálogo que más ofrecen por cada 100 €: cristal, parada de segundero, reserva y hermeticidad puntuados con una fórmula pública.', criterio: 'cada reloj suma puntos por sus datos (zafiro 3, Hardlex 1,5, mineral 1, acrílico 0,5; parada de segundero 1; carga manual 0,5; 70 horas de reserva o más 2, 50 o más 1; 200 m 1,5, 100 m 1; 28.800 A/h 0,5; fondo visto 0,3) y se divide entre su gama orientativa media en cientos de euros. Salen los doce primeros.' },
      menos200: { slug: 'relojes-automaticos-menos-de-200-euros', h1: 'Relojes automáticos por menos de 200 €', title: 'Relojes automáticos por menos de 200 €: los más baratos comparados', description: 'Los relojes automáticos del catálogo con una gama orientativa media por debajo de 200 €, con su calibre y sus medidas.', criterio: 'relojes cuya gama orientativa media queda por debajo de 200 €.' },
      menos400: { slug: 'relojes-automaticos-menos-de-400-euros', h1: 'Relojes automáticos por menos de 400 €', title: 'Relojes automáticos por menos de 400 €: comparativa con datos', description: 'Relojes automáticos por menos de 400 €, de Seiko, Orient, Citizen y más, con calibre, reserva, cristal y hermeticidad en la misma tabla.', criterio: 'relojes cuya gama orientativa media queda por debajo de 400 €.' },
      menos800: { slug: 'relojes-automaticos-menos-de-800-euros', h1: 'Relojes automáticos por menos de 800 €', title: 'Relojes automáticos por menos de 800 €: japoneses y suizos comparados', description: 'Relojes automáticos por menos de 800 €, con los primeros suizos de 80 horas, comparados dato a dato.', criterio: 'relojes cuya gama orientativa media queda por debajo de 800 €.' },
      gmt: { slug: 'relojes-automaticos-gmt', h1: 'Relojes automáticos GMT', title: 'Relojes automáticos GMT: segunda zona horaria por menos de 1.500 €', description: 'Los relojes automáticos con aguja GMT del catálogo, para leer la hora de otra zona horaria, con su calibre y medidas.', criterio: 'relojes con aguja de 24 horas para una segunda zona horaria.' },
      alemanes: { slug: 'relojes-automaticos-alemanes', h1: 'Relojes automáticos alemanes', title: 'Relojes automáticos alemanes: Laco y Junghans comparados', description: 'Relojes automáticos de marcas alemanas, de los aviadores de Laco al Max Bill de Junghans, con todos sus datos.', criterio: 'relojes de marcas alemanas.' },
      finos: { slug: 'relojes-automaticos-finos', h1: 'Relojes automáticos finos: 11 mm o menos', title: 'Relojes automáticos finos de 11 mm o menos: los más planos', description: 'Los relojes automáticos más finos del catálogo, de 11 mm de grosor o menos, ordenados del más plano al más grueso.', criterio: 'relojes de 11 mm de grosor o menos, del más fino al más grueso.' },
      fondoVisto: { slug: 'relojes-automaticos-fondo-visto', h1: 'Relojes automáticos con fondo visto', title: 'Relojes automáticos con fondo transparente para ver el calibre', description: 'Relojes automáticos con fondo visto, para ver el calibre y el rotor girando, ordenados por precio.', criterio: 'relojes con tapa trasera transparente.' },
      buceoBaratos: { slug: 'relojes-de-buceo-automaticos-baratos', h1: 'Relojes de buceo automáticos baratos', title: 'Relojes de buceo automáticos baratos: por menos de 500 €', description: 'Relojes de buceo automáticos por menos de 500 €, con su hermeticidad, cristal y bisel comparados.', criterio: 'relojes de estilo buceo con una gama orientativa media por debajo de 500 €.' },
      vestirBaratos: { slug: 'relojes-de-vestir-automaticos-baratos', h1: 'Relojes de vestir automáticos baratos', title: 'Relojes de vestir automáticos baratos: por menos de 500 €', description: 'Relojes automáticos de vestir por menos de 500 €, con su grosor, diámetro y cristal en la misma tabla.', criterio: 'relojes de estilo vestir con una gama orientativa media por debajo de 500 €.' },
      suizosBaratos: { slug: 'relojes-automaticos-suizos-baratos', h1: 'Relojes automáticos suizos por menos de 800 €', title: 'Relojes automáticos suizos baratos: por menos de 800 €', description: 'Los relojes automáticos suizos más asequibles del catálogo, por menos de 800 €, con su calibre y reserva de marcha.', criterio: 'relojes de marcas suizas con una gama orientativa media por debajo de 800 €.' },
      brazalete: { slug: 'relojes-automaticos-con-brazalete', h1: 'Relojes automáticos con brazalete de acero o titanio', title: 'Relojes automáticos con brazalete metálico: todos los modelos', description: 'Relojes automáticos que vienen con brazalete de acero o de titanio, con sus medidas y datos comparados.', criterio: 'relojes que vienen con brazalete de acero o de titanio.' },
      piel: { slug: 'relojes-automaticos-correa-de-piel', h1: 'Relojes automáticos con correa de piel', title: 'Relojes automáticos con correa de piel: modelos y datos', description: 'Relojes automáticos que vienen con correa de piel, de vestir, de campo y de aviador, comparados con datos.', criterio: 'relojes que vienen con correa de piel.' },
    },
    marcas: {
      seiko: 'Seiko, fundada en Tokio en 1881, fabrica todo lo que lleva dentro, del calibre al cristal Hardlex. Es la marca con más modelos en este catálogo.',
      citizen: 'Citizen, nacida en Tokio en 1918, es dueña de Miyota, que vende calibres a medio mundo. En automáticos va de los sencillos 82 a la Series 8.',
      orient: 'Orient, fundada en 1950 y hoy parte de Seiko Epson, fabrica sus propios calibres, también para sus relojes de unos 300 €. Orient Star es su gama alta.',
      tissot: 'Tissot, en Le Locle desde 1853, es la marca de entrada del grupo Swatch y la que popularizó el Powermatic 80 de 80 horas.',
      hamilton: 'Hamilton nació en Pensilvania en 1892 y hoy es suiza, del grupo Swatch. Conserva el estilo militar y de aviación estadounidense, casi siempre con calibres de 80 horas.',
      mido: 'Mido, fundada en 1918 en Le Locle, es la marca del grupo Swatch con diseños inspirados en la arquitectura y, en la mayoría de modelos, calibres de 80 horas.',
      laco: 'Laco, de Pforzheim desde 1925, fue uno de los cinco fabricantes de los relojes de aviador alemanes de los años cuarenta y sigue haciéndolos.',
      glycine: 'Glycine, fundada en Biel en 1914, es conocida por el Airman, el reloj de piloto con esfera de 24 horas de los años cincuenta.',
      timex: 'Timex, heredera de una fábrica de Connecticut de 1854, es la marca de relojes asequibles de Estados Unidos y ha vuelto a los automáticos con calibres Miyota.',
      invicta: 'Invicta, de origen suizo y hoy con sede en Florida, vende automáticos muy baratos con calibres Seiko NH35A.',
      bulova: 'Bulova, fundada en Nueva York en 1875 y hoy del grupo Citizen, hizo relojes para el ejército estadounidense y ahora los reedita.',
      vostok: 'Vostok fabrica relojes en Chistopol, Rusia, desde 1942, con calibres propios; su Amphibia es un buceo de culto.',
      swatch: 'Swatch, creada en 1983 para salvar la relojería suiza, hizo con el Sistem51 un automático montado por máquinas.',
      junghans: 'Junghans, en la Selva Negra desde 1861, produce el Max Bill, el reloj de diseño Bauhaus más reconocible.',
      'frederique-constant': 'Frederique Constant, fundada en Ginebra en 1988, ofrece relojes suizos clásicos a precios contenidos.',
      alpina: 'Alpina, de Ginebra desde 1883, centra su catálogo en relojes deportivos y de aviador.',
      victorinox: 'Victorinox, la marca de la navaja suiza, hace relojes desde 1989 con estética funcional y calibres ETA.',
    },
    genx: {
      brandIntro: (n, list, c) => {
        const e = extremos(list), cals = calibresDe(list), f = c.f;
        return `${list.length} relojes automáticos ${n} en el catálogo, de ${f.eur(e.min)} a ${f.eur(e.max)} de gama orientativa. ${cals.length === 1 ? `Todos llevan el calibre ${cals[0]}.` : `Usan ${cals.length} calibres: ${y(cals)}.`} ${igual(list) ? `Todos tienen ${f.h(e.reserva.reserveHours)} de reserva de marcha.` : `El que más reserva tiene es el ${c.name(e.reserva)}, con ${f.h(e.reserva.reserveHours)}.`}`;
      },
      brandFaqs: (n, list, c): QA[] => {
        const e = extremos(list), f = c.f, z = zaf(list);
        return [
          [`¿Cuál es el ${n} automático más barato?`, `En el catálogo, el ${c.name(e.barato)}, con una gama orientativa de ${f.price(e.barato.priceRange)}.`],
          [`¿Qué ${n} tiene más reserva de marcha?`, igual(list) ? `Todos los del catálogo tienen ${f.h(e.reserva.reserveHours)}.` : `El ${c.name(e.reserva)}, con ${f.h(e.reserva.reserveHours)}.`],
          [`¿Qué calibres usa ${n}?`, `En los modelos del catálogo, ${y(calibresDe(list))}.`],
          [`¿Tiene ${n} relojes con cristal de zafiro?`, z ? `Sí: ${z} de los ${list.length} modelos del catálogo lo llevan.` : 'Ninguno de los modelos del catálogo lo lleva.'],
        ];
      },
    },
  },
  en: {
    listados: {
      calidadPrecio: { slug: 'best-value-automatic-watches', h1: 'The best-value automatic watches', title: 'Best-value automatic watches: the 12 with the most per euro', description: 'The automatic watches in the catalogue that offer the most per €100: crystal, hacking, power reserve and water resistance scored with a public formula.', criterio: 'each watch earns points for its figures (sapphire 3, Hardlex 1.5, mineral 1, acrylic 0.5; hacking seconds 1; hand winding 0.5; 70 hours of reserve or more 2, 50 or more 1; 200 m 1.5, 100 m 1; 28,800 bph 0.5; display caseback 0.3), divided by its average indicative price in hundreds of euros. The top twelve are shown.' },
      menos200: { slug: 'automatic-watches-under-200', h1: 'Automatic watches under €200', title: 'Automatic watches under €200: the cheapest compared', description: 'The automatic watches in the catalogue with an average indicative price under €200, with their movement and dimensions.', criterio: 'watches whose average indicative price is under €200.' },
      menos400: { slug: 'automatic-watches-under-400', h1: 'Automatic watches under €400', title: 'Automatic watches under €400: compared in figures', description: 'Automatic watches under €400, from Seiko, Orient, Citizen and more, with movement, reserve, crystal and water resistance in one table.', criterio: 'watches whose average indicative price is under €400.' },
      menos800: { slug: 'automatic-watches-under-800', h1: 'Automatic watches under €800', title: 'Automatic watches under €800: Japanese and Swiss compared', description: 'Automatic watches under €800, including the first 80-hour Swiss models, compared figure by figure.', criterio: 'watches whose average indicative price is under €800.' },
      gmt: { slug: 'automatic-gmt-watches', h1: 'Automatic GMT watches', title: 'Automatic GMT watches: a second time zone for under €1,500', description: 'The automatic watches with a GMT hand in the catalogue, to read another time zone, with their movement and dimensions.', criterio: 'watches with a 24-hour hand for a second time zone.' },
      alemanes: { slug: 'german-automatic-watches', h1: 'German automatic watches', title: 'German automatic watches: Laco and Junghans compared', description: 'Automatic watches from German brands, from Laco’s pilot watches to the Junghans Max Bill, with every figure.', criterio: 'watches from German brands.' },
      finos: { slug: 'thin-automatic-watches', h1: 'Thin automatic watches: 11 mm or less', title: 'Thin automatic watches of 11 mm or less: the slimmest', description: 'The thinnest automatic watches in the catalogue, 11 mm thick or less, from slimmest to thickest.', criterio: 'watches 11 mm thick or less, from slimmest to thickest.' },
      fondoVisto: { slug: 'automatic-watches-display-caseback', h1: 'Automatic watches with a display caseback', title: 'Automatic watches with a see-through caseback to show the movement', description: 'Automatic watches with a display caseback, to watch the movement and rotor at work, sorted by price.', criterio: 'watches with a transparent caseback.' },
      buceoBaratos: { slug: 'affordable-automatic-dive-watches', h1: 'Affordable automatic dive watches', title: 'Affordable automatic dive watches: under €500', description: 'Automatic dive watches under €500, with their water resistance, crystal and bezel compared.', criterio: 'dive-style watches with an average indicative price under €500.' },
      vestirBaratos: { slug: 'affordable-automatic-dress-watches', h1: 'Affordable automatic dress watches', title: 'Affordable automatic dress watches: under €500', description: 'Automatic dress watches under €500, with their thickness, diameter and crystal in one table.', criterio: 'dress-style watches with an average indicative price under €500.' },
      suizosBaratos: { slug: 'affordable-swiss-automatic-watches', h1: 'Swiss automatic watches under €800', title: 'Affordable Swiss automatic watches: under €800', description: 'The most affordable Swiss automatic watches in the catalogue, under €800, with their movement and power reserve.', criterio: 'watches from Swiss brands with an average indicative price under €800.' },
      brazalete: { slug: 'automatic-watches-on-bracelet', h1: 'Automatic watches on a steel or titanium bracelet', title: 'Automatic watches on a metal bracelet: every model', description: 'Automatic watches supplied on a steel or titanium bracelet, with their dimensions and figures compared.', criterio: 'watches supplied on a steel or titanium bracelet.' },
      piel: { slug: 'automatic-watches-leather-strap', h1: 'Automatic watches on a leather strap', title: 'Automatic watches on a leather strap: models and figures', description: 'Automatic watches supplied on a leather strap, dress, field and pilot, compared in figures.', criterio: 'watches supplied on a leather strap.' },
    },
    marcas: {
      seiko: 'Seiko, founded in Tokyo in 1881, makes everything inside its watches, from the movement to the Hardlex crystal. It is the brand with the most models in this catalogue.',
      citizen: 'Citizen, born in Tokyo in 1918, owns Miyota, which supplies movements to half the world. Its automatics range from the simple 82 series to the Series 8.',
      orient: 'Orient, founded in 1950 and now part of Seiko Epson, makes its own movements, even for its watches of around €300. Orient Star is its upper range.',
      tissot: 'Tissot, in Le Locle since 1853, is the Swatch Group’s entry brand and the one that popularised the 80-hour Powermatic 80.',
      hamilton: 'Hamilton was born in Pennsylvania in 1892 and is now Swiss, part of the Swatch Group. It keeps an American military and aviation style, mostly with 80-hour movements.',
      mido: 'Mido, founded in 1918 in Le Locle, is the Swatch Group brand with architecture-inspired designs and, in most models, 80-hour movements.',
      laco: 'Laco, from Pforzheim since 1925, was one of the five makers of the German pilot watches of the 1940s and still makes them.',
      glycine: 'Glycine, founded in Biel in 1914, is known for the Airman, the 1950s pilot’s watch with a 24-hour dial.',
      timex: 'Timex, heir to an 1854 Connecticut factory, is America’s affordable watch brand and has returned to automatics with Miyota movements.',
      invicta: 'Invicta, Swiss in origin and now based in Florida, sells very inexpensive automatics with Seiko NH35A movements.',
      bulova: 'Bulova, founded in New York in 1875 and now part of the Citizen group, made watches for the US Army and now reissues them.',
      vostok: 'Vostok has made watches in Chistopol, Russia, since 1942, with its own movements; its Amphibia is a cult diver.',
      swatch: 'Swatch, created in 1983 to rescue Swiss watchmaking, made an automatic assembled by machines with the Sistem51.',
      junghans: 'Junghans, in the Black Forest since 1861, produces the Max Bill, the most recognisable Bauhaus design watch.',
      'frederique-constant': 'Frederique Constant, founded in Geneva in 1988, offers classic Swiss watches at moderate prices.',
      alpina: 'Alpina, from Geneva since 1883, focuses its range on sports and pilot watches.',
      victorinox: 'Victorinox, the Swiss Army knife brand, has made watches since 1989 with functional looks and ETA movements.',
    },
    genx: {
      brandIntro: (n, list, c) => {
        const e = extremos(list), cals = calibresDe(list), f = c.f;
        return `${list.length} ${n} automatic watches in the catalogue, from ${f.eur(e.min)} to ${f.eur(e.max)} in indicative price. ${cals.length === 1 ? `All use the ${cals[0]} movement.` : `They use ${cals.length} movements: ${and(cals)}.`} ${igual(list) ? `All have ${f.h(e.reserva.reserveHours)} of power reserve.` : `The one with the most power reserve is the ${c.name(e.reserva)}, with ${f.h(e.reserva.reserveHours)}.`}`;
      },
      brandFaqs: (n, list, c): QA[] => {
        const e = extremos(list), f = c.f, z = zaf(list);
        return [
          [`Which is the least expensive ${n} automatic?`, `In the catalogue, the ${c.name(e.barato)}, with an indicative price band of ${f.price(e.barato.priceRange)}.`],
          [`Which ${n} has the most power reserve?`, igual(list) ? `All the models in the catalogue have ${f.h(e.reserva.reserveHours)}.` : `The ${c.name(e.reserva)}, with ${f.h(e.reserva.reserveHours)}.`],
          [`Which movements does ${n} use?`, `In the models in the catalogue, the ${and(calibresDe(list))}.`],
          [`Does ${n} make watches with sapphire crystal?`, z ? `Yes: ${z} of the ${list.length} models in the catalogue have one.` : 'None of the models in the catalogue has one.'],
        ];
      },
    },
  },
  de: {
    listados: {
      calidadPrecio: { slug: 'automatikuhren-preis-leistung', h1: 'Automatikuhren mit dem besten Preis-Leistungs-Verhältnis', title: 'Automatikuhren Preis-Leistung: die 12 mit den meisten Werten pro Euro', description: 'Die Automatikuhren des Katalogs, die pro 100 € am meisten bieten: Glas, Sekundenstopp, Gangreserve und Wasserdichtheit nach einer offenen Formel bewertet.', criterio: 'jede Uhr erhält Punkte für ihre Werte (Saphirglas 3, Hardlex 1,5, Mineralglas 1, Acrylglas 0,5; Sekundenstopp 1; Handaufzug 0,5; 70 Stunden Gangreserve oder mehr 2, 50 oder mehr 1; 200 m 1,5, 100 m 1; 28.800 A/h 0,5; Glasboden 0,3), geteilt durch die mittlere Preisspanne in Hunderten Euro. Gezeigt werden die zwölf besten.' },
      menos200: { slug: 'automatikuhren-unter-200-euro', h1: 'Automatikuhren unter 200 €', title: 'Automatikuhren unter 200 €: die günstigsten im Vergleich', description: 'Die Automatikuhren des Katalogs mit einer mittleren Preisspanne unter 200 €, mit Kaliber und Maßen.', criterio: 'Uhren, deren mittlere Preisspanne unter 200 € liegt.' },
      menos400: { slug: 'automatikuhren-unter-400-euro', h1: 'Automatikuhren unter 400 €', title: 'Automatikuhren unter 400 €: Vergleich in Zahlen', description: 'Automatikuhren unter 400 €, von Seiko, Orient, Citizen und mehr, mit Kaliber, Gangreserve, Glas und Wasserdichtheit in einer Tabelle.', criterio: 'Uhren, deren mittlere Preisspanne unter 400 € liegt.' },
      menos800: { slug: 'automatikuhren-unter-800-euro', h1: 'Automatikuhren unter 800 €', title: 'Automatikuhren unter 800 €: Japaner und Schweizer im Vergleich', description: 'Automatikuhren unter 800 €, mit den ersten Schweizer Modellen mit 80 Stunden, Wert für Wert verglichen.', criterio: 'Uhren, deren mittlere Preisspanne unter 800 € liegt.' },
      gmt: { slug: 'automatik-gmt-uhren', h1: 'Automatik-GMT-Uhren', title: 'Automatik-GMT-Uhren: zweite Zeitzone für unter 1.500 €', description: 'Die Automatikuhren mit GMT-Zeiger im Katalog, um eine zweite Zeitzone abzulesen, mit Kaliber und Maßen.', criterio: 'Uhren mit 24-Stunden-Zeiger für eine zweite Zeitzone.' },
      alemanes: { slug: 'deutsche-automatikuhren', h1: 'Deutsche Automatikuhren', title: 'Deutsche Automatikuhren: Laco und Junghans im Vergleich', description: 'Automatikuhren deutscher Marken, von Lacos Fliegeruhren bis zur Junghans Max Bill, mit allen Werten.', criterio: 'Uhren deutscher Marken.' },
      finos: { slug: 'flache-automatikuhren', h1: 'Flache Automatikuhren: 11 mm oder weniger', title: 'Flache Automatikuhren mit 11 mm oder weniger: die flachsten', description: 'Die flachsten Automatikuhren des Katalogs, mit 11 mm Höhe oder weniger, von der flachsten zur höchsten.', criterio: 'Uhren mit 11 mm Höhe oder weniger, von der flachsten zur höchsten.' },
      fondoVisto: { slug: 'automatikuhren-mit-glasboden', h1: 'Automatikuhren mit Glasboden', title: 'Automatikuhren mit Glasboden: das Kaliber im Blick', description: 'Automatikuhren mit Glasboden, um Uhrwerk und Rotor bei der Arbeit zu sehen, nach Preis sortiert.', criterio: 'Uhren mit durchsichtigem Gehäuseboden.' },
      buceoBaratos: { slug: 'guenstige-automatik-taucheruhren', h1: 'Günstige Automatik-Taucheruhren', title: 'Günstige Automatik-Taucheruhren: unter 500 €', description: 'Automatik-Taucheruhren unter 500 €, mit Wasserdichtheit, Glas und Lünette im Vergleich.', criterio: 'Uhren im Taucherstil mit einer mittleren Preisspanne unter 500 €.' },
      vestirBaratos: { slug: 'guenstige-elegante-automatikuhren', h1: 'Günstige elegante Automatikuhren', title: 'Günstige elegante Automatikuhren: unter 500 €', description: 'Elegante Automatikuhren unter 500 €, mit Höhe, Durchmesser und Glas in einer Tabelle.', criterio: 'Uhren im eleganten Stil mit einer mittleren Preisspanne unter 500 €.' },
      suizosBaratos: { slug: 'guenstige-schweizer-automatikuhren', h1: 'Schweizer Automatikuhren unter 800 €', title: 'Günstige Schweizer Automatikuhren: unter 800 €', description: 'Die günstigsten Schweizer Automatikuhren des Katalogs, unter 800 €, mit Kaliber und Gangreserve.', criterio: 'Uhren Schweizer Marken mit einer mittleren Preisspanne unter 800 €.' },
      brazalete: { slug: 'automatikuhren-mit-metallarmband', h1: 'Automatikuhren mit Stahl- oder Titanband', title: 'Automatikuhren mit Metallarmband: alle Modelle', description: 'Automatikuhren, die mit Stahl- oder Titanband geliefert werden, mit Maßen und Werten im Vergleich.', criterio: 'Uhren, die mit Stahl- oder Titanband geliefert werden.' },
      piel: { slug: 'automatikuhren-mit-lederarmband', h1: 'Automatikuhren mit Lederarmband', title: 'Automatikuhren mit Lederarmband: Modelle und Werte', description: 'Automatikuhren, die mit Lederarmband geliefert werden, elegant, im Feld- und Fliegerstil, im Vergleich.', criterio: 'Uhren, die mit Lederarmband geliefert werden.' },
    },
    marcas: {
      seiko: 'Seiko, 1881 in Tokio gegründet, fertigt alles selbst, vom Uhrwerk bis zum Hardlex-Glas. Keine Marke hat in diesem Katalog mehr Modelle.',
      citizen: 'Citizen, 1918 in Tokio entstanden, besitzt Miyota, das halb die Welt mit Uhrwerken beliefert. Die Automatikuhren reichen von der einfachen 82er-Serie bis zur Series 8.',
      orient: 'Orient, 1950 gegründet und heute Teil von Seiko Epson, baut eigene Kaliber, auch für ihre Uhren um 300 €. Orient Star ist die Oberklasse.',
      tissot: 'Tissot, seit 1853 in Le Locle, ist die Einstiegsmarke der Swatch Group und hat das Powermatic 80 mit 80 Stunden bekannt gemacht.',
      hamilton: 'Hamilton entstand 1892 in Pennsylvania und ist heute Schweizer, Teil der Swatch Group. Die Marke pflegt amerikanischen Militär- und Fliegerstil, meist mit 80-Stunden-Werken.',
      mido: 'Mido, 1918 in Le Locle gegründet, ist die Marke der Swatch Group mit architekturinspirierten Designs und meist 80-Stunden-Werken.',
      laco: 'Laco aus Pforzheim, seit 1925, war einer der fünf Hersteller der deutschen Fliegeruhren der Vierziger und baut sie bis heute.',
      glycine: 'Glycine, 1914 in Biel gegründet, ist bekannt für die Airman, die Pilotenuhr der Fünfziger mit 24-Stunden-Zifferblatt.',
      timex: 'Timex, Erbin einer Fabrik in Connecticut von 1854, ist Amerikas Marke für bezahlbare Uhren und baut wieder Automatikuhren mit Miyota-Werken.',
      invicta: 'Invicta, ursprünglich aus der Schweiz und heute in Florida ansässig, verkauft sehr günstige Automatikuhren mit Seiko-NH35A-Werken.',
      bulova: 'Bulova, 1875 in New York gegründet und heute Teil der Citizen-Gruppe, baute Uhren für die US-Armee und legt sie neu auf.',
      vostok: 'Vostok baut seit 1942 Uhren in Tschistopol, Russland, mit eigenen Kalibern; die Amphibia ist eine Kult-Taucheruhr.',
      swatch: 'Swatch, 1983 zur Rettung der Schweizer Uhrenindustrie gegründet, hat mit dem Sistem51 ein von Maschinen montiertes Automatikwerk geschaffen.',
      junghans: 'Junghans, seit 1861 im Schwarzwald, baut die Max Bill, die bekannteste Bauhaus-Uhr.',
      'frederique-constant': 'Frederique Constant, 1988 in Genf gegründet, bietet klassische Schweizer Uhren zu moderaten Preisen.',
      alpina: 'Alpina aus Genf, seit 1883, konzentriert sich auf Sport- und Fliegeruhren.',
      victorinox: 'Victorinox, die Marke des Schweizer Taschenmessers, baut seit 1989 Uhren mit funktionaler Optik und ETA-Werken.',
    },
    genx: {
      brandIntro: (n, list, c) => {
        const e = extremos(list), cals = calibresDe(list), f = c.f;
        return `${list.length} Automatikuhren von ${n} im Katalog, mit einer Preisspanne von ${f.eur(e.min)} bis ${f.eur(e.max)}. ${cals.length === 1 ? `Alle haben das Kaliber ${cals[0]}.` : `Sie verwenden ${cals.length} Kaliber: ${und(cals)}.`} ${igual(list) ? `Alle haben ${f.h(e.reserva.reserveHours)} Gangreserve.` : `Die meiste Gangreserve hat die ${c.name(e.reserva)} mit ${f.h(e.reserva.reserveHours)}.`}`;
      },
      brandFaqs: (n, list, c): QA[] => {
        const e = extremos(list), f = c.f, z = zaf(list);
        return [
          [`Welche ist die günstigste Automatikuhr von ${n}?`, `Im Katalog die ${c.name(e.barato)} mit einer Preisspanne von ${f.price(e.barato.priceRange)}.`],
          [`Welche ${n} hat die meiste Gangreserve?`, igual(list) ? `Alle Modelle im Katalog haben ${f.h(e.reserva.reserveHours)}.` : `Die ${c.name(e.reserva)} mit ${f.h(e.reserva.reserveHours)}.`],
          [`Welche Kaliber verwendet ${n}?`, `In den Modellen des Katalogs: ${und(calibresDe(list))}.`],
          [`Hat ${n} Uhren mit Saphirglas?`, z ? `Ja: ${z} der ${list.length} Modelle im Katalog haben eines.` : 'Keines der Modelle im Katalog hat eines.'],
        ];
      },
    },
  },
  fr: {
    listados: {
      calidadPrecio: { slug: 'montres-automatiques-rapport-qualite-prix', h1: 'Les montres automatiques au meilleur rapport qualité-prix', title: 'Montres automatiques qualité-prix : les 12 qui offrent le plus par euro', description: 'Les montres automatiques du catalogue qui offrent le plus pour 100 € : verre, stop-seconde, réserve et étanchéité notés selon une formule publique.', criterio: 'chaque montre gagne des points selon ses valeurs (saphir 3, Hardlex 1,5, minéral 1, acrylique 0,5 ; stop-seconde 1 ; remontage manuel 0,5 ; 70 heures de réserve ou plus 2, 50 ou plus 1 ; 200 m 1,5, 100 m 1 ; 28 800 A/h 0,5 ; fond transparent 0,3), puis on divise par sa gamme de prix moyenne en centaines d’euros. Les douze premières apparaissent.' },
      menos200: { slug: 'montres-automatiques-moins-de-200-euros', h1: 'Montres automatiques à moins de 200 €', title: 'Montres automatiques à moins de 200 € : les moins chères comparées', description: 'Les montres automatiques du catalogue dont la gamme de prix moyenne est inférieure à 200 €, avec leur calibre et leurs dimensions.', criterio: 'montres dont la gamme de prix moyenne est inférieure à 200 €.' },
      menos400: { slug: 'montres-automatiques-moins-de-400-euros', h1: 'Montres automatiques à moins de 400 €', title: 'Montres automatiques à moins de 400 € : comparatif en chiffres', description: 'Montres automatiques à moins de 400 €, de Seiko, Orient, Citizen et d’autres, avec calibre, réserve, verre et étanchéité dans un même tableau.', criterio: 'montres dont la gamme de prix moyenne est inférieure à 400 €.' },
      menos800: { slug: 'montres-automatiques-moins-de-800-euros', h1: 'Montres automatiques à moins de 800 €', title: 'Montres automatiques à moins de 800 € : japonaises et suisses comparées', description: 'Montres automatiques à moins de 800 €, avec les premières suisses de 80 heures, comparées valeur par valeur.', criterio: 'montres dont la gamme de prix moyenne est inférieure à 800 €.' },
      gmt: { slug: 'montres-automatiques-gmt', h1: 'Montres automatiques GMT', title: 'Montres automatiques GMT : un second fuseau pour moins de 1 500 €', description: 'Les montres automatiques avec aiguille GMT du catalogue, pour lire un autre fuseau horaire, avec leur calibre et leurs dimensions.', criterio: 'montres avec une aiguille 24 heures pour un second fuseau horaire.' },
      alemanes: { slug: 'montres-automatiques-allemandes', h1: 'Montres automatiques allemandes', title: 'Montres automatiques allemandes : Laco et Junghans comparées', description: 'Montres automatiques de marques allemandes, des aviateurs Laco à la Junghans Max Bill, avec toutes leurs valeurs.', criterio: 'montres de marques allemandes.' },
      finos: { slug: 'montres-automatiques-fines', h1: 'Montres automatiques fines : 11 mm ou moins', title: 'Montres automatiques fines de 11 mm ou moins : les plus plates', description: 'Les montres automatiques les plus fines du catalogue, de 11 mm d’épaisseur ou moins, de la plus plate à la plus épaisse.', criterio: 'montres de 11 mm d’épaisseur ou moins, de la plus fine à la plus épaisse.' },
      fondoVisto: { slug: 'montres-automatiques-fond-transparent', h1: 'Montres automatiques à fond transparent', title: 'Montres automatiques à fond transparent pour voir le calibre', description: 'Montres automatiques à fond transparent, pour voir le mouvement et le rotor tourner, classées par prix.', criterio: 'montres avec un fond de boîtier transparent.' },
      buceoBaratos: { slug: 'montres-de-plongee-automatiques-pas-cheres', h1: 'Montres de plongée automatiques pas chères', title: 'Montres de plongée automatiques pas chères : moins de 500 €', description: 'Montres de plongée automatiques à moins de 500 €, avec leur étanchéité, leur verre et leur lunette comparés.', criterio: 'montres de style plongée dont la gamme de prix moyenne est inférieure à 500 €.' },
      vestirBaratos: { slug: 'montres-habillees-automatiques-pas-cheres', h1: 'Montres habillées automatiques pas chères', title: 'Montres habillées automatiques pas chères : moins de 500 €', description: 'Montres habillées automatiques à moins de 500 €, avec leur épaisseur, leur diamètre et leur verre dans un même tableau.', criterio: 'montres de style habillé dont la gamme de prix moyenne est inférieure à 500 €.' },
      suizosBaratos: { slug: 'montres-automatiques-suisses-pas-cheres', h1: 'Montres automatiques suisses à moins de 800 €', title: 'Montres automatiques suisses abordables : moins de 800 €', description: 'Les montres automatiques suisses les plus abordables du catalogue, à moins de 800 €, avec leur calibre et leur réserve de marche.', criterio: 'montres de marques suisses dont la gamme de prix moyenne est inférieure à 800 €.' },
      brazalete: { slug: 'montres-automatiques-bracelet-metal', h1: 'Montres automatiques sur bracelet acier ou titane', title: 'Montres automatiques sur bracelet métal : tous les modèles', description: 'Montres automatiques livrées sur bracelet acier ou titane, avec leurs dimensions et leurs valeurs comparées.', criterio: 'montres livrées sur bracelet acier ou titane.' },
      piel: { slug: 'montres-automatiques-bracelet-cuir', h1: 'Montres automatiques sur bracelet cuir', title: 'Montres automatiques sur bracelet cuir : modèles et valeurs', description: 'Montres automatiques livrées sur bracelet cuir, habillées, de terrain et d’aviateur, comparées en chiffres.', criterio: 'montres livrées sur bracelet cuir.' },
    },
    marcas: {
      seiko: 'Seiko, fondée à Tokyo en 1881, fabrique tout ce que contiennent ses montres, du calibre au verre Hardlex. C’est la marque qui compte le plus de modèles dans ce catalogue.',
      citizen: 'Citizen, née à Tokyo en 1918, possède Miyota, qui fournit des mouvements à la moitié du monde. Ses automatiques vont de la simple série 82 à la Series 8.',
      orient: 'Orient, fondée en 1950 et aujourd’hui filiale de Seiko Epson, fabrique ses propres calibres, y compris pour ses montres d’environ 300 €. Orient Star est sa gamme supérieure.',
      tissot: 'Tissot, au Locle depuis 1853, est la marque d’entrée du Swatch Group et celle qui a popularisé le Powermatic 80 de 80 heures.',
      hamilton: 'Hamilton est née en Pennsylvanie en 1892 et elle est aujourd’hui suisse, au sein du Swatch Group. Elle garde un style militaire et aéronautique américain, le plus souvent avec des calibres de 80 heures.',
      mido: 'Mido, fondée en 1918 au Locle, est la marque du Swatch Group aux dessins inspirés de l’architecture et, le plus souvent, aux calibres de 80 heures.',
      laco: 'Laco, à Pforzheim depuis 1925, fut l’un des cinq fabricants des montres d’aviateur allemandes des années 1940 et en fabrique toujours.',
      glycine: 'Glycine, fondée à Bienne en 1914, est connue pour l’Airman, la montre de pilote des années 1950 au cadran 24 heures.',
      timex: 'Timex, héritière d’une usine du Connecticut de 1854, est la marque américaine de montres abordables et revient aux automatiques avec des calibres Miyota.',
      invicta: 'Invicta, d’origine suisse et aujourd’hui basée en Floride, vend des automatiques très bon marché équipés du Seiko NH35A.',
      bulova: 'Bulova, fondée à New York en 1875 et aujourd’hui filiale de Citizen, a fabriqué des montres pour l’armée américaine et les réédite.',
      vostok: 'Vostok fabrique des montres à Tchistopol, en Russie, depuis 1942, avec ses propres calibres ; son Amphibia est une plongeuse culte.',
      swatch: 'Swatch, créée en 1983 pour sauver l’horlogerie suisse, a conçu avec le Sistem51 un automatique assemblé par des machines.',
      junghans: 'Junghans, en Forêt-Noire depuis 1861, produit la Max Bill, la montre Bauhaus la plus reconnaissable.',
      'frederique-constant': 'Frederique Constant, fondée à Genève en 1988, propose des montres suisses classiques à prix mesurés.',
      alpina: 'Alpina, genevoise depuis 1883, concentre sa collection sur les montres sport et d’aviateur.',
      victorinox: 'Victorinox, la marque du couteau suisse, fabrique des montres depuis 1989, au style fonctionnel et aux calibres ETA.',
    },
    genx: {
      brandIntro: (n, list, c) => {
        const e = extremos(list), cals = calibresDe(list), f = c.f;
        return `${list.length} montres automatiques ${n} au catalogue, de ${f.eur(e.min)} à ${f.eur(e.max)} en gamme de prix indicative. ${cals.length === 1 ? `Toutes utilisent le calibre ${cals[0]}.` : `Elles utilisent ${cals.length} calibres : ${et(cals)}.`} ${igual(list) ? `Toutes ont ${f.h(e.reserva.reserveHours)} de réserve de marche.` : `Celle qui a le plus de réserve est ${laFr(c.name(e.reserva))}, avec ${f.h(e.reserva.reserveHours)}.`}`;
      },
      brandFaqs: (n, list, c): QA[] => {
        const e = extremos(list), f = c.f, z = zaf(list);
        return [
          [`Quelle est la montre automatique ${n} la moins chère ?`, `Au catalogue, ${laFr(c.name(e.barato))}, avec une gamme de prix indicative de ${f.price(e.barato.priceRange)}.`],
          [`Quelle ${n} a le plus de réserve de marche ?`, igual(list) ? `Tous les modèles du catalogue ont ${f.h(e.reserva.reserveHours)}.` : `${LaFr(c.name(e.reserva))}, avec ${f.h(e.reserva.reserveHours)}.`],
          [`Quels calibres utilise ${n} ?`, `Dans les modèles du catalogue : ${et(calibresDe(list))}.`],
          [`${n} a-t-elle des montres avec verre saphir ?`, z ? `Oui : ${z} des ${list.length} modèles du catalogue en ont un.` : 'Aucun des modèles du catalogue n’en a.'],
        ];
      },
    },
  },
  it: {
    listados: {
      calidadPrecio: { slug: 'orologi-automatici-qualita-prezzo', h1: 'Gli orologi automatici con il miglior rapporto qualità-prezzo', title: 'Orologi automatici qualità-prezzo: i 12 che offrono di più per euro', description: 'Gli orologi automatici del catalogo che offrono di più ogni 100 €: vetro, stop secondi, riserva e impermeabilità valutati con una formula pubblica.', criterio: 'ogni orologio guadagna punti per i suoi dati (zaffiro 3, Hardlex 1,5, minerale 1, acrilico 0,5; stop secondi 1; carica manuale 0,5; 70 ore di riserva o più 2, 50 o più 1; 200 m 1,5, 100 m 1; 28.800 A/h 0,5; fondello a vista 0,3), diviso per la fascia di prezzo media in centinaia di euro. Compaiono i primi dodici.' },
      menos200: { slug: 'orologi-automatici-sotto-200-euro', h1: 'Orologi automatici sotto i 200 €', title: 'Orologi automatici sotto i 200 €: i più economici a confronto', description: 'Gli orologi automatici del catalogo con una fascia di prezzo media sotto i 200 €, con calibro e misure.', criterio: 'orologi la cui fascia di prezzo media è inferiore a 200 €.' },
      menos400: { slug: 'orologi-automatici-sotto-400-euro', h1: 'Orologi automatici sotto i 400 €', title: 'Orologi automatici sotto i 400 €: confronto in cifre', description: 'Orologi automatici sotto i 400 €, di Seiko, Orient, Citizen e altri, con calibro, riserva, vetro e impermeabilità nella stessa tabella.', criterio: 'orologi la cui fascia di prezzo media è inferiore a 400 €.' },
      menos800: { slug: 'orologi-automatici-sotto-800-euro', h1: 'Orologi automatici sotto gli 800 €', title: 'Orologi automatici sotto gli 800 €: giapponesi e svizzeri a confronto', description: 'Orologi automatici sotto gli 800 €, con i primi svizzeri da 80 ore, confrontati dato per dato.', criterio: 'orologi la cui fascia di prezzo media è inferiore a 800 €.' },
      gmt: { slug: 'orologi-automatici-gmt', h1: 'Orologi automatici GMT', title: 'Orologi automatici GMT: un secondo fuso sotto i 1.500 €', description: 'Gli orologi automatici con lancetta GMT del catalogo, per leggere un altro fuso orario, con calibro e misure.', criterio: 'orologi con lancetta delle 24 ore per un secondo fuso orario.' },
      alemanes: { slug: 'orologi-automatici-tedeschi', h1: 'Orologi automatici tedeschi', title: 'Orologi automatici tedeschi: Laco e Junghans a confronto', description: 'Orologi automatici di marchi tedeschi, dagli aviatori Laco al Junghans Max Bill, con tutti i dati.', criterio: 'orologi di marchi tedeschi.' },
      finos: { slug: 'orologi-automatici-sottili', h1: 'Orologi automatici sottili: 11 mm o meno', title: 'Orologi automatici sottili da 11 mm o meno: i più piatti', description: 'Gli orologi automatici più sottili del catalogo, da 11 mm di spessore o meno, dal più piatto al più spesso.', criterio: 'orologi da 11 mm di spessore o meno, dal più sottile al più spesso.' },
      fondoVisto: { slug: 'orologi-automatici-fondello-a-vista', h1: 'Orologi automatici con fondello a vista', title: 'Orologi automatici con fondello trasparente per vedere il calibro', description: 'Orologi automatici con fondello a vista, per vedere il movimento e il rotore girare, ordinati per prezzo.', criterio: 'orologi con fondello trasparente.' },
      buceoBaratos: { slug: 'orologi-subacquei-automatici-economici', h1: 'Orologi subacquei automatici economici', title: 'Orologi subacquei automatici economici: sotto i 500 €', description: 'Orologi subacquei automatici sotto i 500 €, con impermeabilità, vetro e lunetta a confronto.', criterio: 'orologi in stile subacqueo con una fascia di prezzo media sotto i 500 €.' },
      vestirBaratos: { slug: 'orologi-eleganti-automatici-economici', h1: 'Orologi eleganti automatici economici', title: 'Orologi eleganti automatici economici: sotto i 500 €', description: 'Orologi automatici eleganti sotto i 500 €, con spessore, diametro e vetro nella stessa tabella.', criterio: 'orologi in stile elegante con una fascia di prezzo media sotto i 500 €.' },
      suizosBaratos: { slug: 'orologi-automatici-svizzeri-economici', h1: 'Orologi automatici svizzeri sotto gli 800 €', title: 'Orologi automatici svizzeri economici: sotto gli 800 €', description: 'Gli orologi automatici svizzeri più accessibili del catalogo, sotto gli 800 €, con calibro e riserva di carica.', criterio: 'orologi di marchi svizzeri con una fascia di prezzo media sotto gli 800 €.' },
      brazalete: { slug: 'orologi-automatici-con-bracciale', h1: 'Orologi automatici con bracciale in acciaio o titanio', title: 'Orologi automatici con bracciale in metallo: tutti i modelli', description: 'Orologi automatici forniti con bracciale in acciaio o titanio, con misure e dati a confronto.', criterio: 'orologi forniti con bracciale in acciaio o titanio.' },
      piel: { slug: 'orologi-automatici-cinturino-in-pelle', h1: 'Orologi automatici con cinturino in pelle', title: 'Orologi automatici con cinturino in pelle: modelli e dati', description: 'Orologi automatici forniti con cinturino in pelle, eleganti, da campo e da aviatore, confrontati in cifre.', criterio: 'orologi forniti con cinturino in pelle.' },
    },
    marcas: {
      seiko: 'Seiko, fondata a Tokyo nel 1881, produce tutto ciò che c’è nei suoi orologi, dal calibro al vetro Hardlex. È il marchio con più modelli in questo catalogo.',
      citizen: 'Citizen, nata a Tokyo nel 1918, possiede Miyota, che fornisce movimenti a mezzo mondo. I suoi automatici vanno dalla semplice serie 82 alla Series 8.',
      orient: 'Orient, fondata nel 1950 e oggi parte di Seiko Epson, produce i propri calibri, anche per i suoi orologi da circa 300 €. Orient Star è la sua gamma alta.',
      tissot: 'Tissot, a Le Locle dal 1853, è il marchio d’ingresso dello Swatch Group e quello che ha reso famoso il Powermatic 80 da 80 ore.',
      hamilton: 'Hamilton è nata in Pennsylvania nel 1892 ed è oggi svizzera, parte dello Swatch Group. Mantiene lo stile militare e aeronautico americano, quasi sempre con calibri da 80 ore.',
      mido: 'Mido, fondata nel 1918 a Le Locle, è il marchio dello Swatch Group con design ispirati all’architettura e, nella maggior parte dei modelli, calibri da 80 ore.',
      laco: 'Laco, a Pforzheim dal 1925, fu uno dei cinque produttori degli orologi da aviatore tedeschi degli anni Quaranta e li produce ancora.',
      glycine: 'Glycine, fondata a Bienne nel 1914, è nota per l’Airman, l’orologio da pilota degli anni Cinquanta con quadrante a 24 ore.',
      timex: 'Timex, erede di una fabbrica del Connecticut del 1854, è il marchio americano di orologi accessibili ed è tornata agli automatici con calibri Miyota.',
      invicta: 'Invicta, di origine svizzera e oggi con sede in Florida, vende automatici molto economici con calibri Seiko NH35A.',
      bulova: 'Bulova, fondata a New York nel 1875 e oggi parte del gruppo Citizen, produceva orologi per l’esercito statunitense e ora li ripropone.',
      vostok: 'Vostok produce orologi a Čistopol, in Russia, dal 1942, con calibri propri; il suo Amphibia è un subacqueo di culto.',
      swatch: 'Swatch, nata nel 1983 per salvare l’orologeria svizzera, ha creato con il Sistem51 un automatico assemblato da macchine.',
      junghans: 'Junghans, nella Foresta Nera dal 1861, produce il Max Bill, l’orologio Bauhaus più riconoscibile.',
      'frederique-constant': 'Frederique Constant, fondata a Ginevra nel 1988, offre orologi svizzeri classici a prezzi contenuti.',
      alpina: 'Alpina, ginevrina dal 1883, concentra la sua collezione su orologi sportivi e da aviatore.',
      victorinox: 'Victorinox, il marchio del coltellino svizzero, produce orologi dal 1989, con estetica funzionale e calibri ETA.',
    },
    genx: {
      brandIntro: (n, list, c) => {
        const e = extremos(list), cals = calibresDe(list), f = c.f;
        return `${list.length} orologi automatici ${n} nel catalogo, da ${f.eur(e.min)} a ${f.eur(e.max)} di fascia di prezzo indicativa. ${cals.length === 1 ? `Montano tutti il calibro ${cals[0]}.` : `Usano ${cals.length} calibri: ${e_(cals)}.`} ${igual(list) ? `Hanno tutti ${f.h(e.reserva.reserveHours)} di riserva di carica.` : `Quello con più riserva è ${ilIt(c.name(e.reserva))}, con ${f.h(e.reserva.reserveHours)}.`}`;
      },
      brandFaqs: (n, list, c): QA[] => {
        const e = extremos(list), f = c.f, z = zaf(list);
        return [
          [`Qual è l’orologio automatico ${n} più economico?`, `Nel catalogo, ${ilIt(c.name(e.barato))}, con una fascia di prezzo indicativa di ${f.price(e.barato.priceRange)}.`],
          [`Quale ${n} ha più riserva di carica?`, igual(list) ? `Tutti i modelli del catalogo hanno ${f.h(e.reserva.reserveHours)}.` : `${IlIt(c.name(e.reserva))}, con ${f.h(e.reserva.reserveHours)}.`],
          [`Quali calibri usa ${n}?`, `Nei modelli del catalogo: ${e_(calibresDe(list))}.`],
          [`${n} ha orologi con vetro zaffiro?`, z ? `Sì: ${z} dei ${list.length} modelli del catalogo lo hanno.` : 'Nessuno dei modelli del catalogo lo ha.'],
        ];
      },
    },
  },
};
