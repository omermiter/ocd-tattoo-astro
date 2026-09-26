export type Locale = 'en' | 'he';

export const LOCALES: Locale[] = ['en', 'he'];
export const DEFAULT_LOCALE: Locale = 'en';

// Path prefix for each locale's routes — English stays unprefixed (existing
// URLs/indexing untouched), Hebrew lives under /he/.
export function localePath(locale: Locale, path = ''): string {
  const base = locale === DEFAULT_LOCALE ? '/' : '/he/';
  return path ? `${base}${path.replace(/^\/+/, '')}` : base;
}

export const ui = {
  en: {
    dir: 'ltr' as const,
    nav: {
      pieces: 'Pieces',
      gallery: 'More work',
      reviews: 'Reviews',
      contact: 'Contact',
      menu: 'Menu',
      switchTo: 'עברית',
    },
    footer: {
      google: 'Google',
      instagram: 'Instagram',
      whatsapp: 'WhatsApp',
    },
    beat: {
      cta: 'See the work ↓',
    },
    pieceCard: {
      placement: 'Placement',
      size: 'Size',
      sessions: 'Sessions',
      hours: 'Hours',
      date: 'Date',
      photographyPending: 'Photography pending',
    },
    gallery: {
      note: 'Anything above marked "flash" is a one-off design, ready to book as-is — ask about it below.',
    },
    reviews: {
      eyebrow: 'Reviews',
      trustFallback: 'See reviews on Google →',
      reviewCount: (n: number) => `${n} Google reviews →`,
      noDataText: "Reviews aren't pulled in here yet.",
      readOnGoogle: 'Read them on Google →',
      googleMark: 'Google',
    },
    contact: {
      eyebrow: 'Contact',
      nameLabel: 'Name',
      emailLabel: 'Email',
      messageLabel: 'What are you looking for?',
      messagePlaceholder: 'Placement, size, the idea — as much or as little as you have.',
      send: 'Send →',
      sending: 'Sending…',
      sent: 'Sent. I read every message myself — expect a reply within a few days.',
      errorPrefix: 'Something went wrong. Message me directly on',
      errorLink: 'WhatsApp',
      errorSuffix: 'instead.',
    },
    notFound: {
      back: '← Back to the work',
    },
  },
  he: {
    dir: 'rtl' as const,
    nav: {
      pieces: 'עבודות',
      gallery: 'עוד עבודות',
      reviews: 'ביקורות',
      contact: 'צור קשר',
      menu: 'תפריט',
      switchTo: 'English',
    },
    footer: {
      google: 'גוגל',
      instagram: 'אינסטגרם',
      whatsapp: 'וואטסאפ',
    },
    beat: {
      cta: '← לצפייה בעבודות',
    },
    pieceCard: {
      placement: 'מיקום',
      size: 'גודל',
      sessions: 'מפגשים',
      hours: 'שעות',
      date: 'תאריך',
      photographyPending: 'צילום בהמתנה',
    },
    gallery: {
      note: 'כל עבודה שמסומנת למעלה כ"פלאש" היא עיצוב חד-פעמי, מוכן להזמנה כמו שהוא — שאלו עליו למטה.',
    },
    reviews: {
      eyebrow: 'ביקורות',
      trustFallback: 'לצפייה בביקורות בגוגל ←',
      reviewCount: (n: number) => `${n} ביקורות בגוגל ←`,
      noDataText: 'הביקורות עדיין לא נטענו כאן.',
      readOnGoogle: 'קראו אותן בגוגל ←',
      googleMark: 'גוגל',
    },
    contact: {
      eyebrow: 'צור קשר',
      nameLabel: 'שם',
      emailLabel: 'אימייל',
      messageLabel: 'מה מעניין אותך?',
      messagePlaceholder: 'מיקום, גודל, הרעיון — כמה שתרצו לספר, גם אם זה מעט.',
      send: 'שליחה ←',
      sending: 'שולח…',
      sent: 'נשלח. אני קורא כל הודעה בעצמי — צפו לתשובה תוך כמה ימים.',
      errorPrefix: 'משהו השתבש. אפשר לפנות אליי ישירות',
      errorLink: 'בוואטסאפ',
      errorSuffix: '.',
    },
    notFound: {
      back: '→ חזרה לעבודות',
    },
  },
} as const;

export function t(locale: Locale) {
  return ui[locale];
}
