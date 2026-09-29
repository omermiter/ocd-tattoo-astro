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
// hook generates next to every PNG/JPEG under public/gallery and
// public/uploads — deterministic extension swap, not an existence check,
// since the sibling is created post-build (dist/) and won't exist yet at
// the point this runs (Astro frontmatter, pre-build).
export function toWebp(path: string): string {
  return path.replace(/\.(png|jpe?g)$/i, '.webp');
}

// public/pieces gets real srcset widths instead of one fixed size — see
// astro.config.mjs's optimizeImages() for why (PieceCard.astro displays it
// at a fixed column on desktop but full-bleed on mobile). Must match that
// file's PIECE_WIDTHS by hand; it can't import this module (see the
// comment there on why the build hook runs outside Astro's Vite pipeline).
const PIECE_WIDTHS = [500, 800, 1200];

export function pieceSrcset(path: string): string {
  const base = path.replace(/\.(png|jpe?g)$/i, '');
  return PIECE_WIDTHS.map((w) => `${base}-${w}w.webp ${w}w`).join(', ');
}

// The plain `src` fallback (browsers without srcset support, and the
// initial/no-JS render) — the largest generated width.
export function pieceFallback(path: string): string {
  const base = path.replace(/\.(png|jpe?g)$/i, '');
  return `${base}-${PIECE_WIDTHS[PIECE_WIDTHS.length - 1]}w.webp`;
}
