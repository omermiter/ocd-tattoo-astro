import { pixelArtExists } from './pixelArt';

/**
 * Registry of every hand-drawn asset the redesign specifies in
 * ASSETS-TO-DRAW.md. Anything listed here that isn't on disk yet renders as
 * a loud magenta/black placeholder (see PixelPlaceholder.astro) instead of
 * silently disappearing — the opposite of the old pixel-art fallback
 * convention (see pixelArt.ts), and deliberate: a redesign asset that's
 * still pending should look obviously unfinished, not quietly absent.
 *
 * Assets NOT in this registry (cursor.png, hover-burst.png — both existing,
 * working, hand-drawn art from before this redesign) keep the old
 * graceful-absence behavior untouched. See REDESIGN-PLAN.md §7.
 */
export interface PlaceholderAsset {
  id: string;
  filename: string;
  width: number;
  height: number;
  priority: 'P0' | 'P1' | 'P2';
}

export const PLACEHOLDER_ASSETS: PlaceholderAsset[] = [
  { id: 'mark', filename: 'mark.png', width: 32, height: 32, priority: 'P0' },
  { id: 'favicon', filename: 'favicon.png', width: 32, height: 32, priority: 'P0' },
  { id: 'stamp-claimed', filename: 'stamp-claimed.png', width: 40, height: 40, priority: 'P0' },
  { id: 'stamp-available', filename: 'stamp-available.png', width: 40, height: 40, priority: 'P0' },
  { id: 'icon-instagram', filename: 'icon-instagram.png', width: 16, height: 16, priority: 'P1' },
  { id: 'icon-whatsapp', filename: 'icon-whatsapp.png', width: 16, height: 16, priority: 'P1' },
  { id: 'pending-mark', filename: 'pending-mark.png', width: 32, height: 32, priority: 'P1' },
  { id: '404', filename: '404.png', width: 128, height: 128, priority: 'P1' },
];

export function missingPlaceholderAssets(): PlaceholderAsset[] {
  return PLACEHOLDER_ASSETS.filter((a) => !pixelArtExists(a.filename));
}

export function isAssetMissing(id: string): boolean {
  const asset = PLACEHOLDER_ASSETS.find((a) => a.id === id);
  if (!asset) return false;
  return !pixelArtExists(asset.filename);
}

export function getAsset(id: string): PlaceholderAsset {
  const asset = PLACEHOLDER_ASSETS.find((a) => a.id === id);
  if (!asset) throw new Error(`Unknown placeholder asset id: ${id}`);
  return asset;
}
