# OCD Tattoo — Design Plan

## 0. Reading of the brief

The organizing metaphor is an archive. The organizing rule is: **violet = provisional, black/gray = permanent.** Every decision below is tested against that rule before anything else. If a choice doesn't serve "stencil → skin," it's cut regardless of how good it looks in isolation.

---

## 1. Token system (final)

### Color — unchanged from brief, verified for contrast

```css
--ink:      #0A090C;
--carbon:   #16131C;
--graphite: #2A272F;
--ash:      #6E6875;
--pewter:   #B4AFA9;
--bone:     #EDE7E1;
--stencil:  #6A4CB8;
--transfer: #9B7BF0;
```

Contrast checked against `--ink` (WCAG relative luminance):
- `--pewter` on `--ink`: **9.1:1** — passes body text (needs 4.5:1) with margin.
- `--bone` on `--ink`: **~16.8:1** — headings, no issue.
- `--ash` on `--ink`: **3.7:1** — passes large text (3:1) but *not* body-text AA. **Constraint I'm adding:** `--ash` is restricted to mono metadata set at 13px+ with letter-spacing, never used for anything that is the primary reading content at body size. This is a real accessibility constraint, not a style note — it changes how metadata rows are typeset (always slightly larger and spaced-out, which reads as "registry stamp" rather than "gray disclaimer text," a happy accident that reinforces the archive idea).

No new colors added. Focus rings and selection use `--transfer` per spec. Disabled states use `--graphite` text on `--carbon` (no separate "disabled gray").

### Type scale

Base body: 16px / 1rem. Ratio 1.25 (major third) for UI/body sizes:

```
--fs-000: 0.64rem   (10.2px) — micro labels, mono
--fs-00:  0.8rem    (12.8px) — captions, ledger rows
--fs-0:   1rem      (16px)   — body
--fs-1:   1.25rem   (20px)   — lede, pull quotes
--fs-2:   1.5625rem (25px)  — section labels
--fs-3:   1.953rem  (31px)  — sub-headings
```

