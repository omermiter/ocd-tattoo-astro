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
