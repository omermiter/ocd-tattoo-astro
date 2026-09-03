# OCD Tattoo — Assets to Draw

Production spec for every hand-drawn pixel-art asset the redesign in `REDESIGN-PLAN.md` needs. Every asset here is drawn by Omer — nothing in this list is generated, approximated in code, or sourced from anywhere else (see the brief's hard rule §0.1). Every unfilled asset renders as a loud magenta/black checkerboard placeholder at the exact final dimensions, printed with the asset ID, until it's dropped in (see "Placeholder system" at the end of this doc).

**P0 is 4 assets.** That's deliberate, not an oversight — see `REDESIGN-PLAN.md` §1 for why the redesign spends its one bold moment on the claim stamp and stays quiet everywhere else. A long P0 list would be the tell that the plan didn't actually decide anything.

---

## P0 — blocks launch (4 assets)

### `mark.png`

| Field | Spec |
|---|---|
| Purpose & placement | The site's glyph mark — Nav brand link (next to or replacing "OCD·TATTOO" text, your call which reads better once drawn), Footer identity row, Preloader's static fallback, and the source art `favicon.png` is derived from |
| Canvas size | **32×32 source** — corrects a sizing conflict in the old manifest, where the same file was called for at both 24px (footer) and 64px (preloader) from a 64×64 source, which can't both be clean integer scales. 32×32 source fixes this: |
| Display scaling | **1× → 32px** in Nav + Footer (a 32px mark instead of today's 24px — small, deliberate layout change, noted in the plan). **2× → 64px** in Preloader. Both integer. |
| Max color count | 6 including transparent |
| Palette | Draw from the house ink palette slots (`REDESIGN-PLAN.md` §2) — likely `--ink-provisional-dark-1`/`dark-2` for line work, one accent for a single color hit if the mark wants one. Your call on how literal ("OCD" lettering, a pixel-tattoo-needle glyph, an abstract grid mark) — this spec covers production constraints, not the concept itself. |
| Animation | Static |
| Transparency | Required |
| Readability floor | Must read as a coherent mark at 32×32 on a 375px viewport — it never displays smaller than that |
| Delivery | PNG, nearest-neighbor, no anti-aliasing, no premultiplied edges |
| Notes | This is the site's actual logo — the one asset that shows up in three unrelated places, so silhouette clarity matters more than detail. Avoid isolated 1px outline pixels; they disappear at 1× scale on some displays. |

### `favicon.png`

| Field | Spec |
|---|---|
| Purpose & placement | Browser tab icon — additive to the existing `favicon.svg` fallback, doesn't replace it |
| Canvas size | 32×32 source (also confirm it holds up shrunk to 16×16 — most browser tabs render at that size) |
| Display scaling | N/A — browser chrome renders this natively, not subject to our page's `image-rendering: pixelated` rule |
| Max color count | 6 including transparent |
| Palette | Same as `mark.png` — this can be a simplified/higher-contrast crop of the mark rather than a fully separate drawing, if that reads better at 16px |
| Animation | Static |
| Transparency | Required |
| Readability floor | Must read as *something*, not noise, at 16×16 — full detail from `mark.png` will likely need to simplify further |
| Delivery | PNG |
| Notes | Test it in an actual browser tab before calling it done — favicon legibility at real size is easy to overestimate looking at a zoomed-in canvas. |

### `stamp-claimed.png` — the redesign's one orchestrated moment

| Field | Spec |
|---|---|
| Purpose & placement | Register, per claimed flash row — replaces the plain-text-only claimed state with a hard-edged stamp animation that plays once when the row first scrolls into view. **This is the asset `REDESIGN-PLAN.md` §1 and §6 are built around.** The existing "Claimed · `{date}`" text stays as real HTML (Martian Mono) next to this graphic — draw a **mark/seal, not lettering**; legible pixel-drawn words at this size is a losing bet, a bold graphic symbol isn't. |
| Canvas size | 40×40 per frame, sprite strip = 40×`{frames}` total width, single row (matches the existing sprite-sheet convention already in the codebase — frame count is read automatically from width÷height at build time, nothing to configure) |
| Display scaling | Integer only — spec'd for 1× (40px) inline in the ledger row's status column on both mobile and desktop; if the built layout wants it larger, scale by a clean 2× (80px) rather than anything fractional |
| Max color count | 4 including transparent — this should read as a bold, simple mark, not an illustration |
| Palette | `--claim` (`#E3A23C`) as the primary stamp color, `--ink-provisional-dark-1` (`#1A1220`) for outline/shadow weight, `--ink-provisional-light-2` (`#FFFFFF`) for one small highlight/impact fleck, transparent ground |
| Animation | 5 frames, ~12fps (≈400ms total), **plays once, holds on the final frame — no loop.** Suggested beat: frame 1 approaching/raised, 2–3 impact (the stamp lands, maybe a slight radial "thud" cue built from hard pixel edges, never a blur), 4–5 settle to the final resting mark. |
| Transparency | Required |
| Readability floor | Must read clearly as "a stamp/seal has landed" at its native 40×40 on a 375px viewport, including mid-animation — a sneaker-drop "SOLD OUT" overlay reads instantly, aim for that same immediacy, not a detail you have to squint at to parse |
| Delivery | PNG, nearest-neighbor, no anti-aliasing, no premultiplied edges |
| Notes | Concept options to consider (your call): a circular official-stamp shape, a bold impact/burst mark, or something that visually reads as "permanently set" (a locked/sealed motif) — tying back to the site's actual thesis that a placed tattoo pixel can't be undone. Whatever the shape, it should feel like the *same object* as `stamp-available.png` below, just in its "after" state. |

### `stamp-available.png` — the claimed stamp's "before" state

| Field | Spec |
|---|---|
| Purpose & placement | Register, per available flash row, alongside the existing "Available →" claim toggle (doesn't replace the toggle — sits next to it as the numbered-edition/scarcity cue) |
| Canvas size | 40×40, single frame — same canvas as `stamp-claimed.png` on purpose |
| Display scaling | 1× (40px), same rule as above |
| Max color count | 4 including transparent |
| Palette | Same seal silhouette as `stamp-claimed.png`, but **hollow/outline treatment** in `--violet-ui` (`#A876A0`) or `--dust` (`#8F8796`) rather than filled gold — reads as "not stamped yet," the clear visual predecessor to the claimed state |
| Animation | Static |
| Transparency | Required |
| Readability floor | Same 40×40-at-375px floor as above |
| Delivery | PNG, nearest-neighbor, no anti-aliasing, no premultiplied edges |
| Notes | Draw this and `stamp-claimed.png` as a pair — same base shape, two conditions (hollow/hollow-violet vs. filled/gold-and-impact) — so a visitor scanning the Register feels the before/after relationship even without reading the "Available"/"Claimed" text next to it. |

---

## P1 — improves the page (not launch-blocking)

### `icon-instagram.png` / `icon-whatsapp.png`

| Field | Spec |
|---|---|
| Purpose & placement | Footer link icons — currently absent, links work fine as plain text today |
| Canvas size | 16×16 each |
| Display scaling | 1× (16px) |
| Max color count | 4 each, including transparent |
| Palette | Keep these recognizable — Instagram doesn't need to match house palette exactly (it's a third-party mark being referenced, not house art), WhatsApp icon should read in the WhatsApp-green family per `REDESIGN-PLAN.md` §2's WhatsApp decision |
| Animation | Static |
| Transparency | Required |
| Readability floor | Must read at 16×16 on a 375px viewport — this is their only display size |
| Delivery | PNG, nearest-neighbor |
| Notes | Simple glyph versions (a camera-ish mark, a speech-bubble mark) rather than literal logo reproductions — keep it as "a pixel-art icon in this site's hand," not a redrawn brand mark. |

### `pending-mark.png`

**Build note (Phase 2):** this one deliberately does *not* use the loud magenta-checkerboard placeholder system the other P0/P1 assets use. A screaming "MISSING ASSET" graphic stacked on a panel whose whole job is to calmly say "not photographed yet" sends two contradictory messages at once. It stays on the old graceful-fallback pattern instead: shows automatically once the file exists, renders nothing (not a placeholder) until then — same as it works today, just with an icon added on top once drawn.

| Field | Spec |
|---|---|
| Purpose & placement | Small glyph shown on `PieceMedia`'s "Photography pending" placeholder panel, alongside the existing serial + text — currently text-only |
| Canvas size | 32×32 |
| Display scaling | 1× or 2× depending on the placeholder panel's built size — confirm against layout once built |
| Max color count | 4 including transparent |
| Palette | `--dust`-family tones — this should read as quiet/in-progress, not as attention-grabbing as the claim stamp |
| Animation | Static |
| Transparency | Required |
| Readability floor | 32×32 at 375px |
| Delivery | PNG, nearest-neighbor |
| Notes | A camera-with-a-question-mark, a "coming soon" grid-fragment, or similar — reinforces the site's craft identity even on pieces that don't have a photo yet, rather than leaving that state as plain type only. |

### `404.png`

| Field | Spec |
|---|---|
| Purpose & placement | 404 page illustration — currently falls back to plain "404" mono text, which already reads intentional |
| Canvas size | Your call — existing CSS caps display at `max-width: 16rem` (256px), so a source in the 64–128px range scaled by a clean integer factor fits cleanly |
| Display scaling | Integer only — pick a source size that divides cleanly into something ≤256px |
| Max color count | 10 including transparent |
| Palette | House ink palette |
| Animation | Static, or a small static-hold sprite if you want a subtle idle animation — optional |
| Transparency | Required |
| Readability floor | Must read clearly at whatever final display size is chosen |
| Delivery | PNG, nearest-neighbor |
| Notes | Not urgent — the text fallback already works and reads fine. Only worth doing if there's a genuinely fun idea for it (a "piece that moved" visual gag fits the collectible-drop tone well, if one comes to mind). |

### `divider.png`

| Field | Spec |
|---|---|
| Purpose & placement | Optional homepage section divider tile — currently renders nothing at all (both instances) |
| Canvas size | Any width, 16px tall (repeatable horizontal tile) |
| Display scaling | 1× |
| Max color count | 4 including transparent |
| Palette | `--line`-adjacent, very quiet — this should not compete with the claim stamp for attention, see `REDESIGN-PLAN.md` §6 |
| Animation | Static |
| Transparency | Optional |
| Readability floor | N/A — decorative texture, not a readable element |
| Delivery | PNG, nearest-neighbor, seamlessly tileable horizontally |
| Notes | **Genuinely optional.** The plan's whole point is spending boldness in one place — a loud divider tile would fight that. Only draw this if a subtle, near-invisible texture idea comes to mind; the plain hairline rule already there works fine without it. |

### Cursor — reconsider, don't necessarily redraw

`cursor.png` (and its `cursor-default.png`/`cursor-hover.png` fallback tier) already exists and works. No spec table here because nothing is being newly commissioned — flagging instead: the existing cursor was drawn under the site's previous "austere luxury" direction (a crosshair shape — precise, a little clinical). Worth a quick look once the rest of the redesign is up to see whether it still fits the new "confident and fun" tone or reads mismatched next to the claim stamp and the warmer palette. If it still feels right, keep it exactly as-is — this is a "look again," not a redraw request.

---

## P2 — nice to have

### `preloader.png`

| Field | Spec |
|---|---|
| Purpose & placement | Homepage-only initial load animation — currently renders nothing (no sprite, no static mark yet, since `mark.png` doesn't exist today either) |
| Canvas size | 6–10 frame horizontal strip, square frames — pick a size that matches whatever `mark.png` becomes, since this is its animated counterpart |
| Display scaling | 1× or 2×, integer, matching `mark.png`'s display context |
| Max color count | 6 including transparent |
| Palette | House ink palette, likely a simple color-in or assembly animation of the `mark.png` shape |
| Animation | 6–10 frames, loops until dismissed (session-gated, skippable on any input — mechanism already built, just needs the asset) |
| Transparency | Required |
| Readability floor | Same floor as `mark.png` |
| Delivery | PNG, nearest-neighbor |
| Notes | Fully optional — once `mark.png` exists, the Preloader already has a working static-hold fallback (§ existing code), so this is pure polish, not a gap. |

---

## Placeholder system

Every asset in this doc that isn't yet dropped into `public/pixel-art/` renders as a **loud magenta/black checkerboard at the asset's exact final display dimensions**, with the asset ID printed on it — never a soft gray box, never a stock image, never anything that could be mistaken for finished work. Marked with `data-placeholder="{asset-id}"` so it's greppable. The build prints a one-line summary (`N placeholders remaining`) so it's always obvious how much art is left to drop in. This system doesn't exist in the codebase yet — it's part of Phase 2's build, not something already running today, and it only applies to the new/changed assets above; existing working assets (`cursor.png`, `hover-burst.png`) aren't touched by it.

The site must look structurally correct with every placeholder in — swapping real art in later is a file drop into `public/pixel-art/`, a rebuild, and nothing else, exactly like the existing manifest system already works today for every asset that hasn't been drawn yet.