Display sizes **break the scale deliberately** (brief's instruction — "jump, don't step"):

```
--fs-display-sm: 4.5rem   (72px)  — page-level headings (work titles, /studio)
--fs-display-md: 7rem     (112px) — section openers (/flash, /register hero line)
--fs-display-lg: 10rem    (160px) — homepage wordmark, clamped down on mobile
```

`clamp()` is used so the display sizes scale by viewport rather than stepping at breakpoints — e.g. `--fs-display-lg: clamp(3.5rem, 14vw, 10rem)`. This is the one place fluid type is used; everything else sits on the fixed rem scale so the registry data reads as *stable*, not responsive-fluid, which would undercut the "documented, numbered" feel.

### Space scale (rem, base 8px = 0.5rem unit)

```
--sp-1: 0.5rem   (8px)
--sp-2: 1rem     (16px)
--sp-3: 2rem     (32px)
--sp-4: 3rem     (48px)
--sp-5: 5rem     (80px)
--sp-6: 8rem     (128px)
--sp-7: 13rem    (208px)
```

Fibonacci-derived per brief. `--sp-7` is used rarely — it's the "intentional emptiness" unit, reserved for the negative-space moment on `/flash` above the fold and around the wordmark on `/`.

### Radius & borders

- `--radius: 0px` everywhere structural.
- `--radius-image: 2px` on photography only (a 2px radius on a photo reads as a print/slide mounted in a sleeve, not as a UI card — that distinction is why it's not 0 like everything else).
- `--border-hairline: 0.5px solid var(--graphite)` — the one border. Rendered at true 0.5px via `border-width: 0.5px` (modern browsers subpixel-render this on retina; a `transform: scaleY(0.5)` fallback trick is not needed given target devices).

### Motion tokens

```css
--dur-slow: 900ms;
--dur-base: 200ms;
--dur-fast: 120ms;
--ease-house: cubic-bezier(0.16, 1, 0.3, 1);
```

`prefers-reduced-motion: reduce` — all `transform` transitions become `duration: 0.01ms` (effectively instant, keeps event ordering), opacity fades clamp to `--dur-fast` (120ms). Implemented once in `tokens.css` via a media query that overrides the custom properties themselves, so components don't need their own reduced-motion branches.

---

## 2. Wireframes

Grid throughout: 12-column, but **content never spans all 12 evenly** — a dominant column (7–8 units) carries display type or imagery, a narrower column (3–4 units) carries metadata/mono/navigation. This asymmetry is the one layout rule that holds across every page and is the main defense against "centered generic."

RTL note: in Hebrew the dominant column sits on the *inline-end* side by logical default (mirrors, doesn't flip photography). Diagrams below are drawn LTR for reading ease; the actual grid uses `grid-template-columns` with `direction: rtl` inherited, not manually mirrored values.

### `/` — Home

```
┌─────────────────────────────────────────────────────────┐
│ OCD·TATTOO                              [ he | en ]  ≡   │  <- hairline nav, mono
├─────────────────────────────────────────────────────────┤
│                                                           │
│                                                           │
│              O  C  D                                     │  <- fs-display-lg, bone
│              T  A  T  T  O  O                             │     hairline draws under on load
│                                                           │
│         [ healed piece, 20% opacity, behind wordmark ]    │
│                                                           │
├─────────────────────────────────────────────────────────┤
│ ┌───────────────────────────────┐  serial OCD·25·041      │
│ │                                │  placement: forearm     │  <- mono column, narrow
│ │      healed portrait,          │  healed: 14 months      │
│ │      full bleed                │                          │
│ │   [ ◄────●──────► scrubber ]  │  drag to compare         │
│ │                                │                          │
│ └───────────────────────────────┘                          │
├─────────────────────────────────────────────────────────┤
│                                                           │
│   COMMISSION                    │   THE VAULT             │  <- unequal: commission
│   apply for custom work →       │   next drop 03.09 20:00 │     ~65% width, Vault ~35%,
│   (large, bone on ink)          │   (smaller, stencil edge)│     Vault has violet accent
│                                                           │
├─────────────────────────────────────────────────────────┤
│ REGISTER — LATEST                                        │
│ OCD·26·013   ramat gan   forearm   2026.07.29            │  <- mono ledger, 3 rows only
│ OCD·26·012   haifa       calf      2026.07.11            │
│ OCD·26·011   tel aviv    ribs      2026.06.30            │
└─────────────────────────────────────────────────────────┘
```

Page-load sequence (once per `sessionStorage`, ~3s, any keypress/click/scroll skips instantly): hairline nav border draws left→right (`scaleX`), then wordmark opacity+`clip-path` reveal letter-by-letter is **rejected** (too "AI intro animation") — replaced with a single clean opacity+2px blur-out on the whole wordmark as one unit, then the healed piece behind it fades to 20% opacity. Three beats, not fifteen.

### `/work` — Archive index

```
┌─────────────────────────────────────────────────────────┐
│ THE ARCHIVE                                    42 pieces │  <- count is real, from content collection
├───────────────────┬───────────────────────────────────────┤
│ FILTER (mono)     │  OCD·26·007                            │
│ placement         │  ─────────────────────                │
│ · forearm (8)     │  [image]      forearm · 14mo healed    │
│ · calf (5)        │                                         │
│ · ribs (4)        │  OCD·25·041                            │
│ · portrait (11)   │  ─────────────────────                │
│ ...               │  [image]      ribs · 8mo healed        │
│                   │                                         │
│ (narrow, sticky)  │  (dominant column, single file list,   │
│                   │   not a grid of equal cards)           │
└───────────────────┴───────────────────────────────────────┘
```

Rejected: masonry/grid of equal-weight image cards (the "portfolio" pattern). Used instead: a single-column manifest, each row a full-width strip with the image on one side and the spec sheet on the other — reads as flipping through a physical archive box, not scrolling Instagram.

### `/work/[slug]` — Dossier

```
┌─────────────────────────────────────────────────────────┐
│ ← ARCHIVE          OCD·25·041                            │  <- mono serial, large
├───────────────────────────────────────────────────────────┤
│ placement   ribs                │                          │
│ sessions    3                   │   [ reference image ]    │
│ hours       11                  │   (stage 1 of 4,         │
│ date        2025.02–2025.04     │    scroll-pinned)         │
│ (narrow mono column, sticky)    │                          │
├──────────────────────────────────────────────────────────┤
│   scroll →   [ stencil ]  →  [ fresh ]  →  [ healed ]      │
├──────────────────────────────────────────────────────────┤
│         HEALED COMPARISON                                 │
│  ┌───────────────────────────────────────────┐            │
│  │   fresh ▓▓▓▓▓▓▓▓│░░░░░░░░ healed (drag)    │            │
│  └───────────────────────────────────────────┘            │
│         "the gray sat darker than expected in the          │
│          shoulder — I under-saturated the mid-tones         │
│          on purpose so it would hold at year one."          │
│                                                           — artist
└─────────────────────────────────────────────────────────┘
```

### `/flash` — The Vault

```
┌─────────────────────────────────────────────────────────┐
│ THE VAULT                    NEXT DROP  03.09.26 · 20:00  │  <- mono countdown, live
├──────────────┬──────────────┬──────────────┬──────────────┤
│ OCD·26·014   │ OCD·26·013   │ OCD·26·012   │ OCD·26·011   │
│ ▓▓▓▓▓▓▓▓▓▓   │ [artwork]    │ [artwork]    │ [artwork,    │
│ ▓ sealed ▓   │  available   │  available   │  desaturated]│
│ ▓▓▓▓▓▓▓▓▓▓   │              │              │  retired     │
│ drag to lift │ 12cm         │ 9cm          │ haifa · 07.29│
│ edge: stencil│ edge: stencil│ edge: stencil│ edge: graphite│
└──────────────┴──────────────┴──────────────┴──────────────┘
```

Rejected: a "shop grid" with prices and an add-to-cart pattern (even disguised). Used instead: the three-state system *is* the layout — the grid never changes shape, only the cell's rendering changes, which is what makes retired pieces staying visible forever feel like a feature and not a bug.

### `/register` — Ledger

```
┌─────────────────────────────────────────────────────────┐
│ THE REGISTER                                              │
│ every retired design, permanently.                        │
├───────────┬────────────┬──────────┬───────────┬───────────┤
│ SERIAL ↕  │ CLAIMED ↕  │ CITY ↕   │ PLACEMENT↕│           │
├───────────┼────────────┼──────────┼───────────┼───────────┤
│ OCD·26·013│ 2026.07.29 │ ramat gan│ forearm   │           │
│ OCD·26·012│ 2026.07.11 │ haifa    │ calf      │           │
│ ...       │            │          │           │           │  <- monospace table,
│           │            │          │           │           │     no images, no color
└───────────┴────────────┴──────────┴───────────┴───────────┘     but graphite hairlines
```

Deliberately the plainest page in the system — brief calls for this explicitly.

### `/studio`

```
┌─────────────────────────────────────────────────────────┐
│ STUDIO                                                    │
├───────────────────────┬─────────────────────────────────┤
│ [portrait of artist,  │  PROCESS                          │
│  or hands/workspace   │  reference → stencil → session   │
│  detail — narrow      │  → healing → registry              │
│  column, offset]      │                                    │
│                       │  AFTERCARE                         │
│                       │  day 1–3 / 4–14 / 15–30 (mono list)│
│                       │                                    │
│                       │  short artist bio, present tense,  │
│                       │  no "passionate about art since..."│
└───────────────────────┴─────────────────────────────────┘
```

### `/request`

One question per full screen, generous space, progress shown as `01 / 06` mono counter (a real sequence — this is the one place `01/02/03` is legitimate because the steps genuinely are ordered). Final screen: honest expectations copy, no confirmation checkmark icon (no semantic green) — just bone-on-carbon text with a violet hairline rule.

---

## 3. Motion inventory

| Page | The one orchestrated moment | Everything else |
|---|---|---|
| `/` | Load sequence: nav hairline draws (600ms) → wordmark opacity/blur settle (900ms, house ease) → healed piece behind fades to 20% (700ms, overlapping tail). Session-gated, skippable on any input. | Scrubber drag is 1:1 with pointer, no easing. Door hover: 200ms opacity on the label only, no scale/lift. |
| `/work` | None — index is a list, no orchestration budget spent here. | Row hover: border-inline-start hairline changes graphite→stencil at 200ms. |
| `/work/[slug]` | Scroll-triggered stage reveal: reference→stencil→fresh→healed, one pinned viewport per stage, opacity crossfade at 900ms tied to scroll velocity via ScrollTrigger scrub. | Scrubber: pointer/keyboard 1:1, no transition lag. |
| `/flash` | Stencil lift: CSS mask radius follows pointer/drag, revealing artwork underneath; on release, mask completes to full reveal over 700ms house-ease if let go past 50%, or snaps back if released early. | Countdown ticks with no animation (mono digits swap instantly — a clock doesn't ease). |
| `/register` | None. Explicitly no orchestrated moment — plainness is the point. | Column sort: instant re-sort, no flip-animation (a ledger doesn't animate when re-sorted, it's just re-read). |
| `/studio` | None — static, calm page. | — |
| `/request` | Step transition: outgoing question opacity+8px translate-block out (300ms), incoming in (300ms, staggered 100ms) — one consistent transition reused per step, not "an animation," a mechanism. | Field focus: border graphite→transfer instant + 2px focus ring. |

Total orchestrated moments across the whole site: **5**, each different, each doing a different job. Nothing is decorative.

---

## 4. Where this could have gone generic, and what I did instead

1. **Hero.** Generic: full-bleed tattoo photo, centered headline, two buttons ("View Work" / "Book Now"). Instead: the wordmark *is* the hero, set at 160px on near-black with a single photo bleeding through at 20% opacity behind it — the type is the loudest thing on the page, the photo is atmosphere, not subject.
2. **Feature cards.** Generic: three equal cards (icon, bold title, two lines) for "Custom / Flash / Aftercare." Instead: two *unequal* doors (Commission / Vault) — the inequality itself communicates which path the studio wants most people to take, and there's no third card because Aftercare isn't a sales pitch, it lives on `/studio` as reference material.
3. **Portfolio grid.** Generic: masonry grid of square thumbnails, hover-zoom. Instead: `/work` is a single-column manifest, full-width rows, spec sheet beside each image — closer to flipping a physical folder than scrolling a feed.
4. **Countdown/urgency.** Generic: a red "ENDS IN" banner with pulsing digits. Instead: a flat mono timestamp, no color change, no urgency styling — scarcity here is structural (one-of-one, ever) so it doesn't need to be performed with graphic pressure.
5. **Form.** Generic: single-page form with a budget dropdown and a "Submit" button that says "Submit." Instead: one question per screen, no budget field (the application process itself is the qualifying filter), and the submit action is labeled with what happens next ("Send application") not a generic verb.
6. **Success/error states.** Generic: green checkmarks, red X's, toast notifications. Instead: no semantic color at all — states are communicated in bone-on-carbon text with a violet rule, exactly per the no-green/no-red constraint, which also means colorblind users lose nothing since the system never depended on hue to convey status.
7. **Testimonials.** Generic: carousel of client quote cards with 5-star icons. Instead: no testimonials exist on the site. The healed-piece scrubber is the entire trust argument; a quote card would be a strictly weaker version of the same claim the photo already makes.

---

## 5. Self-critique — "would I have built this for any other dark luxury site?"

- **Original instinct:** letter-by-letter wordmark reveal on homepage load, staggered per-character. **Verdict: yes, I'd do that for any luxury brand — cut.** Replaced with a single opacity/blur settle on the whole wordmark as one block (see §2/§3 above). A staggered per-letter reveal is the single most common "AI-luxury-site" tell; removing it was the most important edit in this pass.
- **Original instinct:** violet glow behind the wordmark for atmosphere. **Verdict: yes — this is exactly the "radial purple aura" ban in the brief. Cut entirely.** The healed photo at 20% opacity does the atmospheric job instead, and it's diegetic (an actual piece of work) rather than decorative light.
- **Original instinct:** hover states that scale/lift cards (`transform: scale(1.02)` on `:hover`). **Verdict: generic SaaS tell — cut.** Replaced with hairline-color changes and opacity only; nothing on this site scales or lifts on hover, which is a harder constraint than it sounds but keeps the "documented, not decorated" feel intact.
- **Original instinct:** a big pull-quote testimonial slab between the hero and the work grid, styled in italic display type. **Verdict: cut** — no testimonials exist per brand rule, and even a client "quote" about the process would read as borrowed authority the brand doesn't need. Replaced with the healed-piece scrubber directly under the fold — proof, not endorsement.
- **Original instinct:** icon set for aftercare timeline (bandage icon, droplet icon, sun icon). **Verdict: cut per the icon ban** — aftercare renders as a mono list with day-ranges as the only visual marker (`01–03`, `04–14`, `15–30`), which is also more legible and doesn't require sourcing/drawing a matching icon set.
- **Original instinct:** rounded pill-shaped buttons for CTAs, common in "premium minimal" templates. **Verdict: cut** — 0px radius everywhere per tokens, buttons are text with a hairline border and a fill-on-hover treatment, not a pill.
- **Original instinct:** stat row under the hero ("15 years experience / 400+ pieces / 4 countries"). **Verdict: cut**, directly banned in brief and also structurally dishonest here — the Register's row count is the only number the site is allowed to boast with, and it's real and it grows on its own.

Net effect of this pass: removed every purely decorative motion and every purely decorative color, and replaced two "trust" elements (testimonial, stat row) with the two mechanisms that actually are this brand's trust argument (the scrubber, the Register).

---

## 6. Open questions for the client (also in ASSETS-NEEDED.md)

1. PP Editorial New and Söhne are commercial licenses I don't have access to — using Newsreader (display) and Instrument Sans (body) as the free fallback for Latin type unless you can supply licensed `.woff2` files.
2. Placeholder photography is used throughout (colocated with each entry under `src/content/work/<slug>/` and `src/content/flash/<slug>/`, so Astro's image pipeline can optimize it like real photos will be) — real reference/stencil/fresh/healed photo sets are needed per dossier before this goes live; listed per-piece in ASSETS-NEEDED.md.
3. WhatsApp business number for the `wa.me` claim links — need the number to hardcode into the flash claim flow.
4. Confirm first drop timestamp for launch (brief specifies "first Thursday of the month, 20:00 Israel time" as the recurring rule — need the actual first date to seed `releaseAt`).

---

## 7. Post-build token refinements (accessibility pass)

Build, then a full Lighthouse + Playwright verification pass, surfaced two
places where the token system as originally specified didn't hold up under
real contrast math. Both are value refinements within the same 8-color
palette — no colors were added.

- **`--ash` was too dark to use as text.** At `#6E6875` on `--ink`, contrast
  measured 3.7:1 — below the 4.5:1 body-text requirement, and I'd flagged
  this risk in §1 but under-corrected for it (restricting it to "13px+ mono"
  doesn't actually clear the WCAG large-text bar, which starts at ~18.66px
  bold / 24px regular; registry metadata is well under that). Lightened to
  **`#847E8A`** — same hue family, now 5.0:1 on `--ink` and 4.7:1 on
  `--carbon`. Visually it reads as the same "quiet metadata gray," just
  legible.
- **`--stencil` doesn't pass as small text.** It was being used both as a
  border/fill color (fine — hairlines and card edges aren't held to text
  contrast rules) and, in several places, as the color of actual readable
  text at mono sizes (nav's "Request a consultation" link, flash status
  badges, register sort indicators, filter active-state, aftercare period
  labels): 3.16:1 on `--ink`, 2.92:1 on `--carbon`, both failing 4.5:1. Per
  the rule in §2 ("violet means provisional"), `--transfer` was always the
  correct choice for anything meant to be *read* rather than just *bounded*
  — it's already specced for "reveal moments and focus," and a CTA link or a
  status label is exactly that kind of moment. Every text-color usage of
  `--stencil` became `--transfer` (6.1:1 on `--ink`); every border/fill usage
  stayed `--stencil`. The homepage Vault door title was the one exception
  left as `--stencil` — at `--fs-2` (25px) it qualifies as large text, where
  3.16:1 clears the relaxed 3:1 threshold, and keeping it muted there (vs.
  the brighter reveal-color) is the more correct read of "provisional but not
  yet a call to action."

Net effect: Lighthouse accessibility is 100 on every page at both mobile and
desktop presets (was 95–97 before this pass, all from these two contrast
gaps). No visual character was lost — the palette still reads as the same
two violets doing two different jobs, just tuned so the job each one does
(border vs. text) actually works at the sizes used.
