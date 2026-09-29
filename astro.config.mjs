// @ts-check
import { defineConfig } from 'astro/config';
import { execFile } from 'node:child_process';
import { existsSync } from 'node:fs';
import { readdir, rename, rm, stat } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import sharp from 'sharp';

const execFileAsync = promisify(execFile);

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
// writes resized, WebP-encoded sibling(s) next to each PNG/JPEG. Components
// reference the sibling(s) via toWebp()/pieceSrcset() (src/lib/media.ts);
// the original stays in dist/ unused by any page — harmless dead weight,
// kept only so hot-linked/cached/OG URLs at the old extension don't 404.
//
// pieces gets real srcset widths instead of one maxEdge: PieceCard.astro
// displays it at a fixed 26rem column on desktop but full-bleed on mobile
// (see its 800px breakpoint), so a single size is either soft on desktop
// retina or, per PageSpeed's "Improve image delivery" audit, oversized for
// mobile. PIECE_WIDTHS must match src/lib/media.ts's copy by hand — this
// hook runs in a raw Node ESM context post-build, after Astro's Vite
// pipeline has torn down, same reason REDESIGN_ASSETS above is a plain
// duplicate rather than an import.
const PIECE_WIDTHS = [600, 1100];
const IMAGE_DIRS = [
  { dir: 'gallery', maxEdge: 1200, quality: 80 },
  { dir: 'pieces', widths: PIECE_WIDTHS, quality: 80 },
  { dir: 'uploads', maxEdge: 2000, quality: 82 },
];
const RASTER_EXT = new Set(['.png', '.jpg', '.jpeg']);

/** @param {string} root @param {Set<string>} extensions @returns {Promise<string[]>} */
async function walkFiles(root, extensions) {
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
    if (entry.isDirectory()) files.push(...(await walkFiles(full, extensions)));
    else if (extensions.has(extname(entry.name).toLowerCase())) files.push(full);
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

        for (const { dir: sub, maxEdge, widths, quality } of IMAGE_DIRS) {
          const files = await walkFiles(join(outRoot, sub), RASTER_EXT);
          for (const file of files) {
            before += (await stat(file)).size;
            const meta = await sharp(file).rotate().metadata();

            if (widths) {
              // srcset mode: each output's actual pixel width must equal
              // its filename's w-descriptor, so the browser's candidate
              // picker (viewport width × DPR) is comparing real numbers —
              // resize by width alone (height follows the source aspect
              // ratio), never a width+height bounding box.
              for (const w of widths) {
                const outPath = file.replace(/\.(png|jpe?g)$/i, `-${w}w.webp`);
                const pipeline =
                  (meta.width ?? 0) > w ? sharp(file).rotate().resize({ width: w, withoutEnlargement: true }) : sharp(file).rotate();
                await pipeline.webp({ quality }).toFile(outPath);
                after += (await stat(outPath)).size;
              }
            } else {
              const outPath = file.replace(/\.(png|jpe?g)$/i, '.webp');
              const oversized = (meta.width ?? 0) > maxEdge || (meta.height ?? 0) > maxEdge;
              const pipeline = oversized
                ? sharp(file).rotate().resize({ width: maxEdge, height: maxEdge, fit: 'inside', withoutEnlargement: true })
                : sharp(file).rotate();
              await pipeline.webp({ quality }).toFile(outPath);
              after += (await stat(outPath)).size;
            }
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

// The hero background video (site.json's bannerVideo, currently
// public/uploads/hero-banner.mp4) is CMS-uploaded straight from a phone,
// same problem as the images above — one existing clip shipped at 720p/
// ~1.27 Mbps H.264, ~6.6 MB for a 41s muted, looping background loop.
// A CRF-based re-encode (same resolution/framerate — this only tightens
// compression, no visible quality loss on a background loop even in its
// grainiest frames, confirmed by eye against the original before writing
// this) got that down ~67%. Runs in place on dist/ (never public/, same
// rule as optimizeImages) via a plain ffmpeg subprocess — no JS video
// encoder exists that's worth adding as a dependency for one file. GitHub's
// hosted Actions runners ship ffmpeg preinstalled; if it's ever missing
// (e.g. a local build), this skips compression rather than failing the
// build — the original, uncompressed video still ships, just not shrunk.
const VIDEO_DIRS = ['uploads'];
const VIDEO_EXT = new Set(['.mp4']);

function optimizeVideo() {
  return {
    name: 'optimize-video',
    hooks: {
      'astro:build:done': async (/** @type {{ dir: URL }} */ { dir }) => {
        const outRoot = fileURLToPath(dir);
        let before = 0;
        let after = 0;
        let count = 0;
        let ffmpegMissing = false;

        for (const sub of VIDEO_DIRS) {
          const files = await walkFiles(join(outRoot, sub), VIDEO_EXT);
          for (const file of files) {
            const tmpPath = `${file}.optimized.mp4`;
            try {
              await execFileAsync('ffmpeg', [
                '-y',
                '-i',
                file,
                '-c:v',
                'libx264',
                '-preset',
                'slow',
                '-crf',
                '30',
                '-pix_fmt',
                'yuv420p',
                '-movflags',
                '+faststart',
                '-an',
                tmpPath,
              ]);
            } catch {
              ffmpegMissing = true;
              continue;
            }

            const origSize = (await stat(file)).size;
            const newSize = (await stat(tmpPath)).size;
            if (newSize < origSize) {
              before += origSize;
              after += newSize;
              await rename(tmpPath, file);
            } else {
              await rm(tmpPath);
            }
            count++;
          }
        }

        if (ffmpegMissing && count === 0) {
          console.log('\n⚠ ffmpeg not found — skipped video compression (original video(s) still shipped as-is).\n');
          return;
        }
        if (count === 0) return;
        const mb = (/** @type {number} */ n) => `${(n / 1024 / 1024).toFixed(1)} MB`;
        console.log(`\n✓ Compressed ${count} video(s): ${mb(before)} → ${mb(after)}\n`);
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
  // The whole site's CSS is small (~45 KB uncombined across its 2 chunks)
  // and split across 2 separate stylesheet requests, each paying its own
  // round-trip before first paint — PageSpeed's "render-blocking requests"
  // audit flags exactly this. Inlining removes both requests entirely; the
  // 3-page site (en, he, 404) means the small per-page duplication cost is
  // a clear win against GitHub Pages' fixed, short cache lifetime anyway
  // (see the PR that added optimizeImages() above for that constraint).
  build: {
    inlineStylesheets: 'always',
  },
  integrations: [placeholderSummary(), optimizeImages(), optimizeVideo(), react()],
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