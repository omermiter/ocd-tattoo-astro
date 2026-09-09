# OCD Tattoo — Assets to Draw

Production spec for every hand-drawn pixel-art asset the redesign in `REDESIGN-PLAN.md` needs. Every asset here is drawn by Omer — nothing in this list is generated, approximated in code, or sourced from anywhere else (see the brief's hard rule §0.1). Every unfilled asset renders as a loud magenta/black checkerboard placeholder at the exact final dimensions, printed with the asset ID, until it's dropped in (see "Placeholder system" at the end of this doc).

**P0 is 2 assets.** That's deliberate, not an oversight — see `REDESIGN-PLAN.md` §1 for why the redesign stays quiet and text-first on the Register rather than adding a graphic claim/status mark. A long P0 list would be the tell that the plan didn't actually decide anything.

---

## P0 — blocks launch (0 remaining of 2)

### `mark.png` — ✅ done

Delivered from Omer's own hand-drawn "OCD" mark (a circle/C-shape/D-shape composition) — processed (trimmed, stroke-weight boosted so the thin line survives downsampling, recolored to `--violet` `#6E3F5E`, background dropped for transparency), not redrawn or generated. Actual canvas ended up **20×40**, not the originally-guessed 32×32 square: the source art is a tall vertical composition (true aspect ≈ 0.45), and forcing that into a square would have either squeezed it thin or left it swimming in empty padding. Displayed at 1× (20×40) in Nav + Footer, 2× (40×80) in the Preloader — `src/lib/placeholders.ts`, `astro.config.mjs`, and the three consuming components were all updated to match. Original spec (kept below, struck through in spirit, not literally) assumed a 32×32 square; noting the deviation here rather than silently rewriting history.

<details>
<summary>Original pre-art spec (superseded)</summary>

| Field | Spec |
|---|---|
| Purpose & placement | The site's glyph mark — Nav brand link, Footer identity row, Preloader's static fallback, and the source art `favicon.png` is derived from |
| Canvas size | 32×32 source (guessed, before real art existed) |
| Display scaling | 1× → 32px in Nav + Footer, 2× → 64px in Preloader |

</details>

### `favicon.png` — ✅ done

Cropped from the same drawing — just the "O" circle, since the full tall mark doesn't fit a square favicon at 16–32px legibly. Same processing treatment (thickened stroke, violet, transparent). Delivered at 32×32 as originally spec'd. Verified served correctly (`<link rel="icon" href="/pixel-art/favicon.png" sizes="32x32">`, `200 image/png`) and visually checked at native size before shipping — a small natural gap where the original stroke had a stray tangent line reads as an intentional break, not a rendering error.

---

## P1 — improves the page (not launch-blocking)

### `icon-instagram.png` — ✅ done

Provided by Omer: the classic retro-camera Instagram mark (pre-2016 icon style), already pixelated and already in almost exactly the site's `--violet` hex (sampled source: `#6E3F5F`, one bit off `--violet`'s `#6E3F5E`) — snapped to the precise token value, cropped, downsampled to 16×16, background dropped for transparency. Same reasoning as `icon-whatsapp.png` on referencing the real platform mark for a "links to Instagram" icon rather than an original glyph. Verified legible at true native 16×16.

### `icon-whatsapp.png` — ✅ done

