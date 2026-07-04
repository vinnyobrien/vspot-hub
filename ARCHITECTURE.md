# The V Spot Network — Site Architecture & 12-Month Media Infrastructure Plan

Version 1.0 · July 2026 · Prepared by Claude for Vinny O'Brien
Status: Approved direction. thevspotnews.com is canonical.

---

## 1. The Decision Stack

| Layer | Choice | Why |
|---|---|---|
| Canonical domain | **thevspotnews.com** | Exact match with YouTube @thevspotnews. .com trust, email deliverability, one brand string everywhere. |
| Vanity/short links | **thevspot.news** | Branded shortener: thevspot.news/ostrich, /bus, /camp. 301s only, never canonical content. |
| Platform | **Astro on Netlify, Git-backed (GitHub)** | Static-first speed, content collections, zero lock-in, and the only architecture where Claude can create + place + deploy in one motion. |
| Email capture | **Netlify Forms → Resend** | Form captures on-site, a submission-created function fires the welcome email via Resend. List of record exports to Resend Audiences. |
| Email distribution | **Substack (vinnyandco.com) for now** | 4,000 subs stay put. Revisit at Phase 3 (Jan 2027). |
| Consulting | **vinnyandco.com** | Remains the Vinny and Co Consulting shopfront and current Substack custom domain. |

### On vinnyandco.com authority (your question)
vinnyandco.com is a **custom domain**, not a subdomain. Substack serves your publication *at* vinnyandco.com, which means every backlink, share, and search ranking accrues to a domain **you own**, not to vinnyandco.substack.com. That is the good news: the authority is portable because the domain is portable.

The catch: Substack does not let you set per-post canonical tags or redirects. So the migration rule is:

- **New editorial** publishes canonically on thevspotnews.com first; the Substack email version links back to the canonical URL ("Read the full piece with the GIFs intact →").
- **Back catalogue** stays where it is until the Substack decision in Phase 3. If we ever move the publication off Substack, we point vinnyandco.com's DNS at the new home and map URLs, and the authority comes with us.
- Never publish the same piece in full at both places without the hub owning it.

---

## 2. URL Taxonomy (Definitive)

One canonical URL per piece of content, forever. Subdirectories, never subdomains.

```
thevspotnews.com/
├── /                          Network front page (programming grid)
├── /shows/                    Show index
│   ├── /ostrich-report/       + /ostrich-report/[slug]
│   ├── /struggle-bus/         + /struggle-bus/[episode-slug]
│   ├── /nearly-news/          + /nearly-news/[episode-slug]
│   ├── /saturday-satire/
│   └── /sunday-supplement/
├── /essays/[slug]             Long-form (Friction as Currency, Winard, etc.)
├── /papers/[slug]             White papers (The Inevitable Shift, etc.)
├── /vinland/                  The VINLAND map + art-object pages migrate here
├── /nearly-ecomm-news/        LinkedIn newsletter archive
├── /events/
│   ├── /happy-hour/           Ecommerce Happy Hour
│   └── /camp-tralee/          Teaser page → links out to camptralee.com
├── /about/                    Vinny, the network, the frameworks
├── /sponsors/                 The commercial front door + media kit
├── /subscribe/                Email capture
├── /welcome/                  Post-signup thank-you page
├── /now/                      What Vinny is working on (LLMs love this)
├── llms.txt · llms-full.txt · robots.txt · sitemap.xml · rss.xml (+ per-show RSS)
```

### Domain routing table

| Domain | Action | Target |
|---|---|---|
| thevspotnews.com | Canonical | — |
| thevspot.news | 301 shortener | /{slug} map in _redirects |
| thenearlynews.com | 301 | /shows/nearly-news/ |
| thestrugglebus.co | 301 | /shows/struggle-bus/ |
| theostrichreport.eu | 301 | /shows/ostrich-report/ |
| camptralee.com | Standalone | Event property, cross-linked |
| vinnyandco.com | Standalone | Substack + consulting, until Phase 3 |
| agenticforshopify.com, theagenticworker.com, myshopifyagent.com | Park → 301 to relevant essays | Decide at Feb 2027 renewal |
| whatannadidnext.com, brandworx.io, aedireland.com | Kill list | Let lapse unless story emerges |

---

## 3. Repo Structure

```
vspot-hub/                      GitHub: private repo, Netlify auto-deploys main
├── ARCHITECTURE.md             This document
├── astro.config.mjs
├── package.json
├── netlify.toml                Build config + redirects + headers
├── public/
│   ├── robots.txt              Explicitly welcomes GPTBot, ClaudeBot, PerplexityBot, Google-Extended
│   ├── llms.txt                Curated map for LLM crawlers
│   ├── fonts/ · brand/         Logos, V-bug, OG image templates
├── src/
│   ├── layouts/Base.astro      Global head: JSON-LD, OG, palette, fonts
│   ├── components/             Masthead, ProgrammingGrid, ShowCard, SignupForm, Footer
│   ├── styles/tokens.css       The five master colours + type scale, single source of truth
│   ├── content/                ASTRO CONTENT COLLECTIONS — the heart of the system
│   │   ├── config.ts           Schemas: show, episode, essay, paper, event
│   │   ├── essays/*.md         Frontmatter: title, date, show, tags, ogImage, threads[]
│   │   ├── episodes/*.md       Per show, with youtubeId, transcript path
│   │   └── papers/*.md
│   ├── pages/                  Routes generated from collections
│   └── transcripts/*.md        Full transcripts (the #1 LLM visibility lever)
└── netlify/functions/
    └── submission-created.ts   Fires Resend welcome email on form signup
```

