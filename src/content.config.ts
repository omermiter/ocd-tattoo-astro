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

// Rest of the Works — a lighter-weight companion to `pieces`: just a photo
// and a short caption, no placement/sessions/hours/note fields. For work
// that's worth showing but not worth the full documentation treatment.
// The former "Register" flash designs live here too now (folded in — see
// git history for the standalone `flash` collection this replaced): a
// design being available to book isn't tracked as page state anymore, so it
// doesn't need its own schema, just a photo and a title like everything
// else in this collection.
const gallery = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/gallery' }),
  schema: z.object({
    title: z.string(),
    photo: z.string(),
  }),
});

export const collections = { pieces, gallery };
