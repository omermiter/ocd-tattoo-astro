import type { Dictionary } from './types';

// Review flags for the client:
// - "נתפס" chosen for flash "retired" status (a design has been claimed/taken),
//   rather than a literal "בדימוס" which reads bureaucratic in this context.
// - "השחרור הבא" chosen for "next drop" — "מהדורה" was the alternative, "שחרור"
//   reads closer to how a release is actually discussed in Hebrew online culture.
export const he: Dictionary = {
  nav: {
    home: 'ראשי',
    archive: 'הארכיון',
    vault: 'האוצר',
    register: 'הרישום',
    studio: 'הסטודיו',
    request: 'בקשה לייעוץ',
    langSwitch: 'EN',
    menu: 'תפריט',
  },
  home: {
    skipIntro: 'דלג על הפתיח',
    scrubberHint: 'גרור להשוואה',
    freshLabel: 'טרי',
    healedLabel: 'מחלים',
    commission: {
      title: 'הזמנת עבודה',
      body: 'עבודה בהתאמה אישית. מוגשת בבקשה, לא מוזמנת בלחיצה.',
      cta: 'הגש בקשה לייעוץ',
    },
    vault: {
      title: 'האוצר',
      nextDropLabel: 'השחרור הבא',
      cta: 'צפה באוצר',
    },
    registerLatest: 'הרישום — אחרונים',
  },
  work: {
    title: 'הארכיון',
    pieces: (n) => `${n} יצירות`,
    filter: 'סינון',
    placement: 'מיקום',
    healedSuffix: 'מחלים',
  },
  dossier: {
    back: 'חזרה לארכיון',
    placement: 'מיקום',
    sessions: 'מפגשים',
    hours: 'שעות',
    date: 'תאריך',
    stageReference: 'רפרנס',
    stageStencil: 'סטנסיל',
    stageFresh: 'טרי',
    stageHealed: 'מחלים',
    comparisonTitle: 'השוואת החלמה',
    dragHint: 'גרור להשוואה — מקשי חצים עובדים גם כן',
  },
  flash: {
    title: 'האוצר',
    nextDropLabel: 'השחרור הבא',
    sealed: 'חתום',
    available: 'פנוי',
    retired: 'נתפס',
    liftInstruction: 'גרור להסרת הסטנסיל',
    claimCta: 'תפוס עיצוב זה',
    claimedCta: 'נתפס',
    confirmTitle: 'עיצוב חד-פעמי',
    confirmBody:
      'מצויר פעם אחת, מקועקע פעם אחת. פיקדון נדרש לשמירה. הפיקדון מזוכה למפגש. ללא החזר.',
    whatsappCta: 'אישור בוואטסאפ',
    whatsappMessage: (serial) => `אני רוצה לתפוס את ${serial}`,
    emptyState: 'אין עיצובים פתוחים כרגע. השחרור הבא ביום חמישי בשעה 20:00.',
    city: 'עיר',
    claimedOn: 'נתפס בתאריך',
    dimensions: 'מידות',
  },
  register: {
    title: 'הרישום',
    subtitle: 'כל עיצוב שנתפס, לצמיתות.',
    colSerial: 'סידורי',
    colClaimed: 'נתפס',
    colCity: 'עיר',
    colPlacement: 'מיקום',
    empty: 'הרישום ריק כרגע.',
  },
  studio: {
    title: 'הסטודיו',
    processTitle: 'התהליך',
    processSteps: ['רפרנס', 'סטנסיל', 'מפגש', 'החלמה', 'רישום'],
    aftercareTitle: 'טיפול לאחר הקעקוע',
    aftercare: [
      {
        period: 'יום 1–3',
        body: 'שוטפים במים פושרים וסבון נטול בישום, פעמיים ביום. שכבה דקה של משחה. בלי בגדים צמודים על האזור.',
      },
      {
        period: 'יום 4–14',
        body: 'העור מתקלף ומגרד. לא מקלפים ולא מגרדים. ממשיכים בשכבה דקה של קרם לחות נטול בישום.',
      },
      {
        period: 'יום 15–30',
        body: 'הצבע נראה עמום — זה זמני. בלי שמש ישירה, בלי בריכה, בלי ים עד שהעור נסגר לגמרי.',
      },
    ],
    bio: 'עובד פיקסל ארט צבעוני באזור השרון. נבנה פיקסל אחרי פיקסל — שטחי צבע אחידים, קווי מתאר חדים, בלי גרדיאנט שממלא מקום של החלטה. כל עבודה נבנית סביב מה שיישאר קריא בעוד עשרים שנה.',
  },
  request: {
    title: 'בקשה לייעוץ',
    stepOf: (n, total) => `${String(n).padStart(2, '0')} / ${String(total).padStart(2, '0')}`,
    steps: {
      placement: { label: 'מיקום על הגוף', placeholder: 'למשל: אמה, שוק, גב' },
      size: { label: 'גודל משוער', placeholder: 'למשל: 12 ס״מ' },
      reference: { label: 'העלה רפרנס', hint: 'תמונה אחת או יותר. תצרף אותה בשיחת הוואטסאפ שתיפתח בסוף.' },
      window: { label: 'חלון זמן מועדף', placeholder: 'למשל: אוקטובר–נובמבר' },
      description: {
        label: 'מה זאת העבודה הזאת בשבילך',
        placeholder: 'ספר לי על הרעיון, לא רק על התמונה',
      },
    },
    submitCta: 'שלח בקשה',
    continueCta: 'המשך',
    backCta: 'חזרה',
    closingTitle: 'הבקשה נשלחה',
    closingBody: 'בקשות נבדקות אחת לשבוע. כל אחד מקבל תשובה, כן או לא.',
  },
  footer: {
    handle: '@ocd_tattoo',
    location: 'אזור השרון',
  },
  notFound: {
    title: 'העמוד לא נמצא',
    body: 'העמוד הזה לא קיים, או שהיצירה הועברה.',
    backCta: 'חזרה לארכיון',
  },
};
