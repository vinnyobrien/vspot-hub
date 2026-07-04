# The V Spot Network — thevspotnews.com

The Git-backed home of The V Spot Network hub. Astro static site, deployed on Netlify.

- Live: https://thevspotnews.com
- Netlify project: thevspotnews (site ID cea45ed6-12ff-4adb-ae22-b0e68b97110f)
- Build: `npm run build` → publishes `dist/` (configured in netlify.toml)
- Architecture: see ARCHITECTURE.md
- Brand system: VSPOT-BRAND-BIBLE (see the vspot-network-brand Claude skill)

## Map
- `src/pages/` routes · `src/pages/vinland/[slug].astro` renders essay stubs from `src/data/vinland.js`
- `src/layouts/Essay.astro` is the art-object template for migrated essays
- `public/brand/` all graded imagery · `public/llms.txt` + `robots.txt` = the AI discovery layer
- `netlify/functions/submission-created.mjs` sends the Resend welcome email (needs RESEND_API_KEY env var)

Maintained by Vinny O'Brien and Claude, his website architect. Murt Moriarty contributed nothing and claims full credit.
