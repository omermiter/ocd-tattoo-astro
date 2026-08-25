import type { Locale } from '../i18n';

// Canonical vocabulary for flash `placementSuggested` keys, which are stored
// as plain English identifiers in content (matching the schema example in
// the brief). This translates them for display — the same word used across
// all designs, unlike `placement_he`/`placement_en` on work dossiers, which
// are free text per piece.
const PLACEMENTS: Record<string, { he: string; en: string }> = {
  forearm: { he: 'אמה', en: 'forearm' },
  calf: { he: 'שוק', en: 'calf' },
  ribs: { he: 'צלעות', en: 'ribs' },
  shoulder: { he: 'כתף', en: 'shoulder' },
  shin: { he: 'שוק קדמית', en: 'shin' },
};

export function placementLabel(key: string, locale: Locale): string {
  const entry = PLACEMENTS[key];
  if (!entry) return key;
  return locale === 'he' ? entry.he : entry.en;
}
