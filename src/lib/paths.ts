import type { Locale } from '../i18n';

/**
 * Builds a base-aware, locale-aware route href.
 * `path` is the locale-agnostic route segment, e.g. "" | "work" | "work/ocd-25-041" | "flash".
 */
export function pagePath(locale: Locale, path: string, base = import.meta.env.BASE_URL): string {
  const clean = path.replace(/^\/+|\/+$/g, '');
  const prefix = locale === 'en' ? 'en/' : '';
  const b = base.endsWith('/') ? base : `${base}/`;
  return clean ? `${b}${prefix}${clean}/` : `${b}${prefix}`;
}

export function otherLocale(locale: Locale): Locale {
  return locale === 'he' ? 'en' : 'he';
}
