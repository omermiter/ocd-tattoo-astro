// @ts-check
import { defineConfig } from 'astro/config';
import { existsSync } from 'node:fs';
import { readdir, stat } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

import react from '@astrojs/react';

// Prints how many redesign pixel-art assets (ASSETS-TO-DRAW.md) are still
// unfilled after every build — the build-time half of the placeholder
// system described in REDESIGN-PLAN.md §7.
//
// This list is intentionally a plain duplicate of src/lib/placeholders.ts's
// PLACEHOLDER_ASSETS, not an import of it: this hook runs in a raw Node ESM
// context after Astro's Vite pipeline has already torn down, which can't
// resolve a .ts module the way the site's own components can. Keep the two
// lists in sync by hand if the asset roster changes.
const REDESIGN_ASSETS = [
  { id: 'mark', filename: 'mark.png', width: 20, height: 40, priority: 'P0' },
  { id: 'favicon', filename: 'favicon.png', width: 32, height: 32, priority: 'P0' },
  { id: 'icon-instagram', filename: 'icon-instagram.png', width: 16, height: 16, priority: 'P1' },
  { id: 'icon-whatsapp', filename: 'icon-whatsapp.png', width: 16, height: 16, priority: 'P1' },
  { id: '404', filename: '404.png', width: 192, height: 108, priority: 'P1' },
  // pending-mark.png intentionally excluded — see src/lib/placeholders.ts
];

function placeholderSummary() {
  return {
    name: 'placeholder-summary',
    hooks: {
      'astro:build:done': async () => {
        const pixelArtDir = fileURLToPath(new URL('./public/pixel-art/', import.meta.url));
        const missing = REDESIGN_ASSETS.filter((a) => !existsSync(`${pixelArtDir}${a.filename}`));
        if (missing.length === 0) {
          console.log('\n✓ 0 placeholders remaining — every redesign asset is drawn.\n');
          return;
        }
        console.log(`\n${missing.length} placeholders remaining:`);
        for (const a of missing) {
          console.log(`  [${a.priority}] ${a.id} → public/pixel-art/${a.filename} (${a.width}×${a.height})`);
        }
        console.log('');
      },
    },
  };
}

// CMS-uploaded photos land in /public/{gallery,pieces,uploads} at whatever
// resolution the artist's phone shoots (some 19MB+, 4000px+ on the long
// edge) and get served straight through by GitHub Pages, since Astro's
// astro:assets pipeline only optimizes images imported from src/, never
// public/. This hook runs after the static build, walks those same three
// directories inside dist/ (never touching the public/ originals — the CMS
// and Decap's media library both operate on public/, not dist/), and
// writes a resized, WebP-encoded sibling next to each PNG/JPEG. Components
// reference the sibling directly via toWebp() (src/lib/media.ts); the
// original stays in dist/ unused by any page — harmless dead weight,
// kept only so hot-linked/cached/OG URLs at the old extension don't 404.
const IMAGE_DIRS = [
  { dir: 'gallery', maxEdge: 1200, quality: 80 },
  { dir: 'pieces', maxEdge: 1200, quality: 80 },
  { dir: 'uploads', maxEdge: 2000, quality: 82 },
];
const RASTER_EXT = new Set(['.png', '.jpg', '.jpeg']);

/** @param {string} root @returns {Promise<string[]>} */
async function walkImages(root) {
  let entries;
  try {
    entries = await readdir(root, { withFileTypes: true });
  } catch {
    return [];
  }
  /** @type {string[]} */
  const files = [];
  for (const entry of entries) {
    const full = join(root, entry.name);
    if (entry.isDirectory()) files.push(...(await walkImages(full)));
    else if (RASTER_EXT.has(extname(entry.name).toLowerCase())) files.push(full);
  }
  return files;
}

function optimizeImages() {
  return {
    name: 'optimize-images',
    hooks: {
      'astro:build:done': async (/** @type {{ dir: URL }} */ { dir }) => {
        const outRoot = fileURLToPath(dir);
        let before = 0;
        let after = 0;
        let count = 0;

        for (const { dir: sub, maxEdge, quality } of IMAGE_DIRS) {
          const files = await walkImages(join(outRoot, sub));
          for (const file of files) {
            const webpPath = file.replace(/\.(png|jpe?g)$/i, '.webp');
            const image = sharp(file).rotate();
            const meta = await image.metadata();
            const oversized = (meta.width ?? 0) > maxEdge || (meta.height ?? 0) > maxEdge;
            const pipeline = oversized
              ? image.resize({ width: maxEdge, height: maxEdge, fit: 'inside', withoutEnlargement: true })
              : image;
            await pipeline.webp({ quality }).toFile(webpPath);

            before += (await stat(file)).size;
            after += (await stat(webpPath)).size;
            count++;
          }
        }

        if (count === 0) return;
        const mb = (/** @type {number} */ n) => `${(n / 1024 / 1024).toFixed(1)} MB`;
        console.log(`\n✓ Optimized ${count} image(s) to WebP: ${mb(before)} → ${mb(after)}\n`);
      },
    },
  };
}

// Custom domain (see public/CNAME) — served from the root, not a GitHub
// Pages project subpath, so base stays "/".
export default defineConfig({
  base: '/',
  trailingSlash: 'always',
  site: 'https://ocdtattoo.com',
  integrations: [placeholderSummary(), optimizeImages(), react()],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'he'],
    routing: {
      // English stays at "/" (no "/en/" prefix, matches every existing
      // link/bookmark/indexed URL); Hebrew lives at "/he/".
      prefixDefaultLocale: false,
    },
  },
});