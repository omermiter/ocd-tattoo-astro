# OCD Tattoo — site

Static Astro 5 site for OCD Tattoo (`@ocd_tattoo`), rebuilt around the color
pixel art pivot. English only. Deploys to GitHub Pages behind a custom
domain — no server, no database, no runtime env vars in the main site.

## Commands

| Command | Action |
|---|---|
| `npm install` | Install dependencies |
| `npm run dev` | Local dev server at `localhost:4321/` |
| `npm run build` | Build to `./dist/` |
| `npm run preview` | Serve the production build locally |

## Project structure

```
src/
  content/
    pieces/<slug>.md   — the growing "Pieces" collection (see below)
    flash/<slug>.md    — one-of-one flash designs shown on the Register
  content.config.ts    — Zod schemas for both collections
  data/
    site.json          — editable site copy + contact info (see Admin panel)
  lib/
    contact.ts         — WhatsApp/Instagram links, Resend Worker endpoint
    media.ts           — build-time "does this photo exist yet" check
    text.ts            — *emphasis* markup helper for site.json copy
  layouts/BaseLayout.astro
  components/
    Nav.astro, Footer.astro
    PrecisionGrid.astro  — the hero's signature grid + cursor-spotlight motion
    PieceCard.astro, PieceMedia.astro, FlashRow.astro
  pages/
    index.astro, pieces/, register/, contact/, 404.astro
  styles/
    tokens.css   — every color/size/motion value in the codebase, no one-offs
    global.css   — resets + shared utilities (.data, .eyebrow, .grid-texture)
    fonts.css    — generated @font-face rules, self-hosted latin/latin-ext
public/
  admin/     — Decap CMS admin panel (see Admin panel, below)
  fonts/     — the actual .woff2 files fonts.css points to
  pieces/    — real piece photography drops in here (see below)
  flash/     — real flash-design photography drops in here
  uploads/   — images uploaded through the admin panel that aren't a piece/flash photo
  CNAME      — the custom domain GitHub Pages serves this repo on
worker/
  — a small separate Cloudflare Worker that relays the contact form to
    Resend (GitHub Pages can't run server code — see worker/README.md)
cms-auth/
  — a small separate Cloudflare Worker that backs GitHub login for the
    admin panel (see Admin panel, below, and cms-auth/README.md)
```

## Adding a piece

1. Create `src/content/pieces/<slug>.md`.
2. Frontmatter: `serial`, `title`, `placement`, `size`, `sessions` (number),
   `hours` (number), `date`, `note` (your own words — this is the one place
   the precision argument gets made in the artist's voice, not marketing
   copy), and optionally `photo` (see below).
3. `npm run build`. It appears on both `/` (as part of the growing set) and
   `/pieces/` automatically — nothing else to wire up.

**Photography:** `photo` is a plain path like `/pieces/ocd-01.jpg` — not
Astro's image pipeline, because most pieces don't have a photo yet. Drop the
actual file into `public/pieces/` under that exact path and rebuild; the
placeholder panel (serial + "Photography pending") is replaced by the real
photo automatically. No photo, no `photo` field, no error — it just shows the
panel.

## Adding a flash design to the Register

1. Create `src/content/flash/<slug>.md`.
2. Frontmatter: `serial`, `title`, `status` (`available` | `claimed`),
   `size`, `placement`, and `claimedDate` (leave empty until claimed, format
   `YYYY.MM.DD`).
3. `npm run build`. Shows on `/` (latest 5) and the full `/register/`
   automatically, available designs sorted first.

**Claiming a design:** open the file, set `status: claimed`, fill in
`claimedDate`. There's no un-claim path in the UI — the Register is a
permanent record by design. Correct mistakes by editing the frontmatter
directly.

The claim flow itself (the "Available →" toggle on `/register/`) is on-site:
it expands an inline panel with the deposit terms and a prefilled WhatsApp
link to actually confirm and take a deposit. Nothing about claiming happens
through the contact form.

## Contact form → Resend

The form on `/contact/` posts to a Cloudflare Worker (`worker/`), which is
the one non-static piece of this project. **It's deployed and working** —
see `worker/README.md` for status and the one remaining step (updating
`ALLOWED_ORIGIN` from `localhost` to the real domain once it's live).

If the Worker were ever undeployed or unreachable, the form fails closed: it
shows an error with a WhatsApp fallback link rather than pretending to have
sent anything.

## Admin panel

`/admin/` runs [Decap CMS](https://decapcms.org) — a browser-based editor
for everything content-shaped in this repo:

- **Pieces** and **Flash (Register)** — add/edit/delete entries, upload or
  replace photos, mark flash as claimed. Same fields as the frontmatter
  described above, just as a form.
- **Site Text & Settings** — the homepage hero, section intros, closing
  CTAs, the contact/register page intros, and the WhatsApp/Instagram/
  location shown in the footer. Backed by `src/data/site.json`.

Saving in the CMS commits directly to `main` on GitHub, which triggers the
same `deploy.yml` workflow a manual push does — no separate publish step.

It authenticates via GitHub OAuth, proxied through `cms-auth/` (a Worker,
same reason `worker/` exists for the contact form — see `cms-auth/README.md`
for one-time setup). Anyone who can push to this repo on GitHub can save
through `/admin/`; there's no separate admin password.

**Not yet wired up** — needs the one-time setup in `cms-auth/README.md`
(GitHub OAuth App + deploying that Worker) before `/admin/` will work.

## Analytics

[Cloudflare Web Analytics](https://www.cloudflare.com/web-analytics/) is
wired into `BaseLayout.astro` (privacy-friendly: no cookies, no personal
data collected, no cookie banner needed). **Not yet active** — the beacon
script currently has a placeholder token. To turn it on:

1. In the Cloudflare dashboard: Analytics & Logs → Web Analytics → Add a site.
2. Copy the token it gives you into `src/layouts/BaseLayout.astro`, replacing
   `REPLACE_WITH_CF_BEACON_TOKEN`.
3. Commit (or edit+save through `/admin/`, though this one file isn't
   exposed there — it's plain site code, not content).
4. Stats show up on that same Cloudflare dashboard page — the site itself
   has no analytics UI of its own.

## Deploying

The included workflow (`.github/workflows/deploy.yml`) builds and deploys to
GitHub Pages on every push to `main`. One-time setup:

1. Push this repo to GitHub.
2. In the repo's Settings → Pages, set **Source** to "GitHub Actions".
3. Set the real domain in `public/CNAME` (currently a placeholder,
   `ocdtattoo.com`) and point its DNS at GitHub Pages per
   [GitHub's custom-domain docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).
   Also update `site` in `astro.config.mjs` to match.
4. Push to `main`. Check the Actions tab for build status.

No secrets or environment variables are needed for the *main site build* —
everything it uses is checked into the repo or fetched from public npm. The
Resend relay is separate (see above) and does need one secret, but it's
managed by Cloudflare, not GitHub Actions.

## Fonts

Self-hosted `.woff2` files in `public/fonts/` (Fraunces, Archivo, Martian
Mono — latin + latin-ext subsets only, this is an English-only site),
generated from Google Fonts. The fetch script isn't checked into the repo;
ask and it'll get handed over or redone directly if you need new weights.

## Known scope boundaries

- Analytics is Cloudflare Web Analytics only (see above) — no cookie banner
  needed since it doesn't use cookies or collect personal data; nothing
  heavier (GA, Meta Pixel, etc.) is wired in.
- No deposit/payment collection happens on-site — the Register's claim flow
  and the flash booking both end in a WhatsApp handoff for that, by design.
