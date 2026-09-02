# CMS auth relay (Cloudflare Worker)

Backs the Decap CMS admin panel at `/admin` (see `../public/admin/`). Decap's
`github` backend needs to exchange a GitHub OAuth code for an access token,
and that exchange needs the OAuth App's client *secret* — which can't live
in the browser. This Worker is the one place that secret lives, same reason
`../worker/` exists for the contact form.

## Status: not yet set up

Nothing is deployed yet. One-time setup:

1. **Create a GitHub OAuth App** — [github.com/settings/developers](https://github.com/settings/developers) → "New OAuth App".
   - Application name: anything, e.g. "OCD Tattoo CMS"
   - Homepage URL: `https://ocdtattoo.com`
   - Authorization callback URL: `https://ocd-tattoo-cms-auth.omer3107.workers.dev/callback`
     (or your actual `*.workers.dev` subdomain — check with `npx wrangler whoami`
     if unsure, or just deploy once first and use the URL Wrangler prints)
   - Save it. Copy the **Client ID**, and generate + copy a **Client secret**.

2. `cd cms-auth && npm install`

3. Put the client ID in `wrangler.toml` → `GITHUB_CLIENT_ID` (not secret,
   it's public in the OAuth redirect URL anyway).

4. `npx wrangler secret put GITHUB_CLIENT_SECRET` — paste the client secret
   when prompted. Stored encrypted on Cloudflare, never in the repo.

5. `npm run deploy`. Wrangler prints the deployed URL — confirm it matches
   `base_url` in `../public/admin/config.yml` (currently
   `https://ocd-tattoo-cms-auth.omer3107.workers.dev`); update both the
   OAuth App's callback URL and `config.yml` if the actual subdomain differs.

6. Push the site to GitHub (`config.yml` points at `omermiter/ocd-tattoo-astro`,
   branch `main`) so `/admin` has a repo to authenticate against.

7. Visit `https://ocdtattoo.com/admin/` (or `http://localhost:4321/admin/`
   for local testing against the deployed Worker), log in with a GitHub
   account that has write access to the repo, and confirm you can open and
   save an entry.

## Local testing

`npm run dev` runs this Worker locally via Wrangler (needs
`GITHUB_CLIENT_SECRET` available locally — `wrangler dev` reads secrets from
`.dev.vars`, which is gitignored; create it with
`GITHUB_CLIENT_SECRET=...` if you need to test the callback locally).
Point the OAuth App's callback URL and `config.yml`'s `base_url` at
`http://localhost:8788` (or whatever port Wrangler prints) temporarily.

## Who can actually write

This Worker only proxies the OAuth handshake — it doesn't gate access
itself. Once someone has a GitHub token, Decap uses it to call GitHub's API
directly, so the real permission boundary is GitHub's own: only accounts
with write/push access to `omermiter/ocd-tattoo-astro` can save changes through
`/admin`, same as they could with `git push` directly.
