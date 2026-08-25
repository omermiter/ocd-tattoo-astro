import { he } from './he';
import { en } from './en';
import type { Dictionary } from './types';

export type Locale = 'he' | 'en';

const dictionaries: Record<Locale, Dictionary> = { he, en };

export function getDict(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export type { Dictionary };
