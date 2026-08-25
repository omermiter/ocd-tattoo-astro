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

const flash = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/flash' }),
  schema: z.object({
    serial: z.string(),
    title: z.string(),
    status: z.enum(['available', 'claimed']),
    size: z.string(),
    placement: z.string(),
    claimedDate: z.string().default(''),
    photo: z.string().optional(),
  }),
});

export const collections = { pieces, flash };
