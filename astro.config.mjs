// @ts-check
import { defineConfig } from 'astro/config';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

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
  { id: 'mark', filename: 'mark.png', width: 32, height: 32, priority: 'P0' },
  { id: 'favicon', filename: 'favicon.png', width: 32, height: 32, priority: 'P0' },
  { id: 'stamp-claimed', filename: 'stamp-claimed.png', width: 40, height: 40, priority: 'P0' },
  { id: 'stamp-available', filename: 'stamp-available.png', width: 40, height: 40, priority: 'P0' },
  { id: 'icon-instagram', filename: 'icon-instagram.png', width: 16, height: 16, priority: 'P1' },
  { id: 'icon-whatsapp', filename: 'icon-whatsapp.png', width: 16, height: 16, priority: 'P1' },
  { id: 'pending-mark', filename: 'pending-mark.png', width: 32, height: 32, priority: 'P1' },
  { id: '404', filename: '404.png', width: 128, height: 128, priority: 'P1' },
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

// Custom domain (see public/CNAME) — served from the root, not a GitHub
// Pages project subpath, so base stays "/".
export default defineConfig({
  base: '/',
  trailingSlash: 'always',
  site: 'https://ocdtattoo.com',
  integrations: [placeholderSummary()],
});
