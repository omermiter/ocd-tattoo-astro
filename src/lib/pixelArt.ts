import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

/**
 * Hand-drawn pixel-art assets live in /public/pixel-art/ and get dropped in
 * gradually, not all at once — see /public/pixel-art/README.md for the full
 * manifest. Every consumer of this module must tolerate a missing file: this
 * is enhancement, never critical path.
 *
 * Astro component frontmatter runs in Node (build time for `astro build`,
 * per-request for `astro dev`), so we check the filesystem directly instead
 * of shipping a client-side onerror flash-of-broken-image. A rebuild is
 * already required to publish any content change on this static site, so a
 * build-time gate costs nothing extra.
 */
const PIXEL_ART_DIR = fileURLToPath(new URL('../../public/pixel-art/', import.meta.url));

export function pixelArtExists(filename: string): boolean {
  try {
    return existsSync(`${PIXEL_ART_DIR}${filename}`);
  } catch {
    return false;
  }
}

export function pixelArtPath(filename: string, base = import.meta.env.BASE_URL): string {
  const b = base.endsWith('/') ? base : `${base}/`;
  return `${b}pixel-art/${filename}`;
}

/**
 * Sprite sheets are a single row of N equal square frames. Reads the file's
 * actual dimensions at build time so the CSS step-animation always uses the
 * real frame count instead of a hardcoded guess. Returns null if missing or
 * malformed (width not a clean multiple of height).
 */
export async function spriteFrameCount(filename: string): Promise<number | null> {
  if (!pixelArtExists(filename)) return null;
  try {
    const sharp = (await import('sharp')).default;
    const meta = await sharp(`${PIXEL_ART_DIR}${filename}`).metadata();
    if (!meta.width || !meta.height) return null;
    const frames = meta.width / meta.height;
    if (!Number.isInteger(frames) || frames < 2) return null;
    return frames;
  } catch {
    return null;
  }
}