Provided by Omer as a pixelated rendering of WhatsApp's actual mark (not hand-drawn freehand the way the site mark was) — recolored to the site's exact `--whatsapp` token (`#25D366`, sampled source was a slightly different green) so it matches every other WhatsApp mention site-wide, background dropped for transparency, cropped/centered to a clean 16×16. Using the real WhatsApp mark here is standard, accepted practice for a "click to open WhatsApp" icon (functional/nominative reference to the service being linked to, the same way any site's social-icon row works) — different in kind from the "no copyrighted characters" concern that applies to portfolio/product content. Verified legible at true native 16×16, not just zoomed.

### `pending-mark.png`

**Build note (Phase 2):** this one deliberately does *not* use the loud magenta-checkerboard placeholder system the other P0/P1 assets use. A screaming "MISSING ASSET" graphic stacked on a panel whose whole job is to calmly say "not photographed yet" sends two contradictory messages at once. It stays on the old graceful-fallback pattern instead: shows automatically once the file exists, renders nothing (not a placeholder) until then — same as it works today, just with an icon added on top once drawn.

| Field | Spec |
|---|---|
| Purpose & placement | Small glyph shown on `PieceMedia`'s "Photography pending" placeholder panel, alongside the existing serial + text — currently text-only |
| Canvas size | 32×32 |
| Display scaling | 1× or 2× depending on the placeholder panel's built size — confirm against layout once built |
| Max color count | 4 including transparent |
| Palette | `--dust`-family tones — this should read as quiet/in-progress, not attention-grabbing |
| Animation | Static |
| Transparency | Required |
| Readability floor | 32×32 at 375px |
| Delivery | PNG, nearest-neighbor |
| Notes | A camera-with-a-question-mark, a "coming soon" grid-fragment, or similar — reinforces the site's craft identity even on pieces that don't have a photo yet, rather than leaving that state as plain type only. |

### `404.png` — now a fullscreen background, not a small icon

**Changed after the first pass:** originally spec'd as a small 256px icon above the heading. Now a full-bleed background behind the whole page (`main.not-found` is `min-block-size: 100vh`, a dark scrim sits over it for text legibility, same technique as the homepage hero).

**This breaks the "integer scaling only" rule, on purpose.** Every other pixel-art asset on this site displays at a fixed size, so a source canvas can always divide evenly into it. A fullscreen background can't do that — viewport widths run anywhere from ~375px to 1440px+ with nothing dividing cleanly into all of them. So this one asset is treated like the hero photo instead: `object-fit: cover`, smooth-scaled, **not** `image-rendering: pixelated`. It'll still read as pixel art because it's *drawn* as pixel art (a visible grid, flat color blocks) — it just won't be crisp-edge-perfect at every viewport size, the same tradeoff the hero photo already makes.

| Field | Spec |
|---|---|
| Purpose & placement | Fullscreen background on the 404 page, behind a dark scrim and the "Page not found" text |
| Canvas size | **192×108 (16:9)** — wide enough to read as a real scene rather than an icon, standard enough a ratio to crop sensibly via `cover` on both portrait mobile and landscape desktop |
| Display scaling | **Not integer** — `object-fit: cover`, fills `100vh` at whatever the actual viewport is. Deliberate exception, see above. |
| Max color count | 10, including transparent (transparency here just means "no forced opacity" — the image can be fully opaque art since the scrim handles text contrast, but keep the format capable of transparency for flexibility) |
| Palette | House ink palette |
| Animation | Static |
| Transparency | Optional (the scrim, not the art, carries the contrast job) |
| Readability floor | Must still read as a coherent scene when cropped tighter than its own aspect ratio (a tall mobile viewport will show a cropped slice of the middle, not the full width) — keep the important part of the composition centered |
| Delivery | PNG. Since this one isn't nearest-neighbor/pixelated at display time, mild built-in anti-aliasing in the source won't hurt the way it would on an icon — but keep it drawn as flat pixel-grid color blocks, not a painterly illustration, so it still reads as *this site's* pixel art and not a different medium entirely |
| Notes | Not urgent — the grid-texture fallback (same motif as the hero/placeholder panels) already reads intentional. Only worth doing if there's a genuinely fun scene in mind (a "piece that moved" gag fits the collectible-drop tone well). |

### `divider.png`

| Field | Spec |
|---|---|
| Purpose & placement | Optional homepage section divider tile — currently renders nothing at all (both instances) |
| Canvas size | Any width, 16px tall (repeatable horizontal tile) |
| Display scaling | 1× |
| Max color count | 4 including transparent |
| Palette | `--line`-adjacent, very quiet — see `REDESIGN-PLAN.md` §6 |
| Animation | Static |
| Transparency | Optional |
| Readability floor | N/A — decorative texture, not a readable element |
| Delivery | PNG, nearest-neighbor, seamlessly tileable horizontally |
| Notes | **Genuinely optional.** The plan's whole point is spending boldness in one place — a loud divider tile would fight that. Only draw this if a subtle, near-invisible texture idea comes to mind; the plain hairline rule already there works fine without it. |

### Cursor — reconsider, don't necessarily redraw

`cursor.png` (and its `cursor-default.png`/`cursor-hover.png` fallback tier) already exists and works. No spec table here because nothing is being newly commissioned — flagging instead: the existing cursor was drawn under the site's previous "austere luxury" direction (a crosshair shape — precise, a little clinical). Worth a quick look once the rest of the redesign is up to see whether it still fits the new "confident and fun" tone or reads mismatched next to the warmer palette. If it still feels right, keep it exactly as-is — this is a "look again," not a redraw request.

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
