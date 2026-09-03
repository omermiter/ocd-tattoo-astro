# OCD Tattoo — Redesign Plan (Phase 1, Checkpoint 2)

Built against `REDESIGN-INVENTORY.md` and `REDESIGN-FUNNEL-MAP.md`. Every inventory line is accounted for in §7. Nothing here is built yet — this is the plan, held for go-ahead per §8 of the brief.

---

## 1. Concept

**The one memorable thing: the claim stamp.** Every flash design on the Register already has an edition number and a status — that's real drop mechanics, not decoration, and it's currently rendered as a plain text ledger row. The redesign gives it a physical moment: when an available design is claimed, a hard-edged, hand-drawn stamp — no blur, no gradient, no easing curve, a flip-book of 4–6 pixel frames landing in one decisive strike — marks it "CLAIMED · No. `{n}`" in the one color reserved for actions on this site, and the row's color drains to the neutral "retired" state around it. It's the sneaker-drop "SOLD OUT" overlay and the Bearbrick numbered box in one gesture, and it's honest to the actual work: a tattoo is a pixel placed once, no undo, and claiming a design is the site's own version of that — a decision that can't be taken back, shown as one. Every other page stays disciplined and quiet around it: the grid backdrop (already built, kept), real tattoo photography treated as precious and unfiltered, generous space, and text that reads like a catalog entry, not a caption. One stamp, everywhere else restraint.

---

## 2. Color

### Environment (the base, near-monochrome)

