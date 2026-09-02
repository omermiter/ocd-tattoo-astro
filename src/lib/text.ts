// Lets CMS-edited copy (see src/data/site.json) mark up a single emphasized
// word/phrase with *asterisks* instead of raw HTML — escapes everything else
// first so the CMS field stays plain text, not a place to inject markup.
export function renderEmphasis(text: string): string {
  const escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return escaped.replace(/\*([^*]+)\*/g, '<em>$1</em>');
}
