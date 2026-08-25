# OCD Tattoo — site

Static Astro 5 site for OCD Tattoo (`@ocd_tattoo`). Hebrew at `/`, English
mirror at `/en/`. No server, no database, no runtime env vars — it builds to
plain HTML/CSS/JS and deploys to GitHub Pages.

Read `PLAN.md` for the design system and rationale, and `ASSETS-NEEDED.md`
for what's still a placeholder.

## Commands

| Command | Action |
|---|---|
| `npm install` | Install dependencies |
| `npm run dev` | Local dev server at `localhost:4321/ocd-tattoo/` |
| `npm run build` | Build to `./dist/` |
| `npm run preview` | Serve the production build locally |

Note the `/ocd-tattoo/` base path — it's part of `astro.config.mjs` (see
**Deploying** below) and applies in dev too, not just prod.

## Project structure

```
src/
  content/
    work/<slug>/index.md + reference.jpg, stencil.jpg, fresh.jpg, healed.jpg
    flash/<slug>/index.md + image.jpg
  content.config.ts        — Zod schemas for the two collections above
  i18n/
    he.ts, en.ts            — all site copy, structured (not inline strings)
    types.ts                — the Dictionary shape both files implement
  lib/
    paths.ts                — locale-aware route helper (pagePath)
    whatsapp.ts              — wa.me link builders (claim flow + request flow)
  layouts/BaseLayout.astro  — <html lang/dir>, tokens.css + fonts.css import
  components/
    Nav.astro, Footer.astro, HealedScrubber.astro, FlashCard.astro,
    Countdown.astro
    pages/                  — one shared body component per page, taking a
                              `locale` prop; src/pages/** and src/pages/en/**
                              are thin wrappers around these
  pages/
    index.astro, work/, flash/, register/, studio/, request/   (Hebrew, root)
    en/index.astro, en/work/, en/flash/, en/register/, en/studio/, en/request/
  styles/
    tokens.css   — every color/size/motion value in the codebase, no one-offs
    fonts.css    — generated @font-face rules, self-hosted per-script subsets
public/
  fonts/         — the actual .woff2 files fonts.css points to
```

## Adding a work dossier

1. Create `src/content/work/<slug>/index.md` (slug becomes the URL segment,
   e.g. `ocd-26-014` → `/work/ocd-26-014/`).
2. Add four images next to it: `reference.jpg`, `stencil.jpg`, `fresh.jpg`,
   `healed.jpg`. Any raster format Sharp supports works; Astro re-encodes to
   AVIF/WebP at build time regardless of source format.
3. Fill in frontmatter — copy an existing entry as a template. Required
   fields: `serial`, `title_he`/`title_en`, `dateRange`, `placement_he`/
   `placement_en`, `sessions`, `hours`, `healedAt_he`/`healedAt_en`, `images`
   (relative paths to the four files above), `artistNote_he`/`artistNote_en`,
   and `featured` (only one entry should be `true` — it's the piece shown on
   the homepage hero).
4. `npm run build` — the dossier page and its `/work` index entry generate
   automatically from the collection, nothing else to wire up.

`healedAt_he`/`healedAt_en` are separate fields (not one field translated at
render time) because the unit word ("months"/"חודשים") differs by language —
keep both in sync.

## Adding a flash design

1. Create `src/content/flash/<slug>/index.md` + `image.jpg` next to it.
2. Frontmatter: `serial`, `title_he`/`title_en`, `releaseAt` (ISO 8601, the
   drop it belongs to — see **Drop schedule** below), `status` (`sealed` |
   `available` | `retired`), `placementSuggested` (array of strings),
   `approxSize`, `image` (relative path), and `claimedCity`/`claimedDate`
   (leave empty until retired).
3. `npm run build`. The Vault page (`/flash`) picks it up automatically,
   sorted sealed → available → retired, newest serial first within each
   group.

**Drop schedule:** designs release the first Thursday of the month at 20:00
Israel time. Give all designs in the same drop the same `releaseAt`
timestamp. The countdown shown on `/flash` and on the homepage's Vault door
is derived automatically — it's the earliest `releaseAt` among all
`status: sealed` entries, so it updates itself as you add/retire content;
there's no separate date to keep in sync.

## Retiring a flash design (claiming it)

When a client's deposit clears for a design:

1. Open `src/content/flash/<slug>/index.md`.
2. Change `status: available` → `status: retired`.
3. Fill in `claimedCity` and `claimedDate` (format `YYYY.MM.DD`, matching the
   existing entries).
4. Commit and push (or merge the PR, if you're doing this via GitHub's web
   editor) — the Actions workflow rebuilds and redeploys automatically. The
   design now shows desaturated with its claim record, permanently, on both
   `/flash` and `/register`.

There's no way to un-retire a design or delete a retired entry from the UI —
that's intentional (the Register is permanent by design). If you genuinely
need to correct a mistake, edit the frontmatter directly.

## Bilingual content

Hebrew is the source language; English is a translation of it, not the
reverse. Every user-facing string lives in `src/i18n/he.ts` / `en.ts` as
structured data — there are no inline strings in the `.astro` files. When you
add a new string, add it to `types.ts` first (so both locale files are
type-checked against the same shape), then both `he.ts` and `en.ts`.

Page components live once (in `src/components/pages/`) and take a `locale`
prop; the actual route files under `src/pages/` and `src/pages/en/` are one
line each. If you're adding a whole new page, follow that pattern rather than
duplicating markup between two files.

## Deploying

The included workflow (`.github/workflows/deploy.yml`) builds and deploys to
GitHub Pages on every push to `main`. One-time setup:

1. Push this repo to GitHub. **If the repo name isn't `ocd-tattoo`**, update
   `BASE_PATH` in `astro.config.mjs` to match, and update the font path
   prefix in `src/styles/fonts.css` (`/ocd-tattoo/fonts/...` → `/<repo-name>/fonts/...`)
   — a quick way to do the latter:
   ```sh
   sed -i '' 's#/ocd-tattoo/fonts/#/<repo-name>/fonts/#g' src/styles/fonts.css
   ```
2. In the repo's Settings → Pages, set **Source** to "GitHub Actions" (not
   the legacy branch-based deploy).
3. Push to `main`. Check the Actions tab for build status; the deployed URL
   appears in the workflow run summary once it finishes
   (`https://<username>.github.io/<repo-name>/`).

No secrets or environment variables are needed — everything the build uses
is either checked into the repo or fetched from public npm.

## Fonts

Self-hosted, per-script `.woff2` subsets in `public/fonts/`, generated from
Google Fonts (see `ASSETS-NEEDED.md` for the licensing note on the brief's
preferred commercial faces). If you need to regenerate these — new weight, a
licensed replacement font, or a smaller subset — the fetch/subset script used
to build `src/styles/fonts.css` is not checked into the repo; ask and I'll
hand it over or redo it directly.

## Known scope boundaries

- No analytics, no cookie banner, no third-party scripts — nothing to
  configure, nothing collecting data.
- The consultation request form and the flash claim flow both end in a
  prefilled WhatsApp link, not a server-side submission — this is the static
  site's real architecture, not a stopgap (see `PLAN.md` §7 in the original
  brief). Update the number in `src/lib/whatsapp.ts` before launch.
- Reference-image upload on `/request` is UI-only (no backend can receive a
  file from a static site) — the closing copy tells the client to attach it
  in the WhatsApp chat that opens.
