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
      google: 'Google Maps',
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
      expand: 'View larger',
      close: 'Close',
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
      messageLabel: 'Your idea',
      messagePlaceholder: 'A character, a reference link, where on the body, roughly how big.',
      send: 'Send my idea →',
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
      google: 'גוגל מפות',
      instagram: 'אינסטגרם',
      whatsapp: 'וואטסאפ',
    },
    beat: {
      cta: 'לעבודות ←',
    },
    pieceCard: {
      placement: 'מיקום',
      size: 'גודל',
      sessions: 'מפגשים',
      hours: 'שעות',
      date: 'תאריך',
      photographyPending: 'צילום בהמתנה',
      expand: 'הגדלת תמונה',
      close: 'סגירה',
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
      messageLabel: 'הרעיון שלכם',
      messagePlaceholder: 'דמות, קישור לרפרנס, מיקום על הגוף וגודל משוער.',
      send: 'שליחת הרעיון ←',
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
