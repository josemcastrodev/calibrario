// Colección de relojes: valida src/data/relojes.json con Zod al compilar.
import { defineCollection, z } from 'astro:content';
import { file } from 'astro/loaders';

const reloj = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  brand: z.string(),
  model: z.string(),
  ref: z.string(),
  asin: z.string().regex(/^[A-Z0-9]{10}$/).nullable(),
  type: z.enum(['Buceo', 'Vestir', 'Campo', 'Deportivo', 'Piloto']),
  priceRange: z.tuple([z.number().positive(), z.number().positive()]),
  caliber: z.string(),
  caliberMaker: z.string(),
  reserveHours: z.number().positive(),
  bph: z.number().int().positive(),
  crystal: z.enum(['Zafiro', 'Hardlex', 'Mineral', 'Acrílico']),
  waterResistanceM: z.number().int().nonnegative(),
  diameterMm: z.number().positive(),
  thicknessMm: z.number().positive().nullable(),
  lugToLugMm: z.number().positive().nullable(),
  lugWidthMm: z.number().positive().nullable(),
  hacking: z.boolean(),
  handWinding: z.boolean(),
  origin: z.string(),
  movementOrigin: z.string(),
  rotatingBezel: z.boolean(),
  bezelNote: z.string().nullable(),
  caseMaterial: z.string(),
  strap: z.string(),
  dialColor: z.string(),
  complications: z.array(z.string()),
  exhibitionCaseback: z.boolean().nullable(),
  images: z.array(z.string()),
  summary: z.string().max(220),
  verified: z.boolean(),
  dataNotes: z.string().optional(),
  /** Fecha en que se comprobó a mano que el ASIN tiene stock y botón de compra en Amazon.es. */
  amazonChecked: z.string().optional(),
});

export type Reloj = z.infer<typeof reloj>;

export const collections = {
  relojes: defineCollection({ loader: file('src/data/relojes.json'), schema: reloj }),
};
