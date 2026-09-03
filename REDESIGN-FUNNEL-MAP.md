# OCD Tattoo — Funnel Map

Every path from "a stranger lands on this site" to "money or a booked appointment," traced against the actual deployed code and infrastructure as of 2026-09-03 — including one path that's live-broken right now. This is the checklist Phase 3 verification confirms end-to-end, including fallbacks.

There are three distinct conversion actions on this site, and every page routes toward one of them:

- **A — Start a commission** (custom piece, via the contact form)
- **B — Claim a flash design** (a specific one-of-one, via WhatsApp)
- **C — General inquiry / follow** (Instagram or a cold WhatsApp message)

---

## Path A — Start a commission (the primary path)

**Entry points:** Home hero → beat CTA → pieces section CTA → register-preview CTA → closing CTA (five separate CTAs on one page, all pointing at either `/contact/` or `/register/`, which itself points at `/contact/`); `/pieces/` closing CTA; `/register/` closing CTA; Nav "Contact" link (present, permanently violet-bright, on every page).

**Click path from any entry:** land on any page → click any "Start a commission →" (or Nav "Contact") → `/contact/` → fill Name/Email/Message → click "Send →" → **one click from any page except the two already on `/contact/`** — satisfies §4's "never increase clicks" bar, and the Nav Contact link plus the homepage hero's own CTAs already put it inside the first viewport on mobile without scrolling (confirmed: hero CTA is the "View the Register" beat line just below the fold, but Nav's Contact link is in the sticky-at-top nav bar, visible on load, zero scroll — that's the one that actually satisfies §4's "reachable from the first viewport on mobile without scrolling" requirement and must not be weakened).

**What happens on click "Send →":**
1. Client-side `fetch(POST)` to `https://ocd-tattoo-contact.omer3107.workers.dev` with `{name, email, message}` as JSON.
2. **🔴 BROKEN RIGHT NOW:** the Worker's `ALLOWED_ORIGIN` is still set to `http://localhost:4321` (confirmed live via a direct CORS preflight check against the deployed Worker this session — it responds `access-control-allow-origin: http://localhost:4321` regardless of what origin actually asked). A real visitor's browser on `https://ocdtattoo.com` will have this request blocked by CORS. The Worker itself still runs and still sends the email server-side in some cases, but the browser can't read the response, so:
3. The `fetch` throws → the code's `catch` block fires → status line shows: *"Something went wrong. Message me directly on WhatsApp instead."* with a live link to `wa.me/972544409502` (no prefill) → visitor lands on path C instead.

**This means path A currently silently degrades to path C for every real visitor**, not just as a designed fallback for Worker downtime, but as the *only* outcome, all the time, right now. The fallback mechanism itself works correctly (confirmed: the error branch renders and the WhatsApp link is live and correct) — it's just firing 100% of the time instead of only when the Worker is genuinely unreachable. **This is the single highest-priority open item in this whole audit** — it silently costs every custom-commission inquiry that would have gone through the form, and nothing in the UI tells Omer this is happening (no error tracking, no alert). Fixing it is one line in `worker/wrangler.toml` + a redeploy — flagging per this doc's own instructions to list, not fix, in Phase 0.

**On success (once fixed):** status line shows *"Sent. I read every message myself — expect a reply within a few days."*, form resets. No email confirmation is sent to the visitor, no redirect, no thank-you page — the inline success state is the entire "what happens" on the visitor's side. On Omer's side: an email arrives via Resend to `omer3107@gmail.com`, `reply_to` set to the visitor's address, subject `"New commission inquiry — {name}"`.

**Tracking:** none. No event fires on submit, success, or failure — only the passive Cloudflare Web Analytics pageview for having loaded `/contact/` at all. A submission that fails silently (per the bug above) leaves zero trace anywhere.

---

## Path B — Claim a flash design

**Entry points:** `/register/` only (the ledger itself); the homepage's register-preview list is **read-only** — it shows the same rows (serial/title/placement/gridSize/status) but has no claim toggle and isn't wrapped in a link to the real row, so a visitor who wants to claim from the homepage preview has to navigate to `/register/` first and find the entry again themselves.

**Click path:** `/register/` → click "Available →" on a specific row → panel expands in place (no navigation) → click "Confirm on WhatsApp →" → **two clicks from `/register/`**, or three from anywhere else (one to reach `/register/` first). This is the one path with more than one click before the handoff, but that's inherent to "pick a specific numbered item, then act on it" and isn't something the brief's "reduce clicks" constraint would apply to removing — it's not friction, it's selection.

**What happens on click:** opens `wa.me/972544409502?text=...` in a new tab, prefilled with *"I want to claim `{serial}` — `{title}`. I saw it on the Register."* — real, working, confirmed against the live number.

**Deposit/payment:** never happens on-site by design (confirmed in `README.md`'s own "Known scope boundaries" section, still accurate) — the WhatsApp handoff is where a deposit actually gets discussed and taken, entirely off-platform.

**Failure path:** none exists — this path has no server dependency (no Worker call), so there's nothing to fail except WhatsApp itself being unreachable, which is outside this site's control.

**Tracking:** none. No event fires on toggle-open or on the WhatsApp link click.

---

## Path C — General inquiry / follow (Instagram, cold WhatsApp)

**Entry points:** Footer, present on every single page (the only fully-global conversion element, since Nav's Contact link is the only other page-independent one) — "Instagram" and "WhatsApp" links, side by side, icon-optional text links.

**Click path:** any page → footer → one click to either destination. Zero clicks if a visitor arrived from an Instagram bio link in the first place and just bounces back.

**What happens on click:**
- "Instagram" → `https://instagram.com/ocd_tattoo` opens in a new tab. Real, working.
- "WhatsApp" → `https://wa.me/972544409502` opens in a new tab, no prefill. Real, working.

**This is also the fallback destination for path A's broken state** (§ above) and for the contact form's designed error path — same link, no prefill difference between the two entry reasons, so Omer can't currently tell from the WhatsApp side whether someone landed there because the form failed or because they just clicked the footer.

**Tracking:** none.

---

## Summary table

| Path | Primary action | Clicks (best case) | Status | Tracking |
|---|---|---|---|---|
| A — Commission | Contact form → email | 1 | 🔴 **Broken in production** — CORS misconfigured, silently degrades to C every time | None |
| A fallback | Form error → WhatsApp | 2 (1 to `/contact/`, 1 on the error link) | ✅ Works | None |
| B — Claim flash | Register → WhatsApp | 3 (nav to `/register/`, expand, confirm) | ✅ Works | None |
| C — General | Footer → IG or WhatsApp | 1 | ✅ Works | None |

---

## Other open items found while tracing these paths (listed, not fixed, per this phase's scope)

- **Contact Worker CORS mismatch** (above) — the one urgent item, actively costing real inquiries right now.
- **Resend sender address** is still `onboarding@resend.dev` (works, but weaker deliverability/trust than a verified `@ocdtattoo.com` sender — flagged as a TODO in the Worker's own code).
- **No event-level tracking anywhere in the funnel.** Cloudflare Web Analytics only sees pageviews. There's currently no way to know, even once the CORS bug is fixed, whether a form submission succeeded, whether a WhatsApp link was actually clicked (vs. just the page being viewed), or which of the three paths converts best. Not proposing new instrumentation here — flagging that today's baseline is zero, so any comparison after the redesign has nothing to compare against unless something is added deliberately (a Phase 2 recommendation, not a Phase 0 decision).
- **Flash designs currently have no photos anywhere**, even though the content schema supports a `photo` field and even though a value could be set — nothing in `FlashRow.astro` renders it. A visitor deciding whether to claim a design is working from title + spec text only, no image. Worth a decision at checkpoint 2: render it, or confirm it's deliberately text-only.
- **The homepage register preview isn't clickable/linked to individual rows** and has no claim affordance — a visitor has to already know to go to `/register/` itself. Not necessarily a problem (it may be intentional teaser behavior) but worth confirming it's a deliberate choice, not an oversight, since it's the one place path B has friction the rest of the funnel doesn't.
- **All three live "Pieces" are Pokémon designs** (see `REDESIGN-INVENTORY.md` §8) — this doesn't break the *funnel* (the CTAs and links all still work regardless of what the portfolio images show), but it is real content currently doing the "proof precedes ask" job the brief requires (§4) with content that can't ship under §0.2. Whatever routes to the placeholder system there needs to still make the "proof" job work — an empty portfolio ahead of the ask is a funnel regression even if no CTA changes, so this is worth explicit attention at checkpoint 2, not treated as purely a legal edit.
- **No studio name, address, or map link anywhere** — only "Israel" as a location string (see inventory §9/§11). If Topa Tattoo Studio, Kfar Saba is meant to be part of the trust signal (a real, findable physical location), that's currently missing entirely, not just under-designed.
- **Placeholder/undeployed items, otherwise:** none found beyond the above — the domain, both Workers, the CMS, and the WhatsApp/Instagram links are all real and deployed, which is further along than a typical Phase 0 audit finds. The gaps here are narrower and sharper (one live bug, missing tracking, missing studio identity, missing flash photos) rather than "half the site is placeholder."

---

## Stop point

Both `REDESIGN-INVENTORY.md` and `REDESIGN-FUNNEL-MAP.md` are complete. Per §3 of the brief: **stopping here for go-ahead before touching design or code.**

One thing worth deciding before Phase 1 starts, since it affects how Phase 1's "section-by-section mapping" gets written: do you want the Pokémon-piece question (and the CORS bug) handled as this-week fixes now, in parallel with the redesign planning, or folded into the redesign's Phase 2 build? Either works — flagging because the brief's checkpoint structure assumes Phase 0's open items wait for direction, and these two are different in kind (one's a content/legal call only you can make, the other's a one-line infra fix with no design implications at all).
