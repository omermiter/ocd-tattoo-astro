# Pixel art — drop-in manifest

Every file below is optional and can be added one at a time — nothing on the
site depends on all of them existing at once, and each one has a graceful
fallback (see the "if missing" column). After adding or replacing a file
here, rebuild (`npm run build`, or just refresh in `npm run dev`) for it to
take effect — asset presence is checked at build time, not at runtime.

| Filename | Size | Used for | If missing |
|---|---|---|---|
| `cursor-default.png` | 32×32 | Global custom cursor | System cursor throughout the site |
| `cursor-hover.png` | 32×32 | Cursor over interactive elements | Default cursor sprite doesn't swap on hover (or system cursor, if `cursor-default.png` is also missing) |
| `mark.png` | 64×64 | Footer mark, homepage preloader fallback | Footer shows text only; preloader falls through to `preloader.png` or is skipped |
| `favicon.png` | 32×32 (also works at 16×16) | Browser tab icon | Existing `favicon.svg` stays as the tab icon |
| `icon-instagram.png` | 24×24 | Footer Instagram link | Footer shows the existing plain "Instagram" text link |
| `icon-whatsapp.png` | 24×24 | Footer WhatsApp link | Footer shows the existing plain "WhatsApp" text link |
| `hover-burst.png` | 4–8 frame horizontal strip, square frames | `/pieces` and homepage thumbnail hover animation (photographed pieces only) | No hover animation, thumbnail is static |
| `preloader.png` | 6–10 frame horizontal strip, square frames | Homepage initial load animation | Falls through to `mark.png` (static hold) or is skipped entirely |
| `stamp-available.png` | 96×48 | Register row, available flash designs | No stamp graphic (status still shown as text) |
| `stamp-claimed.png` | 96×48 | Register row, claimed flash designs | No stamp graphic (status still shown as text) |
| `divider.png` | repeatable tile, any width, 16px tall works cleanest | Section dividers on the homepage | No divider rendered, section spacing stays clean (the hairline rule is still there) |
| `404.png` | flexible | 404 page illustration | Plain "404" mono type shown instead (current default) |

Sprite sheets (`hover-burst.png`, `preloader.png`) must be a single row of
**equal, square frames** — the frame count is read automatically from the
file's actual width ÷ height at build time, so there's no separate count to
configure. A malformed sheet (width not an exact multiple of height) is
treated as missing rather than rendered wrong.

All images should ship at true 1x pixel size — the site scales them up in
crisp integer multiples via CSS `image-rendering: pixelated`, so there's no
need for @2x/@3x variants.
