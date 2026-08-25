# Contact-form relay (Cloudflare Worker)

The main site (`../`) is 100% static and deploys to GitHub Pages. GitHub Pages
can't run server code, and sending mail through Resend needs a server-side
API key — so that one piece lives here, as a small separate Cloudflare
Worker. Nothing else about the site's hosting changes.

## One-time setup

1. `cd worker && npm install`
2. Get a [Resend](https://resend.com) API key (free tier is enough for a
   contact form's volume).
3. `npx wrangler login` (needs a free Cloudflare account).
4. `npx wrangler secret put RESEND_API_KEY` — paste the Resend key when
   prompted. This is stored encrypted on Cloudflare, never in the repo.
5. Edit `wrangler.toml` → `ALLOWED_ORIGIN` to the real site domain once it's
   live (defaults to the placeholder `https://ocdtattoo.com`).
6. `npm run deploy`. Wrangler prints the deployed URL, something like
   `https://ocd-tattoo-contact.<your-subdomain>.workers.dev`.
7. Paste that URL into `CONTACT_ENDPOINT` in `../src/lib/contact.ts`, rebuild
   and redeploy the main site.

## Sender address

`src/index.ts` sends from `onboarding@resend.dev`, which works immediately
with no setup but has weaker deliverability than a verified domain. Once
you've added and verified `ocdtattoo.com` (or whatever the real domain is)
in Resend, change the `from` field to something like
`"OCD Tattoo <contact@ocdtattoo.com>"`.

## Local testing

`npm run dev` runs the Worker locally via Wrangler. Point
`CONTACT_ENDPOINT` at `http://localhost:8787` temporarily to test the form
against it before deploying.
