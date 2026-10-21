// Cálculos que comparten los textos generados de todos los idiomas: solo cambian las frases.
import type { Reloj } from '../content.config';

export const mid = (r: Pick<Reloj, 'priceRange'>) => (r.priceRange[0] + r.priceRange[1]) / 2;
export const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
export const low1 = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

/** «a, b y c» / «a, b and c». */
export const joinWith = (conj: string) => (items: string[]) =>
  items.length <= 1 ? items.join('') : `${items.slice(0, -1).join(', ')} ${conj} ${items[items.length - 1]}`;

export const CRYSTAL_RANK: Record<string, number> = { Zafiro: 3, Hardlex: 2, Mineral: 1, Acrílico: 0 };

/** Los extremos de una lista de relojes, para los textos de listados y calibres. */
export function extremos(list: Reloj[]) {
  const porPrecio = [...list].sort((a, b) => a.priceRange[0] - b.priceRange[0]);
  return {
    barato: porPrecio[0],
    reserva: [...list].sort((a, b) => b.reserveHours - a.reserveHours || a.priceRange[0] - b.priceRange[0])[0],
    fino: [...list].filter((r) => r.thicknessMm).sort((a, b) => a.thicknessMm! - b.thicknessMm!)[0] as Reloj | undefined,
    wr: [...list].sort((a, b) => b.waterResistanceM - a.waterResistanceM)[0],
    zafiro: list.filter((r) => r.crystal === 'Zafiro').length,
    min: Math.min(...list.map((r) => r.priceRange[0])),
    max: Math.max(...list.map((r) => r.priceRange[1])),
  };
}

export type SizeTx = {
  same: (a: Reloj, b: Reloj) => string;
  smaller: (s: Reloj, big: Reloj) => string;
  mixed: (shortLug: Reloj, longLug: Reloj) => string;
  thin: (t: Reloj, k: Reloj, d: number) => string;
  wrist: string;
  shirt: string;
};

/** Frases de tamaño y grosor de una comparativa A frente a B. */
export function sizeLines(a: Reloj, b: Reloj, puntos: string[], paraA: string[], paraB: string[], tx: SizeTx) {
  const dd = a.diameterMm - b.diameterMm, dl = (a.lugToLugMm ?? 0) - (b.lugToLugMm ?? 0);
  if (Math.abs(dd) < 1 && Math.abs(dl) < 1.5) puntos.push(tx.same(a, b));
  else if (Math.sign(dd) === Math.sign(dl) || Math.abs(dl) < 1.5 || Math.abs(dd) < 1) {
    const ref = Math.abs(dl) >= 1.5 ? dl : dd;
    const [s, big] = ref < 0 ? [a, b] : [b, a];
    puntos.push(tx.smaller(s, big));
    (s === a ? paraA : paraB).push(tx.wrist);
  } else {
    const [s, l] = dl < 0 ? [a, b] : [b, a];
    puntos.push(tx.mixed(s, l));
    (s === a ? paraA : paraB).push(tx.wrist);
  }
  if (a.thicknessMm && b.thicknessMm && Math.abs(a.thicknessMm - b.thicknessMm) >= 0.8) {
    const [t, k] = a.thicknessMm < b.thicknessMm ? [a, b] : [b, a];
    puntos.push(tx.thin(t, k, Math.abs(a.thicknessMm - b.thicknessMm)));
    const arr = t === a ? paraA : paraB;
    if (!arr.includes(tx.wrist)) arr.push(tx.shirt);
  }
}

/** Contorno mínimo de muñeca (cm) para que el entre asas quede dentro: ancho ≈ 0,33 × contorno, margen del 5 %. */
export const minWristCm = (r: Reloj) => (r.lugToLugMm ? Math.ceil((r.lugToLugMm / 0.95 / 3.3) * 2) / 2 : null);

