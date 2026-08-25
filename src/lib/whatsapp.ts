import type { Locale } from '../i18n';
import { getDict } from '../i18n';

// TODO(client): replace with the studio's real WhatsApp Business number,
// international format, digits only (e.g. "9725XXXXXXXX"). See ASSETS-NEEDED.md.
export const WHATSAPP_NUMBER = '9725XXXXXXXX';

/** Plain wa.me link with no prefilled message — used for the footer icon,
 * distinct from the two prefilled deep links below (claim / request). */
export function whatsappLink(): string {
  return `https://wa.me/${WHATSAPP_NUMBER}`;
}

export function claimLink(locale: Locale, serial: string): string {
  const t = getDict(locale);
  const message = encodeURIComponent(t.flash.whatsappMessage(serial));
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
}

export interface RequestAnswers {
  placement: string;
  size: string;
  window: string;
  description: string;
}

export function requestLink(locale: Locale, answers: RequestAnswers): string {
  const lines =
    locale === 'he'
      ? [
          'בקשה לייעוץ:',
          `מיקום: ${answers.placement}`,
          `גודל משוער: ${answers.size}`,
          `חלון זמן מועדף: ${answers.window}`,
          `על העבודה: ${answers.description}`,
        ]
      : [
          'Consultation application:',
          `Placement: ${answers.placement}`,
          `Approximate size: ${answers.size}`,
          `Preferred window: ${answers.window}`,
          `About the piece: ${answers.description}`,
        ];
  const message = encodeURIComponent(lines.join('\n'));
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
}