**Why content collections matter:** every asset is a markdown file with typed frontmatter. Claude writes the file, the taxonomy places it, the build generates the page, RSS, sitemap, and JSON-LD automatically. No CMS, no clicking, no Wix.

---

## 4. The `vspot-publish` Skill (Spec)

A new Claude skill that makes deployment a one-sentence instruction.

**Trigger:** "publish this", "ship it to the hub", "deploy the essay", "add this episode", or any completed V Spot asset.

**The skill knows:**
1. The full URL taxonomy above (where every content type lives)
2. Frontmatter schemas for each collection
3. Brand tokens (via vspot-network-brand skill)
4. The threading rule: check memory/past chats for related pieces and populate `threads[]` so narrative continuity is machine-readable
5. Metadata requirements: JSON-LD type, OG image treatment per show, GIF placement rules
6. The deploy motion: write file → update llms.txt if it's a flagship piece → build → deploy to Netlify → verify the live URL → report back with the canonical link and suggested LinkedIn/Substack cross-posts

**Guardrails:** never deploys to production without showing Vinny the rendered draft URL first (Netlify deploy preview); never creates a new URL for content that already has one; no em-dashes anywhere.

I will write this skill once the repo is in GitHub and connected, so it encodes the real site ID and real paths.

---

## 5. LLM Discoverability Checklist (Becoming the Most Cited Voice)

The strategy: LLMs cite sources that are **crawlable, structured, transcribed, consistent, and named**. Most ecommerce commentators fail on transcripts and structure. That is the gap.

- [x] robots.txt explicitly allows GPTBot, ClaudeBot, Claude-Web, PerplexityBot, Google-Extended, CCBot
- [x] llms.txt: curated index of flagship essays, frameworks, and shows with one-line descriptions
- [ ] llms-full.txt: concatenated full text of the flagship canon (Friction as Currency, Winard, de minimis series)
- [x] JSON-LD on every page: Person (Vinny O'Brien, sameAs → LinkedIn, YouTube, Substack), Organization (The V Spot Network), Article/PodcastEpisode/Event per item
- [ ] **Full transcripts for every video and podcast episode.** Whisper output from the n8n stack, cleaned, published at /transcripts/. This is the single biggest lever and it is currently at zero.
- [ ] Named frameworks as citable pages: /essays/friction-as-currency, /about#thought-commercial-grid. LLMs cite named concepts attached to named people.
- [x] One canonical URL per idea, stable forever
- [ ] RSS per show + master feed (LLM crawlers use feeds for freshness)
- [ ] /now page updated monthly (high-freshness signal)
- [ ] Consistent byline string everywhere: "Vinny O'Brien, The V Spot Network"
- [ ] Cross-Atlantic tagging in frontmatter (region: EU/US/UK) — makes you the retrievable answer for "EU vs US ecommerce" queries specifically

---

## 6. Email: Capture → Welcome → Ring-fence

1. **Capture:** /subscribe form (also embedded in footer sitewide). Netlify Forms with honeypot field. Zero third-party scripts.
2. **Thank-you:** instant redirect to /welcome — an on-brand page that sets expectations (what you get, when) and links the three best essays.
3. **Welcome email:** Netlify `submission-created` function calls Resend. From: vinny@mail.thevspotnews.com (subdomain keeps sender reputation ring-fenced). Warm, funny, one CTA.
4. **List of record:** Netlify form submissions sync to a Resend Audience. Substack list stays separate until Phase 3; the hub list is the owned asset we grow from day one.
5. **DNS to set:** SPF, DKIM, DMARC for mail.thevspotnews.com in Resend before first send.

---

## 7. Wix Exit Plan

1. Inventory every live Wix page (I'll crawl it once you give me the URL)
2. Anything worth keeping → migrate to a collection with matching frontmatter
3. Map old URLs → new canonical URLs in netlify.toml redirects
4. Point DNS at Netlify, keep Wix live but dark for 30 days as rollback
5. Cancel Wix at next renewal. Do not delete until redirects verified in Search Console

---

## 8. 12-Month Phases (Confirmed)

| Phase | Window | Ships |
|---|---|---|
| 1. Foundation | Jul–Sep 2026 | Domain live, repo + skeleton deployed, vspot-publish skill, VINLAND migrated, email capture live, all new content canonical on the hub |
| 2. Migration | Oct–Dec 2026 | Back catalogue in, redirects live, transcript pipeline running, Wix cancelled, Camp Tralee surfaces linked |
| 3. Monetization | Jan–Mar 2027 | Sponsor kit at /sponsors, Substack decision executed, Camp Tralee amplification moment, Resend audience segmentation |
| 4. Scale | Apr–Jun 2027 | Video editor outsourced, publishing cadence doubled, llms-full.txt canon complete, first "most-cited" audit |

---

## 9. Open Items Needing Vinny

1. VINLAND page URLs (the Netlify destinations) so I can migrate them
2. Current Wix site URL for the inventory crawl
3. GitHub org/username to create the repo under
4. Resend: confirm the account can add mail.thevspotnews.com as a sending domain
5. DNS access at GoDaddy when we're ready to point thevspotnews.com at Netlify
