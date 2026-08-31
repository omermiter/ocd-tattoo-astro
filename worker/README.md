# Contact-form relay (Cloudflare Worker)

The main site (`../`) is 100% static and deploys to GitHub Pages. GitHub Pages
can't run server code, and sending mail through Resend needs a server-side
API key — so that one piece lives here, as a small separate Cloudflare
Worker. Nothing else about the site's hosting changes.

## Status: deployed

Live at `https://ocd-tattoo-contact.omer3107.workers.dev`, `RESEND_API_KEY` is
set as an encrypted secret, and `CONTACT_ENDPOINT` in `../src/lib/contact.ts`
already points at it. Verified working end-to-end (curl + a real browser
submission both went through).

**One thing left before going live:** `wrangler.toml` → `ALLOWED_ORIGIN` is
currently `http://localhost:4321` (set that way to test locally). Once the
real domain is live, change it to that domain (e.g. `https://ocdtattoo.com`)
and run `npm run deploy` again — otherwise the deployed site's contact form
will silently fail in the browser (the Worker still runs and still sends the
email, but the browser blocks the response due to the CORS mismatch, so the
visitor sees the "something went wrong" fallback instead of the real
confirmation).

## One-time setup (for reference / redoing from scratch)

1. `cd worker && npm install`
2. Get a [Resend](https://resend.com) API key (free tier is enough for a
   contact form's volume).
3. `npx wrangler login` (needs a free Cloudflare account).
4. `npx wrangler secret put RESEND_API_KEY` — paste the Resend key when
   prompted. This is stored encrypted on Cloudflare, never in the repo.
5. Edit `wrangler.toml` → `ALLOWED_ORIGIN` to the real site domain once it's
   live.
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
