import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// `photo` is a plain relative path string (not Astro's `image()` helper) on
// purpose: only ~2 real pieces exist right now and neither has a photo file
// yet. Astro's `image()` schema validates the file exists at build time and
// fails the build if it doesn't — a plain string lets an entry ship today
// with a considered "not photographed yet" panel (see PhotoOrPlaceholder.astro)
// and pick up the real photo later with zero schema changes.
const pieces = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pieces' }),
  schema: z.object({
    serial: z.string(),
    title: z.string(),
    placement: z.string(),
    size: z.string(),
    sessions: z.number().int().positive(),
    hours: z.number().positive(),
    date: z.string(),
    note: z.string(),
    photo: z.string().optional(),
  }),
});

// gridSize is the actual pixel-grid resolution the design is built on — a
// real spec, not decoration, and the most literal expression of the site's
// "every square" precision thesis. Four tiers cover the realistic range for
// flash at this physical size (6–13cm); nothing finer than 32×32 reads as a
// clean tattoo at that scale.
export const GRID_SIZES = ['8×8', '16×16', '24×24', '32×32'] as const;

const flash = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/flash' }),
  schema: z.object({
    serial: z.string(),
    title: z.string(),
    status: z.enum(['available', 'claimed']),
    size: z.string(),
    gridSize: z.enum(GRID_SIZES),
    placement: z.string(),
    claimedDate: z.string().default(''),
    photo: z.string().optional(),
  }),
});

export const collections = { pieces, flash };