type QA = [string, string];
export type VersusTx = {
  cheaper: (cheap: Reloj, dear: Reloj, diff: number) => string;
  samePrice: (a: Reloj, b: Reloj) => string;
  wantCheaper: string;
  sameCaliber: (a: Reloj) => string;
  diffCaliber: (a: Reloj, b: Reloj) => string;
  moreReserve: (m: Reloj, n: Reloj, diff: number) => string;
  wantReserve: string;
  crystal: (m: Reloj, n: Reloj) => string;
  preferCrystal: (m: Reloj) => string;
  water: (m: Reloj, n: Reloj) => string;
  diving: string;
  size: SizeTx;
  hacking: (m: Reloj) => string;
  wantHacking: string;
  origin: (a: Reloj, b: Reloj) => string;
  faqReserve: (a: Reloj, b: Reloj, more: Reloj | null) => QA;
  faqCheaper: (cheap: Reloj, other: Reloj) => QA;
  faqWater: (a: Reloj, b: Reloj, more: Reloj | null) => QA;
  faqSmall: (small: Reloj) => QA;
};

/** Las diferencias de una comparativa A frente a B, calculadas solo con los datos. */
export function versusCore(a: Reloj, b: Reloj, tx: VersusTx) {
  const puntos: string[] = [], paraA: string[] = [], paraB: string[] = [];
  const dp = Math.round(mid(b) - mid(a));
  if (Math.abs(dp) >= 20) {
    const [cheap, dear] = dp > 0 ? [a, b] : [b, a];
    puntos.push(tx.cheaper(cheap, dear, Math.abs(dp)));
    (cheap === a ? paraA : paraB).push(tx.wantCheaper);
  } else puntos.push(tx.samePrice(a, b));
  puntos.push(a.caliber === b.caliber ? tx.sameCaliber(a) : tx.diffCaliber(a, b));
  const dr = a.reserveHours - b.reserveHours;
  if (Math.abs(dr) >= 5) {
    const [m, n] = dr > 0 ? [a, b] : [b, a];
    puntos.push(tx.moreReserve(m, n, Math.abs(dr)));
    (m === a ? paraA : paraB).push(tx.wantReserve);
  }
  if (a.crystal !== b.crystal) {
    const [m, n] = CRYSTAL_RANK[a.crystal] > CRYSTAL_RANK[b.crystal] ? [a, b] : [b, a];
    puntos.push(tx.crystal(m, n));
    (m === a ? paraA : paraB).push(tx.preferCrystal(m));
  }
  if (a.waterResistanceM !== b.waterResistanceM) {
    const [m, n] = a.waterResistanceM > b.waterResistanceM ? [a, b] : [b, a];
    puntos.push(tx.water(m, n));
    if (m.waterResistanceM >= 200 && n.waterResistanceM < 200) (m === a ? paraA : paraB).push(tx.diving);
  }
  sizeLines(a, b, puntos, paraA, paraB, tx.size);
  if (a.hacking !== b.hacking) {
    const m = a.hacking ? a : b;
    puntos.push(tx.hacking(m));
    (m === a ? paraA : paraB).push(tx.wantHacking);
  }
  if (a.origin !== b.origin) puntos.push(tx.origin(a, b));
  const moreR = a.reserveHours === b.reserveHours ? null : a.reserveHours > b.reserveHours ? a : b;
  const cheap = mid(a) <= mid(b) ? a : b;
  const moreW = a.waterResistanceM === b.waterResistanceM ? null : a.waterResistanceM > b.waterResistanceM ? a : b;
  const small = (a.lugToLugMm ?? a.diameterMm) <= (b.lugToLugMm ?? b.diameterMm) ? a : b;
  const faqs: QA[] = [tx.faqReserve(a, b, moreR), tx.faqCheaper(cheap, cheap === a ? b : a), tx.faqWater(a, b, moreW), tx.faqSmall(small)];
  return { puntos, paraA, paraB, faqs };
}
