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
    hours: z.number().nonnegative(),
    date: z.string(),
    note: z.string(),
    photo: z.string().optional(),
  }),
});

// "More Work" (the gallery) used to live here too, one file per photo — moved
// to a plain list field in site.json (`gallery`) so the admin panel's list
// widget gives real drag-to-reorder, which a folder collection like this one
// can't offer (its entry list only supports a fixed alphabetical/sort-field
// order, not a persisted custom one). See git history for the old
// `src/content/gallery/*.md` files this replaced.

export const collections = { pieces };
