# Assets needed from the client

The site is fully built and functional with placeholders. Nothing here blocks
development — it blocks going live. Everything marked `PLACEHOLDER` in
`/src/content` and `/src/components` needs to be replaced before launch.

## 1. Fonts — licensing decision needed

The brief's preferred faces are commercial:

| Role | Preferred (commercial) | Currently shipping (free) |
|---|---|---|
| Display, Latin | PP Editorial New Ultralight | **Newsreader**, weight 300 |
| Display, Hebrew | Frank Ruhl Libre Light | **Frank Ruhl Libre**, weight 300 (already free — shipping as specified) |
| Body/UI, Latin | Söhne Buch | **Instrument Sans** |
| Body/UI, Hebrew | Assistant | **Assistant** (already free — shipping as specified) |
| Mono | Söhne Mono | **Geist Mono** |

If you own or purchase licenses for PP Editorial New and/or Söhne, send the
webfont files (`.woff2`, or source files to subset) and I'll swap them in
`src/styles/fonts.css` and regenerate the per-script subsets. Until then the
free fallbacks above are what's live — they were chosen to match the brief's
contrast/weight intent as closely as a free face can.

## 2. Photography — every image on the site is a placeholder

Placeholder images are generated diagonal-hatch graphics, clearly labeled with
the piece's serial number, living in:

- `src/content/work/<slug>/{reference,stencil,fresh,healed}.jpg` — one set of
  four per dossier, one dossier per finished piece.
- `src/content/flash/<slug>/image.jpg` — one artwork image per flash design.
- `src/components/pages/StudioPage.astro` — the artist portrait is an empty
  placeholder box, no image file yet.

**What I need per work dossier** (6 currently seeded — see `README.md` for
how to add more):

1. Reference photo (the source image/inspiration)
2. Stencil-stage photo (fresh stencil applied, before ink)
3. Fresh photo (immediately post-session)
4. Healed photo (the age noted in `healedAt_he`/`healedAt_en` — currently
   ranging 1–18 months per piece; confirm or correct these per real piece)

All four should be shot at a consistent aspect ratio if possible (I built the
templates around 4:5 portrait) — doesn't need to be exact, cropping is
handled, but similar framing reads better in the scrubber.

**What I need per flash design:** one clean photo or scan of the finished
flash artwork, ideally on a plain background.

**Artist portrait:** one photo for `/studio` — environment/hands/workspace or
a portrait, your call. Also fine to skip entirely if you'd rather the page
stay text-only; I'll remove the placeholder box on request.

## 3. Copy to verify

I wrote all site copy (Hebrew and English) myself per the brief's voice rules
— present tense, no exclamation marks, no filler. Flagged specifically for
your review in `src/i18n/he.ts` (see the comment block at the top of that
file):

- **"נתפס"** for a flash design's retired state — I read this as more natural
  than "בדימוס" (formal/bureaucratic "retired"). Confirm or correct.
- **"השחרור הבא"** for "next drop" — alternative would be "מהדורה הבאה."
  Confirm or correct.
- Aftercare instructions (`src/i18n/he.ts` → `studio.aftercare`) are written
  from general tattoo-aftercare convention, not your specific protocol —
  **please review these against what you actually tell clients.** This is
  the one place on the site where wrong copy could cause real harm.
- Artist bio (`studio.bio`) is a placeholder paragraph — replace with your
  own words, or tell me how you'd describe the practice and I'll draft again.

## 4. WhatsApp number

`src/lib/whatsapp.ts` has a placeholder number:

```
export const WHATSAPP_NUMBER = '9725XXXXXXXX';
```

Both the flash claim flow and the consultation request flow end with a
`wa.me` deep link built from this constant. Send the real WhatsApp Business
number (international format, digits only) and I'll drop it in — one-line
change.

## 5. First drop date + ongoing flash content

`releaseAt` timestamps in `src/content/flash/*/index.md` are seeded against
the "first Thursday of the month, 20:00 Israel time" rule starting from
today's date. Confirm the actual date you want the first real drop to go
live, and I'll reset the seed content (or you can — see `README.md`).

## 6. Domain / repository name

`astro.config.mjs` hardcodes `base: '/ocd-tattoo'` for GitHub Pages project-site
routing. If the GitHub repo ends up named something other than `ocd-tattoo`,
that constant (and the font-path prefixes in `src/styles/fonts.css`) need to
match the repo name exactly — see `README.md` → Deploying.

## 7. Analytics / business tooling (optional, out of scope unless requested)

Nothing is wired up — no analytics, no cookie banner, no third-party
scripts of any kind, by design (static site, section 5 of the brief). If you
want privacy-respecting analytics later (e.g. Plausible), that's a small,
separate addition — say the word.
