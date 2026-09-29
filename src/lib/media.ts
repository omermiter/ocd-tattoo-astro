import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// Real piece/flash photography drops into /public/pieces/ and /public/flash/
// as it's shot — none exists yet, so every entry currently renders through
// the placeholder panel (see PieceMedia.astro). This is a build-time check
// (Astro frontmatter runs in Node) so a missing photo never produces a
// broken-image icon or empty gap, and a real one appears automatically on
// the next build with zero code changes.
const PUBLIC_DIR = fileURLToPath(new URL('../../public/', import.meta.url));

export function hasPhoto(path: string): boolean {
  try {
    return existsSync(`${PUBLIC_DIR}${path.replace(/^\/+/, '')}`);
  } catch {
    return false;
  }
}

// Points at the WebP sibling the astro.config.mjs optimizeImages() build
// hook generates next to every PNG/JPEG under public/{gallery,pieces,
// uploads} — deterministic extension swap, not an existence check, since
// the sibling is created post-build (dist/) and won't exist yet at the
// point this runs (Astro frontmatter, pre-build).
export function toWebp(path: string): string {
  return path.replace(/\.(png|jpe?g)$/i, '.webp');
}
