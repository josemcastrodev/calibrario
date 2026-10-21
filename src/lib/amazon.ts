// Capa de Amazon. Hoy solo construye enlaces de afiliado; cuando la cuenta tenga acceso a la PA-API,
// `fetchProduct` devolverá precio, imagen y disponibilidad con caché, y las fichas los mostrarán.
// Reglas: etiqueta en AMAZON_TAG, rel="sponsored noopener" en todos los enlaces, nunca un precio que no venga de la API.

const TAG = import.meta.env.AMAZON_TAG ?? 'calibrario-21';
const STORE = import.meta.env.AMAZON_STORE ?? 'www.amazon.es';

export interface Linkable { asin: string | null; brand: string; ref: string }

/** Enlace al producto exacto si hay ASIN; si no, a la búsqueda por marca y referencia. */
export function affiliateUrl(r: Linkable): string {
  return r.asin
    ? `https://${STORE}/dp/${r.asin}?tag=${TAG}`
    : `https://${STORE}/s?k=${encodeURIComponent(`${r.brand} ${r.ref}`)}&tag=${TAG}`;
}

export interface ProductData {
  asin: string;
  price: { amount: number; currency: string; display: string } | null;
  image: { url: string; width: number; height: number } | null;
  available: boolean;
  fetchedAt: string;
}

/**
 * Pendiente de la PA-API (requiere ventas previas). Devuelve null hasta entonces, así las plantillas
 * muestran la gama orientativa y «Ver precio en Amazon». Cuando se conecte: firmar la petición (AWS v4),
 * pedir Offers.Listings.Price, Images.Primary.Large y Offers.Listings.Availability, y cachear 24 h en build.
 */
export async function fetchProduct(_asin: string): Promise<ProductData | null> {
  return null;
}
