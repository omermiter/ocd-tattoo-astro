import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: ({ image }) =>
    z.object({
      serial: z.string(),
      title_he: z.string(),
      title_en: z.string(),
      dateRange: z.string(),
      placement_he: z.string(),
      placement_en: z.string(),
      sessions: z.number().int().positive(),
      hours: z.number().positive(),
      healedAt_he: z.string(),
      healedAt_en: z.string(),
      images: z.object({
        reference: image(),
        stencil: image(),
        fresh: image(),
        healed: image(),
      }),
      artistNote_he: z.string(),
      artistNote_en: z.string(),
      featured: z.boolean().default(false),
    }),
});

const flash = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/flash' }),
  schema: ({ image }) =>
    z.object({
      serial: z.string(),
      title_he: z.string(),
      title_en: z.string(),
      releaseAt: z.string(),
      status: z.enum(['sealed', 'available', 'retired']),
      placementSuggested: z.array(z.string()),
      approxSize: z.string(),
      image: image(),
      claimedCity_he: z.string().default(''),
      claimedCity_en: z.string().default(''),
      claimedDate: z.string().default(''),
    }),
});

export const collections = { work, flash };