| Token | Value | Role | Contrast (on `--ink` unless noted) |
|---|---|---|---|
| `--ink` | `#120E17` | Base ground — violet-black, not neutral black | — |
| `--surface` | `#1C1620` | Raised panel fill (cards, form fields' resting state) | — |
| `--line` | `#332A3B` | Hairline borders, dividers — decorative/structural, exempt from text contrast rules | 1.39:1 (fine, non-text) |
| `--paper` | `#EDE9E2` | Primary text | 15.76:1 ✅ AAA |
| `--dust` | `#8F8796` | Secondary/metadata text | 5.52:1 ✅ AA |

`--ink` and `--surface` replace the current `#08080A`/`#131215` — same near-black *feel*, but every stop now carries a measurable violet cast (verified: `#120E17` is R18 G14 B23, blue channel highest) instead of reading as tinted neutral black. `--paper` and `--dust` are barely touched (kept `--paper` exactly; nudged `--dust` from `#86828C` slightly toward the violet family to sit correctly against the new ground — still 5.52:1, comfortably AA).

### Brand accent (stencil violet — kept, job changed)

| Token | Value | Role | Contrast on `--ink` |
|---|---|---|---|
| `--violet` | `#6E3F5E` | Structural fills only — the PrecisionGrid spotlight, the stencil-draw motif, low-emphasis backgrounds. Never text, never a border meant to be read as an affordance. | 2.30:1 (not text-bearing, no requirement) |
| `--violet-display` | `#9A6485` | Large display text only (≥24px) — the hero's emphasized word, section headings if ever needed | 4.12:1 ✅ AA-large (3:1 min) — **fails AA-normal, do not use below 24px/18.66px-bold** |
| `--violet-ui` | `#A876A0` | Small UI text — nav link hover/current-page, inline text links, anywhere violet needs to sit under ~20px | 5.24:1 ✅ AA-normal |

This is a real, deliberate split from the current single `--violet-bright`, found by actually computing the numbers (see inventory's instruction to check, not assume): the existing `#9A6485` passes for the hero's large emphasized word but falls short (4.12:1) the moment it's reused at nav-link size, which the current site does today. `--violet-ui` is the fix — same hue family, lightened just enough to clear 4.5:1 at small sizes.

Violet no longer touches a single button, submit action, or CTA anywhere on the site. It's the stencil, not the sale.

### The action color (new, exclusive)

| Token | Value | Role | Contrast |
|---|---|---|---|
| `--claim` | `#E3A23C` | The **only** color that means "tap this." Every primary CTA (Start a commission, Send, the claim toggle, the claim-stamp itself) and nothing else, ever — no decorative use, no background tints, no hover states on non-interactive elements. | 8.63:1 on `--ink` ✅ AAA both directions (works as text-on-dark or as a filled button with `--ink` text on top) |

Warm amber-gold: reads as a foil stamp / hallmark / seal of authenticity — the collectible-object cue (a numbered print's gold sticker, an art toy's certificate) — and it's nowhere else in the palette family, so it can't be mistaken for anything decorative. It's also the literal color of the claim stamp described in §1, which is what ties the action color to the one memorable moment instead of the two living separate lives.

### WhatsApp — kept as its own green, deliberately

**Decision: WhatsApp-destined links keep WhatsApp's real brand green (`#25D366`, 9.62:1 on `--ink` ✅ AAA), not `--claim`.**

Defense: `--claim` means "act here, on this page" (submit a form, expand a claim panel). Every WhatsApp link on this site means the opposite — "you're about to leave this page for a different app entirely" (claim confirmation, footer, and the contact-form's error fallback all hand off to WhatsApp). That's a real, useful distinction for a visitor to be able to tell at a glance, and WhatsApp's green is already universally pre-loaded with exactly that meaning from every other site that uses it the same way. Making it gold would cohere visually but would erase a real signal (this click leaves the site) for no gain — the brief asks me to defend a deliberate choice here, and "two colors that mean two different true things" beats "one color pretending WhatsApp is the same kind of action as a form submit."

### House ink palette — slots only, provisional, blocking

**Omer defines the real values from his actual ink (Eternal/Fusion), not me.** What follows is the *slot* proposal — how many of what, and what each is structurally for — with placeholder hex so the site isn't broken while real values are pending. Every value below is a CSS custom property named `--ink-provisional-*` and is listed as a **blocking P0 item** until replaced.

```
; OCD Tattoo — house ink palette (SLOT PROPOSAL, provisional hex — Omer to replace)
; Lospec-style hex list, 14 slots

; Structure — 3
--ink-provisional-dark-1   #1A1220   ; deepest line/shadow value used inside the art itself
--ink-provisional-dark-2   #2E1D2E   ; secondary shadow / outline
--ink-provisional-dark-3   #4A2E3F   ; transitional dark, avoids a hard jump to midtones

; Neutrals / skin-adjacent — 2
--ink-provisional-mid-1    #C9A98C   ; mid skin-adjacent tone, used where art sits directly against a photo
--ink-provisional-mid-2    #8C6F5C   ; darker skin-adjacent / shading tone

; Highlights — 2
--ink-provisional-light-1  #F2E2C8   ; warm highlight, healed-ink glow
--ink-provisional-light-2  #FFFFFF   ; true white, used sparingly — specular points only

; Accent hues — 7 (the actual "color" in color pixel art; one full stop each around the wheel, matched loosely to common tattoo-ink families)
--ink-provisional-red      #C43B3B
--ink-provisional-orange   #D97B3F
--ink-provisional-gold     #E3A23C   ; NOTE: matches --claim exactly on purpose in this placeholder — Omer should confirm whether the real "gold" ink and the UI action color are allowed to coincide, or whether they need to diverge once real values land
--ink-provisional-green    #4C9B6E
--ink-provisional-blue     #3E7FB0
--ink-provisional-violet   #6E3F5E   ; NOTE: matches --violet exactly on purpose in this placeholder, for the same reason
--ink-provisional-pink     #C25B84
```

Slot count and reasoning: 3 darks give the art real shadow depth without crushing to pure black (tattoos on skin never go true-black in practice); 2 skin-adjacent neutrals exist because pixel art on this site sits directly against real photography, not a white canvas, and needs at least one value that can bridge to skin tone convincingly; 2 highlights (one warm, one true white reserved for specular hits only, so it stays rare and meaningful); 7 accents is enough range to cover a real color piece (the Register already spans red/blue/green/etc. by title alone — Pixel Rose, Grid Skull, Color Block Heart) without ballooning past what one artist's hand-mixed ink set actually is. 14 total, inside the 12–16 the brief asks for.

**Open question for Omer, flagged not resolved:** the placeholder deliberately reuses `--claim`'s exact gold and `--violet`'s exact plum for two of the accent slots, since those already have to exist as real, tested colors for the UI regardless. If Omer's real ink doesn't happen to include something in that family, the UI tokens and the art palette simply diverge — not a problem, just noting the coincidence was intentional in the placeholder, not a requirement.

---

## 3. Type

**Kept: the existing three-family system, roles sharpened rather than replaced.**

| Family | Role | Sizes / weights in use |
|---|---|---|
| **Fraunces** (serif, existing) | Display only — H1s, closing-section H2s, the emphasized word in the hero | 300 (headings), 400 normal + 400 italic (the `<em>` emphasis treatment, kept), 500 (rare, heavy emphasis if ever needed). Sizes: `--fs-display-sm/md/lg` fluid clamps, unchanged from current tokens. |
| **Archivo** (sans, existing) | Body copy, form fields, all reading-length text | 400 body, 500/600 for the rare bolded inline moment, 700 unused today (kept available, not newly assigned) |
| **Martian Mono** (mono, existing) | The "data" register: serials, edition numbers, spec tables, nav labels, eyebrows, ledger columns, form labels | 400 default, 500 for the claim-stamp's edition number specifically (needs to read as slightly heavier/stamped, not just another data label) |

**No pixel typeface ships in this pass.** Considered specifically for the claim-stamp's edition number (a tiny "No. 004" in a hand-pixeled numeral face would be a nice extra layer of craft) and explicitly rejected for v1: it's the single highest-risk move toward the retro-gaming-kitsch failure mode the brief calls out by name, it opens a font-licensing/hand-drawing question this plan shouldn't quietly resolve on its own, and Martian Mono already carries the "manufactured, precise, data-plate" feeling the stamp needs without it. Flagging as a considered-and-cut P2 idea, not an oversight — worth revisiting once the stamp motif is live and proven, not before.

Scale itself is unchanged from `tokens.css` (`--fs-00` through `--fs-3`, plus the three display clamps) — it already has real range and a defensible ratio (~1.25) and nothing in this redesign needs more sizes, just the same sizes applied with the role table above.

---

## 4. Grid — the unit system

Two separate systems, kept separate on purpose (conflating "the visible backdrop grid" with "the pixel-art construction unit" is a common mistake that makes neither one legible):

**Layout grid (visual motif):** `--grid-unit: 28px`, unchanged from the current token, still the literal background texture in the hero and placeholder panels (`.grid-texture`). Not a strict spacing multiplier — the existing space scale (`--sp-1` 8px through `--sp-7` 188px) is a separate, already-coherent progression and doesn't need to be forced onto 28px multiples to read as "the grid." The `--grid-unit` stays purely the backdrop's own unit.

**Sprite/pixel-art construction unit:** every hand-drawn asset's source canvas is sized in multiples of **8px** (32, 48, 64, 96, 128 — see `ASSETS-TO-DRAW.md` for the exact size per asset) and scaled up in CSS by **integer factors only** (1×/2×/3×/4×, enforced via `image-rendering: pixelated`, never a fractional scale — if a layout would demand 2.4×, the layout changes, not the art). This is the literal expression of "each pixel is a deliberate, irreversible decision": the construction unit is fixed and small, and everything built from it snaps.

**Breakpoints:** the three existing width breakpoints (640 / 700 / 800) stay — they're not on any particular multiple of either grid, they're content-driven (where each specific layout actually breaks), and the brief doesn't ask for a breakpoint-count change, only a visual-direction change. No new breakpoints are needed for this redesign; every layout in §6 works within the existing three.

---

## 5. Layout — wireframes

Mobile = 375px reference. Desktop = 1440px reference. Both existing breakpoints (Nav's 640, the two 800s, FlashRow's 700) still apply between these two references exactly as documented in the inventory — these wireframes show the two ends, not every intermediate state.

### Home — mobile (375)

```
┌─────────────────────────────┐
│ OCD·TATTOO            ☰     │ ← Nav, sticky-at-top, unchanged structurally
├─────────────────────────────┤
│                               
│   [grid-texture draws in]    
│   OCD TATTOO                 ← eyebrow
│                               
│   Pixel Art, Held to a       
│   Realist's Standard.        ← H1, "Realist's" in --violet-display
│                               ← hero photo full-bleed behind, PrecisionGrid
│                               spotlight kept (fine-pointer only anyway,
│                               so mobile just gets the static grid-draw-in)
├─────────────────────────────┤
│ Every square drawn,          
│ stenciled, and placed...     ← beat line
│              View the Register →  ← --claim color, first CTA
├─────────────────────────────┤
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │ ← hairline, divider tile optional/cut (P2)
├─────────────────────────────┤
│ PIECES                        
│ A growing collection...      
│                               
│ ┌───────────────────────┐   
│ │  [piece photo, 4:5]   │   ← PieceMedia, unchanged crop logic
│ └───────────────────────┘   
│  OCD·01                      
│  {title}                      
│  Placement  Ribs  Size  7cm  
│  Sessions 1       Hours 4    
│  {note}                       
│  (repeat per piece)          
│                               
│      View all pieces →       
├─────────────────────────────┤
│ THE REGISTER                  
│ One-of-one flash designs...  
│                               
│ OCD-F02  Grid Skull           
│  Calf          9cm            
│  [CLAIMED STAMP — the one     ← was: plain "Claimed" text.
│   orchestrated moment,        Now: the hard-edged stamp graphic,
│   plays once on first         --claim gold, plays once per row
│   scroll-into-view]           on first reveal, then holds static.
│ (repeat, 5 rows, unchanged    
│  data columns otherwise)      
│                               
│       View the Register →     
├─────────────────────────────┤
│  Commissions are held to      
│  the same standard.           
│  Reviewed personally...       
│      Start a commission →     ← --claim color
├─────────────────────────────┤
│ [mark] @ocd_tattoo · Israel   
│         Instagram   WhatsApp  ← WhatsApp link stays #25D366
└─────────────────────────────┘
```

### Home — desktop (1440)

```
┌──────────────────────────────────────────────────────────────────────┐
│ OCD·TATTOO                                PIECES  REGISTER  CONTACT   │
├──────────────────────────────────────────────────────────────────────┤
│                                                                          
│                     OCD TATTOO                                         
│                     Pixel Art, Held to a Realist's Standard.           
│                     [hero photo full-bleed, grid draw-in +              
│                      pointer-tracked spotlight — kept as-is]            
│                                                                          
├──────────────────────────────────────────────────────────────────────┤
│  Every square drawn, stenciled, and placed...     View the Register →  │
├──────────────────────────────────────────────────────────────────────┤
│  PIECES                                                                 
│  A growing collection of pixel art tattoos...                          
│                                                                          
│  ┌──────────────┐  OCD·01                                             
│  │ piece photo  │  {title}                                             
│  │  (4:5, capped│  Placement  Ribs      Size   7cm                     
│  │   26rem —    │  Sessions   1         Hours  4                       
│  │   unchanged  │  Date       2026.05                                  
│  │   this       │  {note text}                                         
│  │   session)   │                                                      
│  └──────────────┘                                                      
│  (repeat per piece, same two-column row layout, unchanged structurally)
│                                                    View all pieces →    
├──────────────────────────────────────────────────────────────────────┤
│  THE REGISTER                                                          
│  One-of-one flash designs...                                           
│  ┌────────────────────────────────────────────────────────────────┐  
│  │ OCD-F01  Pixel Rose   Forearm  8cm  16×16    [Available →]      │  
│  │ OCD-F02  Grid Skull   Calf     9cm  24×24    [CLAIMED STAMP]     │  
│  │ ... (5 rows, same 6-col grid as today, unchanged column widths) │  
│  └────────────────────────────────────────────────────────────────┘  
│                                                    View the Register →  │
├──────────────────────────────────────────────────────────────────────┤
│           Commissions are held to the same standard.                   
│           Reviewed personally, not queued...                           
│                    Start a commission →                                │
├──────────────────────────────────────────────────────────────────────┤
│ [mark] @ocd_tattoo · Israel                       Instagram  WhatsApp  │
└──────────────────────────────────────────────────────────────────────┘
```

### `/pieces/` — both breakpoints

Structurally identical to Home's Pieces section, just full-width as the whole page: header (eyebrow/H1/intro) → full piece list (all entries, same row layout as above, stacked on mobile per the existing 800px breakpoint) → closing CTA ("Want something like this?" → Start a commission) → footer. No new sections, no removed sections — this page's job doesn't change, only the token/color/motion layer under it.

### `/register/` — mobile (375)

```
┌─────────────────────────────┐
│ OCD·TATTOO             ☰    │
├─────────────────────────────┤
│ THE REGISTER                 
│ One-of-one, always.          
│ Every flash design here...   
│ 3 of 6 available              ← --claim color (was --violet-bright)
├─────────────────────────────┤
│ 8×8 (1)                       
│  OCD-F04  Color Block Heart  
│  Wrist  6cm                  
│  [CLAIMED STAMP]              
├─────────────────────────────┤
│ 16×16 (2)                     
│  OCD-F01  Pixel Rose          
│  Forearm  8cm  [Available →] │ ← --claim gold, was --violet-bright
│  OCD-F03  Pixel Snake         
│  Shin  10cm    [Available →] │
├─────────────────────────────┤
│ 24×24 (2) / 32×32 (1) — same pattern, grouped by grid size, unchanged
├─────────────────────────────┤
│  Don't see what you want?     
│  Flash is first-come...       
│      Start a commission →     
├─────────────────────────────┤
│ Footer — unchanged from Home  
└─────────────────────────────┘
```

### `/register/` — desktop (1440)

Same content, same grouping-by-grid-size structure, laid out at the existing 6-column ledger width (unchanged column proportions: `8rem 1fr 7rem 4.5rem 4.5rem 9rem`) inside `--content-max` (84rem). The only visual change per row is the color/motion layer: available rows' toggle and claimed rows' stamp both move onto the new token system described in §2 and §1.

### `/contact/` — both breakpoints

Unchanged structurally at both sizes: header (eyebrow/H1/intro) → three-field form → submit + status line → footer. Only the submit button and focus-ring color move from `--violet`/`--violet-bright` to `--claim` (this is the site's single highest-intent action — it should read as the same color family as every other "act now" moment, not a one-off). Error state's inline WhatsApp link keeps `#25D366`, consistent with §2's WhatsApp decision.

### `/404` — both breakpoints

Unchanged structurally: illustration-or-text-fallback → H1 → intro → back link. The "← Back to Pieces" link moves to `--violet-ui` (it's a small text link, not a primary action — this is exactly the case §2 built `--violet-ui` for).

---

## 6. Motion — the one orchestrated moment, and what happens to everything else

**The moment:** the claim stamp, described in §1. Technically: a hand-drawn sprite strip (4–6 frames, see `ASSETS-TO-DRAW.md` P0), stepped with CSS `steps()` timing (matching the existing `.pixel-sprite` pattern already in `pixel-art.css` — no new animation technique needed, the codebase already has the right primitive), triggered once per row the first time it scrolls into view (piggybacking on the existing `IntersectionObserver` pattern already used for `[data-reveal]` and the hover-burst/divider lazy-load, not a new mechanism). Total play time under 400ms. No loop. No replay on hover. `prefers-reduced-motion` swaps it for an instant static swap to the final stamped state — the *result* (claimed, marked) is never motion-gated, only the *flourish* is.

**Everything else gets quieter, not louder.** The brief calls out "fade-and-slide-up on every section plus hover transitions on every card" as the generated-page default it will reject — and that's close to what the current site already does everywhere via `[data-reveal]` (opacity 0 → 1, translateY 22px → 0, on nearly every section on every page). That pattern isn't being ripped out — removing working, tested motion wholesale isn't the brief's ask either — but it stops being *a* design statement and goes back to being plumbing: kept as a fast, small, low-travel settle (shorter distance, shorter duration than today) so content doesn't just pop in, but it is explicitly not competing with the stamp for attention. The PrecisionGrid hero spotlight is kept exactly as built (fine-pointer + motion-OK gated already, and it's already disciplined — a single soft light following the cursor over a grid, not a barrage of hover effects). No new hover-per-card treatment is being added anywhere (the piece-thumbnail lift-and-burst hover was already removed this session, before this brief arrived, and stays removed — it was exactly the "hover transition on every card" pattern the brief warns against, so its removal turns out to already be correct under this new plan without any further change needed there).

---

## 7. Section-by-section mapping

Every checklist line from `REDESIGN-INVENTORY.md`, mapped to its redesign treatment. "Unchanged" means: same structure, same content, same interaction — only the token layer (color/motion) it sits on changes per §2/§6 above, nothing about what it does or where it lives moves.

| Inventory item | Becomes |
|---|---|
| §1 Pages — all 5 routes + `/admin/` | Unchanged route set. `/admin/` untouched by this redesign (it's Decap's own UI, out of scope). |
| §2 Home: Preloader | Unchanged mechanism; visual only changes if `mark.png`/`preloader.png` assets change (see Assets doc) |
| §2 Home: Nav | Unchanged structure; Contact link's permanent-highlight color moves from violet to `--claim` (it's the site's evergreen primary CTA — see §2 color reasoning) |
| §2 Home: Hero (eyebrow/H1/photo) | Unchanged copy and structure; token layer only (§2, §5) |
| §2 Home: Beat strip + CTA | Unchanged; CTA color → `--claim` |
| §2 Home: Pixel dividers (×2) | Kept optional/P2 — see §5 Layout note; renders nothing until/unless `divider.png` is drawn, same graceful-absence behavior as today |
| §2 Home: Pieces section (header + list + CTA) | Unchanged structure/copy; CTA color → `--claim` |
| §2 Home: Register preview (5-row ledger) | Unchanged content/columns; status column starts using the new claimed/available token colors. **Flagged in the funnel map as non-interactive/non-linked — this redesign doesn't add a claim affordance here, keeping funnel behavior identical per §4's "never restructure the funnel unilaterally"; recommending it as a Phase-2-adjacent follow-up, not doing it now.** |
| §2 Home: Closing CTA | Unchanged; CTA color → `--claim` |
| §2 Home: Footer | Unchanged; WhatsApp link keeps `#25D366`, Instagram link moves to `--violet-ui` |
| §2 `/pieces/`: all sections | Unchanged structure (see §5); CTA → `--claim` |
| §2 `/register/`: header, count, size-sections, ledger, claim panel, closing CTA | Unchanged structure (see §5); available toggle + claim-panel WhatsApp link keep their respective §2 colors; **claimed state becomes the stamp moment (§1/§6)** |
| §2 `/contact/`: header, form, submit, status | Unchanged structure; submit button + focus rings → `--claim`; error-state WhatsApp link keeps `#25D366` |
| §2 `/404`: illustration-or-fallback, heading, link | Unchanged structure; back-link → `--violet-ui` |
| §3 Every component listed | All 11 components kept, all still in use, none deprecated. `PieceMedia`'s hover-lift (already removed pre-brief) stays removed — consistent with §6's motion discipline, not a new decision. |
| §4 Every interactive element listed | All kept, same triggers, same a11y attributes. Claim toggle gains the stamp as its "claimed" resting state; nothing about *how* it's triggered changes. |
| §5 Every state listed | All kept. Claimed-row state visually becomes the stamp instead of grey text — same underlying `status-claimed` branch in the code, new rendering. |
| §6 Every breakpoint | All 5 kept unchanged (§4 above) |
| §7 assets | Real photography (pieces, hero) — untouched, still photography, never pixelated. Pixel-art manifest — see `ASSETS-TO-DRAW.md` for what's new/changed. `scratch-hero-bg.jpg` — already deleted this session (dead, never committed). `hover-burst.png` — already marked unused this session; recommend leaving the file in place (real hand-drawn art the artist supplied) but it has no home in this plan either, consistent with dropping the hover-lift pattern per §6. |
| §8 Every copy string | **All kept verbatim, zero rewrites.** The brief's tone shift is about the visual system, not a copy rewrite — the existing copy ("I read every message myself," "not a portfolio in the volume sense — a record," the whole register/claim copy) already reads confident and specific in exactly the way §2's positioning wants; changing it wasn't asked for and isn't needed. Only exception: none. If new copy is ever needed for a new element, there isn't one in this plan — every element mapped above already has its copy from today. |
| §9 Every outbound link | All kept, all same destinations. Color treatment per §2. |
| §10 Analytics | Cloudflare Web Analytics beacon — kept, untouched. No new event tracking added in this pass (that's a recommendation for later, flagged in the funnel map, not a Phase 1 decision to make unilaterally per §4). |
| §11 Env vars / config | `ALLOWED_ORIGIN` CORS fix — already shipped this session, ahead of this plan. Everything else unchanged. |
| §12 Metadata | Unchanged in this pass — `og:image`/structured data/sitemap gaps were noted in the inventory as pre-existing absences, not something this visual redesign is scoped to add. Flagging again here so it isn't mistaken for an oversight: it's out of this plan's scope, not forgotten. |
| §13 Accessibility features | All kept and re-verified against the new color tokens in §2 (contrast numbers computed above). Skip-link absence — noted in the inventory as absent, still absent after this plan; not something the brief's visual-direction scope asked to add, flagging rather than silently adding scope. |
| §14 Language/i18n | Untouched, per the brief's own explicit instruction. |

---

## 8. Self-critique

**Color.** The generic default here is "keep violet as the accent, put it on the buttons, done" — that's what the current site already does, and it's exactly backwards for saturated pixel art: a violet button competes with a red-and-blue Pokémon-style piece for the eye's first stop. The other generic move would be to swap violet out entirely for something "friendlier" (a SaaS teal, a candy pink) chasing the "fun" half of "confident and fun" — rejected because the brief is explicit that the purple is the one non-negotiable brand element, and because inventing a second identity color when the site already has a correct one that just needs a new job is more work for a worse result. Landing on "keep the hue, move its job to structure, hire a completely new hue for action" is the less obvious but more disciplined answer.

**Type.** The generic default for "pixel art tattoo site" is a pixel display font on every headline — it's the single fastest way to signal "this is about pixel art" and the single fastest way to land in the retro-gaming-kitsch trap the brief names directly. Rejecting it everywhere, including the one place it was genuinely tempting (the claim-stamp's edition number), is the harder, more disciplined call — the temptation there specifically is that it's a small, contained, load-bearing detail where kitsch risk feels lower, and I still cut it for v1 rather than rationalize an exception.

**Motion.** The generic default is exactly what the brief names: fade-up on every section, hover flourish on every card. That's what the current site is doing today, functionally (site-wide `[data-reveal]`). The self-critique here is sharper than the other two: I did not rip that pattern out, I quieted it — because a wholesale removal would cost real, working motion for no stated reason, and the brief's actual complaint is about *where the boldness gets spent*, not that scroll-reveal exists at all. The honest tension I'm flagging rather than hiding: "quieted, not removed" is a judgment call, not a bright line, and if it still reads as too busy once built, the fix is tightening timing/distance further, not re-litigating the whole approach.

**Grid/unit system.** The generic default is to force one number (e.g., 8px, or the existing 28px) to govern everything — spacing, sprite sizes, breakpoints — because "one grid" sounds more rigorous than two. I kept them separate on purpose: the 28px backdrop grid is a *visual motif* (it's decorative, it's meant to be seen), while the 8px sprite-construction unit is a *production constraint* (it's meant to keep hand-drawn assets crisp at integer scale, and nobody looking at the page is meant to notice it as a number). Conflating them would either force the backdrop grid to an awkward 8px cadence it doesn't need, or force sprite canvases onto a 28px base that doesn't cleanly integer-scale to common display sizes. Keeping two small, clearly-scoped systems beats one big one that has to compromise both jobs.

**Overall positioning.** The most generic failure mode for "pixel art + tattoo shop" is the one the brief names by name — arcade/CRT/coin-op skin. The second most generic failure mode, less obvious, is overcorrecting into treating the pixel art as *precious in an untouchable, gallery-wall way* (lots of negative space, tiny centered sprites, hushed captions) — which would fight the site's actual job, which is to sell commissions to people scrolling Instagram on a phone. The collectible-drop framing is the answer to both at once: toys and sneakers are precious *and* they want you to buy one *right now before it's gone*. The claim stamp is where that tension resolves into one concrete, buildable thing instead of staying a mood board.
