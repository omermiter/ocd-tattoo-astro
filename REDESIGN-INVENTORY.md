# OCD Tattoo — Redesign Inventory

Exhaustive checklist of everything that exists on the site today, verified against the actual code in the repo (not against any prior brief or doc) on 2026-09-03. This is the checklist Phase 3 verification walks line by line — every box gets checked off there, and any left unchecked is reported as a bug, not silently dropped.

Stack, confirmed: Astro 5.18.2 static site (`astro build` → `dist/`), deployed to GitHub Pages via `.github/workflows/deploy.yml` on push to `main`, custom domain `ocdtattoo.com` (DNS + HTTPS cert both live and verified as of this session). Contact form posts to a separate Cloudflare Worker (`worker/`) which relays to Resend; WhatsApp is the fallback when that fails. A second Cloudflare Worker (`cms-auth/`) backs GitHub OAuth for a Decap CMS admin panel at `/admin/`, added this session — **not part of the original brief's described stack, but real, deployed, and in active use** (the artist has already added/edited content through it). English only, LTR only, no i18n scaffolding anywhere — confirmed, not changing this per §1.

---

## 1. Pages / Routes

- [ ] `/` — Home (`src/pages/index.astro`)
- [ ] `/pieces/` — Pieces listing (`src/pages/pieces/index.astro`)
- [ ] `/register/` — The Register / flash listing (`src/pages/register/index.astro`)
- [ ] `/contact/` — Contact form (`src/pages/contact/index.astro`)
- [ ] `/404` — Not found (`src/pages/404.astro`, Astro's default 404 handling)
- [ ] `/admin/` — Decap CMS admin panel (`public/admin/index.html` + `config.yml`) — a tool, not a funnel page, but it's a real live route and needs to keep working through the redesign since content editing depends on it

No other routes exist. No blog, no about page, no pricing page, no FAQ page, no legal/privacy pages.

---

## 2. Sections, per page, in document order

### `/` (Home)
- [ ] Preloader (see §3, Preloader component) — homepage only
- [ ] Nav (see §3)
- [ ] Hero — inside `PrecisionGrid` wrapper: eyebrow, H1 with one emphasized phrase, full-bleed background photo
- [ ] "Beat" strip — one line of body copy + "View the Register →" link, hairline border above
- [ ] Pixel divider (decorative, currently renders nothing — see §7)
- [ ] Pieces section — eyebrow, intro copy, list of `PieceCard`s (currently 3), "View all pieces →" link
- [ ] Pixel divider (second instance, same as above)
- [ ] Register section — eyebrow, intro copy, ledger preview (first 5 flash entries, serial/title/placement/gridSize/status columns only — no claim toggle here), "View the Register →" link
- [ ] Closing CTA section — heading, subhead, "Start a commission →" link
- [ ] Footer (see §3)

### `/pieces/`
- [ ] Nav (active: Pieces)
- [ ] Page header — eyebrow, H1, intro copy
- [ ] Full piece list (all entries, same `PieceCard` component as home)
- [ ] Closing CTA — "Want something like this?" heading, subhead, "Start a commission →"
- [ ] Footer

### `/register/`
- [ ] Nav (active: Register)
- [ ] Page header — eyebrow, H1, intro copy, live count ("`{n}` of `{total}` available")
- [ ] Size sections — one per non-empty `gridSize` tier (8×8 / 16×16 / 24×24 / 32×32), each with a heading + count and a `FlashRow` ledger list, available-first within each tier
- [ ] Per-row: serial, title, placement, size, gridSize columns; status stamp image (if asset present) + either an "Available →" toggle or a "Claimed · `{date}`" label
- [ ] Claim panel (collapsed by default, expands on toggle) — deposit copy + "Confirm on WhatsApp →" link, accordion behavior (opening one closes any other open panel)
- [ ] Closing CTA — "Don't see what you want?" heading, subhead, "Start a commission →"
- [ ] Footer

### `/contact/`
- [ ] Nav (active: Contact)
- [ ] Page header — eyebrow, H1, intro copy
- [ ] Form: Name (text, required), Email (email, required), Message (textarea, required, placeholder text)
- [ ] Submit button ("Send →") + inline status text (aria-live)
- [ ] Footer

### `/404`
- [ ] Nav (no active state)
- [ ] Illustration (currently unset — falls back to plain "404" mono text, see §7)
- [ ] Heading, intro line, "← Back to Pieces" link
- [ ] Footer

---

## 3. Components (every one, including single-use)

- [ ] `BaseLayout.astro` — HTML shell, meta tags, font/style imports, Cursor mount, global scroll-reveal `IntersectionObserver` script, Cloudflare Web Analytics beacon
- [ ] `Nav.astro` — brand wordmark link, desktop inline links, mobile hamburger + slide panel, active-page state, Contact link gets permanent violet-bright treatment as the standing CTA
- [ ] `Footer.astro` — mark image (optional) + handle/location text, Instagram link, WhatsApp link, both with optional pixel icons
- [ ] `PrecisionGrid.astro` — hero-only wrapper: draw-in grid texture on load, pointer-tracked violet spotlight (fine-pointer + motion-OK only)
- [ ] `Preloader.astro` — homepage-only load screen, session-gated (once per `sessionStorage` session), skippable on any input, sprite-or-static-mark-or-nothing fallback chain
- [ ] `PixelDivider.astro` — lazy-loaded decorative tile between homepage sections, renders nothing if asset missing (currently: renders nothing, asset never added)
- [ ] `PieceCard.astro` — used on `/` and `/pieces/`: photo + serial/title/spec-table (placement, size, sessions, hours, date)/note
- [ ] `PieceMedia.astro` — the photo-or-placeholder panel inside `PieceCard`, fixed 4:5 crop, "Photography pending" state when no photo
- [ ] `FlashRow.astro` — used only on `/register/`: the ledger row + expandable claim panel described above
- [ ] `Cursor.astro` — global custom cursor, fine-pointer only, three-tier fallback (animated sprite → static swap → system cursor), forces `cursor:none` site-wide via CSS when active

No component is currently orphaned/unused in the render tree. `PieceMedia`'s former hover-lift-and-burst animation was removed this session (see §7 — the `hover-burst.png` asset is now dead weight).

---

## 4. Interactive elements

- [ ] Nav mobile hamburger toggle — `aria-expanded`, `aria-controls`, `aria-label="Menu"`, closes on link click or Escape
- [ ] Nav links (3, + brand link = 4 total) — hover/focus color transition, `aria-current="page"` on active
- [ ] Contact form — 3 required fields, client-side `novalidate` (native browser validation still applies via `required`), custom submit handler
- [ ] Contact form submit button — disables during send, re-enables on error
- [ ] Register claim toggle (per available flash row) — `aria-expanded`, accordion (opening one auto-closes any other open panel), animated height (measured via `scrollHeight`, not CSS-only)
- [ ] Register "Confirm on WhatsApp →" link — pre-filled claim message via `wa.me`
- [ ] Every underlined link site-wide — shared `.underline` hover/focus-visible animated underline (grows from 0 on hover or keyboard focus)
- [ ] PrecisionGrid pointer spotlight — pointer-move tracked, fine-pointer devices only, `prefers-reduced-motion` disables it entirely (static grid instead)
- [ ] Preloader dismiss — first `pointerdown`/`keydown`/`wheel`/`touchstart`, or auto-dismiss after 650ms hold
- [ ] Custom cursor hover-state detection — scans `a, button, [role="button"], input, textarea, select, summary, [tabindex]:not([tabindex="-1"])`, switches sprite/frame accordingly; text fields keep the system I-beam

## 5. States

- [ ] Nav link: default / hover / focus-visible / `aria-current` (active page) / (Contact variant: same four, different color)
- [ ] Nav mobile panel: closed / open
- [ ] Contact form fields: default / focus (violet-bright underline) / native browser invalid (via `required`, no custom styling on top)
- [ ] Contact submit button: default / hover / disabled (mid-send) / re-enabled (after error)
- [ ] Contact status line: empty / "Sending…" / success ("Sent. I read every message myself…") / error (with inline WhatsApp fallback link)
- [ ] Piece photo: present (real image) / pending (placeholder panel, "Photography pending" + serial)
- [ ] Flash row: available (violet-bright status text, claim toggle) / claimed (dust-grey text throughout, static "Claimed · `{date}`" label)
- [ ] Flash claim panel: collapsed / expanded (per-row, accordion-exclusive)
- [ ] Custom cursor: hidden (not yet moved / left window) / visible-idle / visible-hovering
- [ ] Preloader: showing / fading out / removed (and never-shown-again this session)
- [ ] `[data-reveal]` elements (nearly every section, site-wide): pre-reveal (opacity 0, translated down 22px) / revealed (`.is-visible`)
- [ ] `prefers-reduced-motion: reduce`: globally shortens all durations to 0.01ms via token override; additionally hard-disables the PrecisionGrid spotlight, the custom cursor's frame animation, and instantly marks all `[data-reveal]` elements visible on load instead of animating in
- [ ] Pixel-art assets generally: present (renders) / absent (component renders nothing or falls back — see §7, this is the dominant state right now since almost none of the 12 manifest assets exist yet)

No loading spinners, no skeleton states, no client-side routing (fully static, full page loads), no modals, no carousels, no lightboxes, no filter UI beyond the Register's grid-size grouping (which isn't interactive — it's just how entries are sectioned).

---

## 6. Breakpoints actually in the CSS

Confirmed by grep across every `.astro`/`.css` file — these five are the *only* breakpoints that exist:

- [ ] `Nav.astro` — `max-width: 640px` (switches to hamburger + slide panel)
- [ ] `FlashRow.astro` — `max-width: 700px` (ledger row collapses from 6-column grid to 2-column)
- [ ] `PieceCard.astro` — `max-width: 800px` (photo+meta grid collapses to single column)
- [ ] `index.astro` — `max-width: 800px` (homepage register-preview ledger collapses to 2-column, same trigger as PieceCard by coincidence not shared logic)
- [ ] `tokens.css` — `prefers-reduced-motion: reduce` (a media feature query, not a width breakpoint, but it's the only other one in the system)

There is no dedicated "mobile-first design system" breakpoint set (no 375/768/1024/1440 tier list) — type and spacing are fluid via `clamp()` in the display type scale, and layout otherwise just stacks at the three width breakpoints above. Nothing currently targets ultra-wide or foldable viewports specifically.

---

## 7. Every image / video / asset, with actual dimensions and file size

### Real content photography (live)
| File | Used by | Dimensions | Size |
|---|---|---|---|
| `public/pieces/img_9248.jpeg` | OCD·01 "Steelix" | 1842×2457 | 791 KB |
| `public/pieces/img_9348.jpeg` | OCD·02 "shiny rayquaza" | 2032×2710 | 756 KB |
| `public/pieces/img_9292.jpg` | OCD·03 "Swampert" | 2200×2934 (re-encoded this session from an 8.4MB PNG) | 550 KB |
| `public/uploads/img_1572.jpg` | Home hero background | 2400×1200 (re-encoded this session from a 394KB, 6144×3072 PNG) | 168 KB |

### Pixel-art manifest (`public/pixel-art/`) — see `public/pixel-art/README.md` for the full intended list of 12
| File | Status | Note |
|---|---|---|
| `cursor.png` | **present** | 7-frame strip, 48×48/frame — drives the custom cursor |
| `hover-burst.png` | **present, but dead** | 11-frame strip, 80×80/frame — was the piece-thumbnail hover animation; **that feature was removed this session per an explicit request** ("cancel it"). The file is still on disk and still listed as "✅ done" in `pixel-art/README.md`, but nothing in the codebase references it anymore. Flagging as stale, not deleting without direction. |
| `cursor-default.png` / `cursor-hover.png` | absent | fallback tier, only matters if `cursor.png` is removed |
| `mark.png` | absent | footer mark + preloader fallback both currently render without it (text-only footer, no preloader on homepage load) |
| `favicon.png` | absent | falls back to existing `favicon.svg` |
| `icon-instagram.png` / `icon-whatsapp.png` | absent | footer links render as plain text, no icon |
| `preloader.png` | absent | preloader doesn't render at all right now (no sprite, no mark) |
| `stamp-available.png` / `stamp-claimed.png` | absent | Register rows show no stamp graphic, status is text-only |
| `divider.png` | absent | both homepage `PixelDivider` instances render nothing |
| `404.png` | absent | 404 page shows plain "404" mono text |

### Other assets
- [ ] `public/favicon.svg` — present, permanent fallback favicon
- [ ] `public/CNAME` — `ocdtattoo.com`
- [ ] `public/scratch-hero-bg.jpg` — 720×360, 60KB — **stale leftover from a prior session, explicitly marked "not meant to be committed," never in git, no longer referenced by any code** (the hero now uses `img_1572.jpg`). Recommend deleting during the redesign.
- [ ] `public/fonts/*.woff2` — 22 files, self-hosted, Fraunces (300/400/400-italic/500) + Archivo (400/500/600/700) + Martian Mono (400/500), each split into latin + latin-ext subsets

### Video
None anywhere on the site.

---

## 8. Copy, verbatim

### Global / navigation
- Brand wordmark: **"OCD·TATTOO"**
- Nav links: **Pieces**, **Register**, **Contact**
- Footer identity line: **"`{instagram handle}` · `{location}`"** → currently renders as **"@ocd_tattoo · Israel"**
- Footer links: **Instagram**, **WhatsApp**

### Home (`src/data/site.json` → `home`, plus hardcoded UI strings)
- Eyebrow: **"OCD Tattoo"**
- H1 (emphasis marked with `*`): **"Pixel Art, Held to a *Realist's* Standard."**
- Beat line: **"Every square drawn, stenciled, and placed with the same precision built over years of black-and-gray realism work — now in color, one pixel at a time."**
- Beat CTA: **"View the Register →"**
- Pieces eyebrow: **"Pieces"**
- Pieces intro: **"A growing collection of pixel art tattoos — precision-built, one at a time."**
- Pieces CTA: **"View all pieces →"**
- Register eyebrow: **"The Register"**
- Register intro: **"One-of-one flash designs. Once a piece is claimed, it's retired from the list — it doesn't come back."**
- Register CTA: **"View the Register →"**
- Closing title: **"Commissions are held to the same standard."**
- Closing text: **"Reviewed personally, not queued. Tell me what you want, and I'll tell you if it's a fit."**
- Closing CTA: **"Start a commission →"**

### `/pieces/`
- Eyebrow: **"Pieces"**
- H1: **"A growing collection, built one at a time."**
- Intro: **"Not a portfolio in the volume sense — a record. Each piece below is documented in full: placement, time, and what the execution actually required."**
- Closing heading: **"Want something like this?"**
- Closing subhead: **"Every commission starts the same way — tell me the idea and the placement."**
- Closing CTA: **"Start a commission →"**

### `/register/` (`site.json` → `registerPage`, plus hardcoded UI strings)
- Eyebrow: **"The Register"**
- H1: **"One-of-one, always."**
- Intro: **"Every flash design here is drawn once and tattooed once. Claim one and it's retired from the list permanently — the record stays, the design doesn't come back. Grouped by canvas: the grid a design is actually built on."**
- Count line: **"`{available}` of `{total}` available"**
- Closing heading: **"Don't see what you want?"**
- Closing subhead: **"Flash is first-come; a commission is built around your idea instead."**
- Closing CTA: **"Start a commission →"**
- Per-row claim panel copy: **"One-of-one. Drawn once, tattooed once. A deposit holds it — credited to the session, non-refundable."**
- Claim panel link: **"Confirm on WhatsApp →"**
- Claim toggle (collapsed): **"Available →"**
- Claimed label: **"Claimed · `{claimedDate}`"**

### `/contact/` (`site.json` → `contactPage`, plus hardcoded UI strings)
- Eyebrow: **"Contact"**
- H1: **"Tell me what you want."**
- Intro: **"I read every message myself. If it's a fit, I'll ask for a reference and a placement; if it isn't, I'll say so directly instead of leaving you waiting."**
- Field labels: **"Name"**, **"Email"**, **"What are you looking for?"**
- Message placeholder: **"Placement, size, the idea — as much or as little as you have."**
- Submit button: **"Send →"**
- Sending state: **"Sending…"**
- Success state: **"Sent. I read every message myself — expect a reply within a few days."**
- Error state (HTML, includes a link): **"Something went wrong. Message me directly on WhatsApp instead."**

### `/404`
- H1: **"Page not found."**
- Intro: **"This page doesn't exist, or the piece moved."**
- Link: **"← Back to Pieces"**

### Piece content (`src/content/pieces/*.md` — all three entries, full frontmatter)
| Serial | Title | Placement | Size | Sessions | Hours | Date | Note |
|---|---|---|---|---|---|---|---|
| OCD·01 | **Steelix** | Ribs | 7cm | 1 | 4 | 2026.05 | "Steelix Pokémon in pixel art style" |
| OCD·02 | **shiny rayquaza** | Forearm | 5cm | 1 | 0 | 2026.08 | "Shiny Rayquaza pixel art style full color" |
| OCD·03 | **Swampert** | Arm | 8cm | 1 | 5 | 2026.7 | "Swampert pixelart full color" |

**⚠️ All three live "pieces" are Pokémon designs — directly named as such in the title and note fields.** Per this brief's hard rule §0.2 ("No copyrighted characters ship on this site... route it to the placeholder system"), these need to be routed to placeholders rather than carried into the redesign as real portfolio content. This is a content/legal issue independent of the visual redesign — flagging here, not fixing here, per the brief's own instruction to list-not-fix in Phase 0.

### Flash content (`src/content/flash/*.md` — all six entries)
| Serial | Title | Status | Size | Grid | Placement | Claimed date |
|---|---|---|---|---|---|---|
| OCD-F01 | Pixel Rose | available | 8cm | 16×16 | Forearm | — |
| OCD-F02 | Grid Skull | claimed | 9cm | 24×24 | Calf | 2026.06.14 |
| OCD-F03 | Pixel Snake | available | 10cm | 16×16 | Shin | — |
| OCD-F04 | Color Block Heart | claimed | 6cm | 8×8 | Wrist | 2026.07.02 |
| OCD-F05 | Pixel Moth | available | 9cm | 24×24 | Shoulder | — |
| OCD-F06 | Grid Eye | claimed | 7cm | 32×32 | Ribs | 2026.07.20 |

These read as generic placeholder/example titles (not tied to any specific claimed design in the wild) — worth confirming with Omer whether these are real designs he's drawn or scaffolding data, since none currently has a photo attached (the `photo` field exists on the schema but is empty on all six, and — separate from the redesign — nothing in the current templates renders a flash photo even if one were set; the Register only ever shows text + an optional stamp graphic).

---

## 9. Outbound links and their destinations

- [ ] Footer "Instagram" → `https://instagram.com/ocd_tattoo` (real handle, matches `@ocd_tattoo`)
- [ ] Footer "WhatsApp" → `https://wa.me/972544409502` (real number, no message prefill)
- [ ] Register "Confirm on WhatsApp →" (per available flash row) → `https://wa.me/972544409502?text=...` prefilled with `"I want to claim {serial} — {title}. I saw it on the Register."`
- [ ] Contact form error state → same base WhatsApp link, no prefill, as the fallback path
- [ ] Contact form success path → `POST https://ocd-tattoo-contact.omer3107.workers.dev` (Cloudflare Worker, not a link but the form's real destination) — **see the funnel map: this is currently broken for real visitors, CORS-locked to `localhost:4321` instead of the live domain**

No `mailto:`, no `tel:`, no maps link, no booking-platform link anywhere in the codebase, despite the brief describing a physical studio (Topa Tattoo Studio, Kfar Saba) — the site currently gives no address, map, or studio name at all, only "Israel" as a location string. Flagging as a brief/repo discrepancy per §1's instruction to surface these rather than pick one silently.

---

## 10. Analytics / tracking

- [ ] Cloudflare Web Analytics beacon, `BaseLayout.astro` `<head>`, added this session, live with a real token (`34c31e0adcca4b61b893e5ae41a28f17`). Cookieless, no custom events — it only tracks pageviews/referrers automatically. **No event-level tracking exists anywhere** (no "contact form submitted," no "WhatsApp clicked," no "claim toggled" events). If the redesign wants funnel-stage visibility, that's new instrumentation to propose at checkpoint 2, not something being preserved from an existing setup.
- [ ] No other pixel, tag manager, or third-party script of any kind.

---

## 11. Environment variables, config values, and placeholders

- [ ] `astro.config.mjs` → `site: 'https://ocdtattoo.com'`, `base: '/'`, `trailingSlash: 'always'` — real, matches the live domain (confirmed resolving + HTTPS this session)
- [ ] `public/CNAME` → `ocdtattoo.com` — real, live
- [ ] `src/data/site.json` → `contact.whatsappNumber: "972544409502"` — real number, confirmed via a live `wa.me` link check this session
- [ ] `src/data/site.json` → `contact.instagramHandle` / `instagramUrl` → `@ocd_tattoo` / `https://instagram.com/ocd_tattoo` — real
- [ ] `src/data/site.json` → `contact.location: "Israel"` — real but coarse; no studio name, city, or address anywhere (see §9)
- [ ] `src/lib/contact.ts` → `CONTACT_ENDPOINT: 'https://ocd-tattoo-contact.omer3107.workers.dev'` — real, deployed, but **CORS-misconfigured against the live domain** — see funnel map
- [ ] `worker/wrangler.toml` → `ALLOWED_ORIGIN = "http://localhost:4321"` — **placeholder value still live in production**, was supposed to be updated to `https://ocdtattoo.com` once the domain went live (per the worker's own README); the domain went live this session and this was missed. **This is the single most important open item from this audit.**
- [ ] `worker/src/index.ts` → sender address `"OCD Tattoo Contact <onboarding@resend.dev>"` — the worker's own code comment flags this as a placeholder pending a verified domain in Resend for better deliverability
- [ ] `public/admin/config.yml` → `repo: omermiter/ocd-tattoo-astro`, `branch: main` — real, confirmed working (the artist has already saved content through it)
- [ ] `cms-auth/wrangler.toml` → `GITHUB_CLIENT_ID` — real, deployed, working (confirmed end-to-end login this session)
- [ ] No `.env` files anywhere in this project (confirmed) — the README's claim of "no secrets or environment variables needed for the main site build" is accurate for the static site itself; the two Workers each hold one real secret each, both set via `wrangler secret put` (`RESEND_API_KEY`, `GITHUB_CLIENT_SECRET`), neither in the repo.

---

## 12. Metadata

- [ ] Title tags — unique per page, present on all 5 routes (`/`, `/pieces/`, `/register/`, `/contact/`, `/404`) — verbatim in §8's per-page headers as the `<title>` isn't separately quoted there; see actual `title=` props in each page's `<BaseLayout>` call for exact strings
- [ ] Meta descriptions — unique per page, present on all 5 routes
- [ ] `og:title`, `og:description`, `og:type` — present, driven by the same title/description props
- [ ] `og:image` — **absent**. Sharing any page link renders with no preview image.
- [ ] Twitter/X card tags — **absent** entirely
- [ ] Favicon — `favicon.svg` (always) + `favicon.png` (conditional, currently absent so SVG is the only one shipping)
- [ ] `<meta name="color-scheme" content="dark">` — present, site-wide
- [ ] `<html lang="en">` — present, hardcoded, no alternate-language handling anywhere (confirmed no i18n/RTL scaffolding exists — not changing this per §1)
- [ ] Structured data (JSON-LD, e.g. `LocalBusiness` for a tattoo studio) — **absent entirely**
- [ ] `robots.txt` — **absent**
- [ ] `sitemap.xml` — **absent**, and no `@astrojs/sitemap` integration installed
- [ ] `manifest.json` / PWA metadata — **absent**

---

## 13. Accessibility features currently present

- [ ] `alt` text: descriptive on the piece photos (`alt={title}`), the "not yet photographed" placeholder panel (`role="img"` + `aria-label`), the footer mark (`alt="OCD Tattoo"`), and the 404 illustration; empty `alt=""` (correctly, as decoration) on both footer icon images, the preloader mark, and both cursor images
- [ ] `aria-expanded` + `aria-controls` + `aria-label` on the nav mobile toggle
- [ ] `aria-expanded` on each Register claim toggle
- [ ] `aria-current="page"` on the active nav link
- [ ] `aria-hidden="true"` on the preloader wrapper and both cursor images (decorative, shouldn't reach the accessibility tree)
- [ ] `role="status"` + `aria-live="polite"` on the contact form's status line, so screen-reader users hear the send result
- [ ] `role="presentation"` on the cursor sprite wrapper and the pixel divider
- [ ] `:focus-visible` — a real, visible focus ring (`2px solid var(--violet-bright)`, 3px offset) applied globally, not suppressed anywhere
- [ ] `prefers-reduced-motion: reduce` — respected in four separate places: the global duration tokens (collapses to ~0), the `[data-reveal]` scroll animations (marked visible immediately instead of animating), the `PrecisionGrid` spotlight (fully disabled, static grid shown instead), and the custom cursor's frame-scrub animation (snaps instantly instead of stepping)
- [ ] Semantic heading structure — one `h1` per page, `h2`s for sub-sections, no skipped levels observed
- [ ] Form labels — every input has a real `<label for>`, not a placeholder-as-label anti-pattern
- [ ] **No skip-to-content link anywhere** — flagging as absent, not present
- [ ] **No explicit `aria-label` on the two icon-only footer links** (Instagram/WhatsApp) — they're not icon-only today (icon + visible text), so this isn't currently a real gap, but worth confirming it stays that way if the redesign is tempted to go icon-only for space
- [ ] Contrast: not yet measured/reported here — that's a Phase 3 verification task per the brief (§8), not part of this inventory

---

## 14. Language / i18n / RTL

- Single language: English. `<html lang="en">` hardcoded in `BaseLayout.astro`, no alternate.
- No RTL implementation of any kind (relevant since the studio is in Israel and Hebrew would be the natural second language, but the current site makes no attempt at it — logical-property CSS like `padding-inline`/`inset-inline-start` is used throughout, which would make RTL support easier later, but nothing turns it on).
- No translation files, no locale routing, no `astro-i18n` or similar integration installed.
- **Confirmed per this brief's own instruction: not changing language scope in this redesign.** Noting the logical-property groundwork exists if that's ever revisited, but out of scope now.

---

## 15. Known technical debt / discrepancies surfaced during this audit

Not funnel-blocking, but worth a place to live since they came up while building this inventory:

- [ ] `hover-burst.png` is a dead, unreferenced asset (§7) — the feature it powered was removed this session
- [ ] `public/pixel-art/README.md` still describes `hover-burst.png` as an active "✅ done" asset — now inaccurate
- [ ] `public/scratch-hero-bg.jpg` is a dead, never-committed, no-longer-referenced file — recommend deleting
- [ ] The `hours` field on Pieces briefly had a schema bug this session (required `> 0`, rejecting the legitimate value `0`) that silently broke two production deploys before being caught and fixed to `nonnegative()` — now resolved, flagging only so it's not a surprise if referenced in git history
