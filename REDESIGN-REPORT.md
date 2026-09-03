# OCD Tattoo — Redesign Report (Phase 3, Checkpoint 3)

What changed, what didn't and why, what's blocked on Omer, and what's recommended next. Read alongside `REDESIGN-INVENTORY.md` (every line checked off, methodology at the top), `REDESIGN-FUNNEL-MAP.md` (every path re-walked including fallbacks), `REDESIGN-PLAN.md` (the concept, color/type/grid/motion system, and self-critique), and `ASSETS-TO-DRAW.md` (the production spec for what's left to draw).

---

## What changed

**Color system.** Every hardcoded reference to the old `--violet-bright` token is gone — replaced with one of four purpose-specific tokens (`--claim` for the one action color, `--violet-display` / `--violet-ui` for the brand accent split by contrast need, `--whatsapp` for WhatsApp's own kept brand green). The environment moved from tinted near-black (`#08080A`) to a measured violet-black (`#120E17`). Every pairing was computed, not eyeballed (numbers in `REDESIGN-PLAN.md` §2) — and computing them caught a real problem: the old single violet-bright value passed contrast at hero-headline size but failed it at nav-link size, which the pre-redesign site was actually doing. Split into two tokens, both verified.

**The claim stamp.** The Register's claimed state now has a real mechanism behind it — an animated sprite (once the art exists), triggered on first scroll-into-view, holding on its final frame, never looping or replaying. Built on the codebase's existing sprite-strip convention (`spriteFrameCount()`, the same pattern `cursor.png` already used) rather than inventing a new one. Verified end-to-end with a throwaway synthetic test sprite before shipping — confirmed the frame-stepping, the hold, and the no-replay behavior all actually work, not just that the code looked right.

**The placeholder system.** New: `PixelPlaceholder.astro` (loud magenta/black checkerboard, exact final dimensions, greppable via `data-placeholder`), a registry in `src/lib/placeholders.ts`, and a build-time summary via an Astro integration hook (`astro.config.mjs`) that prints `N placeholders remaining` after every build. Applied to the four P0 assets (mark, favicon, both stamps) and three of the P1s (both footer icons, the 404 illustration) — see "What's blocked on Omer" below for why one P1 (`pending-mark`) deliberately isn't in this system.

**Motion.** The site-wide scroll-reveal (`[data-reveal]`, used on nearly every section) is quieter — shorter travel distance (22px → 10px), shorter duration (900ms → 260ms, its own new token `--dur-reveal`) — so it reads as plumbing rather than competing with the claim stamp for attention. `PrecisionGrid`'s hero spotlight is untouched; it was already disciplined.

**Layout.** One real fix, found by looking at the built result rather than trusting the plan: the Register's ledger grid needed its last column widened (9rem → 12rem) once the claim stamp was added — at 1440px, "AVAILABLE →" was wrapping onto two lines. Caught during Phase 2, not left for this verification pass to find.

**A bug, found and fixed.** The contact form's error-state WhatsApp link is injected via `innerHTML` at runtime, which means it never receives Astro's scoped-CSS attribute — a scoped `.status a { color: ... }` rule silently never matched it. This was almost certainly true before this redesign too (the link was likely always inheriting `--dust` grey instead of showing the intended violet). Found by testing the actual error state live rather than trusting the CSS, fixed with an inline style on the generated markup, reverified via `getComputedStyle`.

**Also fixed, ahead of the redesign proper:** the contact form's Cloudflare Worker had `ALLOWED_ORIGIN` still set to `http://localhost:4321` even though the custom domain had gone live — every real visitor's submission was silently failing and falling back to the WhatsApp error path. This was found during the Phase 0 audit, fixed and verified (real test submission, real email received) before Phase 1 planning started.

---

## What was deliberately left alone, and why

**Every page's structure, every section, every piece of copy.** The brief's tone shift is about the visual/motion system, not a rewrite — the existing copy ("I read every message myself," "Not a portfolio in the volume sense — a record," the Register's whole claim-panel copy) already reads confident and specific in exactly the way the new positioning wants. Rewriting it wasn't asked for and would have been scope creep. Verified verbatim, unchanged, in the inventory.

**The funnel.** Zero clicks added, zero removed, zero CTAs demoted. Every path in the funnel map still resolves to the same destination it did before. The claim stamp sits *next to* the existing "Available →" toggle, not in front of it — a keyboard or screen-reader user reaches the real action first, same as before.

**Cursor.png and hover-burst.png.** Both real, hand-drawn, already on disk. `cursor.png` still works and wasn't touched — flagged as a "look again, not necessarily redraw" question in `ASSETS-TO-DRAW.md`, since it was drawn under the old austere direction and might read mismatched now, but that's a judgment call for whoever looks at it next to the finished palette, not something to force through code. `hover-burst.png` is confirmed unused (the hover-lift feature it powered was removed from the site before this brief arrived) and marked as such in `public/pixel-art/README.md` — left on disk rather than deleted, since it's real art someone made, not a generated placeholder.

**The Pokémon pieces.** Per your explicit instruction, untouched. Still flagged in both the inventory and the funnel map as a real tension with the brief's own §0.2 — not fixed, not silently dropped either.

**Everything the funnel map's "open items" section already named** — Resend's sender address, the lack of event-level tracking, flash designs not rendering a photo anywhere, the homepage register-preview not being clickable, no studio address/map. None of these were in scope for a visual/motion redesign with the funnel explicitly frozen. Restated in the Phase 3 verification pass specifically so they don't quietly disappear between documents.

**One judgment call, not a silent default:** the homepage's read-only register-preview shows "Available" in `--claim` gold even though that specific instance isn't clickable — technically stretches the "gold means tap this, nowhere else" rule from the plan. Kept because the color there is stating a true fact (this design is available) consistent with the real Register's own status color, not inventing a fake affordance. Flagged, not hidden.

---

## What's blocked on Omer

**The house ink palette.** `REDESIGN-PLAN.md` §2 proposes 14 slots (3 dark / 2 neutral / 2 highlight / 7 accent) with provisional hex values, wired into `tokens.css` as `--ink-provisional-*` — named and flagged as blocking, per the brief's own instruction not to invent this from a photo or Lospec. Not consumed by any component yet (nothing currently reads these variables); they're staged as the single source of truth for whenever real ink values land.

**Four P0 pixel-art assets**, spec'd in full in `ASSETS-TO-DRAW.md`, currently rendering as loud placeholders:
- `mark.png` (32×32) — the site's actual logo, used in three places
- `favicon.png` (32×32)
- `stamp-claimed.png` (40×40 × 5 frames) — the claim stamp itself, the plan's one orchestrated moment
- `stamp-available.png` (40×40, static) — its "before" counterpart

**Three P1s**, same treatment: `icon-instagram.png`, `icon-whatsapp.png` (both 16×16), `404.png` (128×128, flexible).

**One P1 handled differently, on purpose:** `pending-mark.png` was pulled out of the loud-placeholder system during Phase 2 build. A screaming magenta checkerboard stacked on the "Photography pending" panel contradicted that panel's own calm, already-correct message — building it revealed the problem before it shipped wrong. It's back to the old graceful-fallback pattern: shows automatically once drawn, renders nothing extra until then.

**Current placeholder count: 7** (4 P0, 3 P1), printed by every build via the new `astro.config.mjs` integration. Full list with exact paths and dimensions is in that build output and in `ASSETS-TO-DRAW.md`.

---

## Verification results

Full detail and methodology in `REDESIGN-INVENTORY.md`'s Phase 3 preamble and `REDESIGN-FUNNEL-MAP.md`'s Phase 3 section. Summary:

- **Inventory:** all 127 lines checked off. Zero unresolved gaps found beyond the ones already known and restated above.
- **Funnel:** all four paths (A/success, A/fallback, B, C) re-walked and confirmed working on live production, including the fallback path.
- **Keyboard nav:** confirmed correct tab order from a fresh page load, visible focus ring (`2px solid var(--violet-ui)`, 3px offset) on every tested element, Register claim toggle operable via `Enter`.
- **`prefers-reduced-motion`:** verified by code inspection (every motion-bearing script branches on the media query and lands on the same final state either way) — **not** verified via live OS-level emulation, since this environment's browser automation has no control to force that setting. Flagging the gap rather than silently skipping it.
- **Alt text:** audited on every image touched this session — present and correctly empty-vs-descriptive per context.
- **Contrast:** every color pairing computed with real WCAG ratios in `REDESIGN-PLAN.md` §2 (not assumed), re-verified via `getComputedStyle` on the actual rendered pages during build for the tokens that mattered most (claim gold, violet-ui, whatsapp green).
- **Layout shift:** Lighthouse CLS = 0 on both `/` and `/register/` (production).
- **Console errors:** zero from site code across all 5 routes plus a full scroll-through of `/register/`. The one console entry that appeared anywhere was an unrelated Chrome extension's own internal error.
- **Lighthouse** (production, `ocdtattoo.com`):

  | Page | Performance | Accessibility | Best Practices | SEO |
  |---|---|---|---|---|
  | `/` | 85 | 100 | 100 | 100 |
  | `/register/` | 94 | 100 | 100 | 100 |

  The home page's lower performance score is real and understood, not a redesign regression: its hero photo is a CSS `background-image` (a pre-existing architectural choice, not something this session introduced — necessary for the dark gradient overlay effect), which Lighthouse's LCP-discovery heuristics penalize more than an `<img>` would. The cache-lifetime finding (photos and fonts served with only a 10-minute cache window) is a GitHub Pages platform constraint — the host doesn't support custom cache-control headers, so this isn't fixable from within the Astro app without a hosting change. Neither is proposed as an in-scope fix here; both are named as real findings for whoever picks up performance work next.

---

## Recommended next

1. **Draw the four P0 assets.** Everything else in this redesign is built and waiting on them — the site is structurally complete and correct with placeholders in, per the brief's own definition of done, but the claim stamp (the whole point of this redesign's concept) isn't visible as intended until `stamp-claimed.png` exists.
2. **Fill the house ink palette.** Low effort (14 hex values), unblocks nothing else in code (the tokens are already wired), but it's the palette every future piece and every future site asset should actually draw from.
3. **Decide on the Pokémon pieces.** Not touched this session per your instruction, but still a live tension with the brief's own hard rule — worth a deliberate decision whenever you're ready, not an urgent one.
4. **Fix the Resend sender address** once `ocdtattoo.com` is verified in Resend — small, low-risk, already flagged in the worker's own code as a TODO.
5. **Consider event-level tracking** if you want real data on which of the three funnel paths actually converts, once there's something to compare against. Not proposed as a specific implementation here — a recommendation to weigh, not a decision made unilaterally.
6. **Render flash-design photos on the Register**, if you want the claim decision to be visually informed rather than text-only — the schema already supports it, nothing currently displays it.
