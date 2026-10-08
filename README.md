# SHUSH

Official SHUSH website. A static Vite + React + TypeScript experience focused on Valorant Premier, the public roster, creators and Drop 01.

## Stack

- Vite
- React
- TypeScript
- Tailwind CSS v4
- React Router

There is no backend, authentication, checkout or payment integration.

## Local development

```powershell
pnpm install
pnpm run dev
```

## Validation

```powershell
pnpm run typecheck
pnpm run test:premier
pnpm run test:profiles
pnpm run check:assets
pnpm run check:links
pnpm run build
pnpm run validate:dist
pnpm run check:bundle
pnpm run preview
```

Use `pnpm run validate` for the full sequence. Premier tests cover runtime timezone independence, Lisbon DST boundaries, window edges, playoff outcomes and rejection of invalid static data. Pull requests to `master` run the same checks on Linux and Windows in GitHub Actions. TypeScript also rejects unused locals and parameters.

Browser QA runs separately in CI against the production build: Chromium at 320, 390, 768, 1366 and 1920px, plus mobile WebKit. It checks layout overflow, headings, images, metadata, mobile menu/keyboard focus, player profiles and Drop interactions, and saves screenshots in the `responsive-qa` artifact. To run locally after building: `pnpm exec playwright install --with-deps chromium webkit`, then `pnpm run test:browser`. Playwright is a development-only dependency.

Same-repository PRs also run `check:preview`: CI waits for the current entry asset to reach the Cloudflare branch alias, then checks real HTTP route metadata, security headers, preview noindex, canonical redirect, entry asset and unknown-route 404. An immutable deploy can be audited with `pnpm run check:preview https://<deploy>.shush-4n1.pages.dev`. This remote check is separate from offline `validate`.

## Competitive profiles

The seven owner-confirmed account associations live in `src/data/competitive-profiles.ts`, independently of public player names. The roster displays Riot ID and queue and opens the exact corresponding Tracker.gg profile. Build and Node tests reject mismatched accounts, Unicode/URL encoding errors and incompatible season/queue metadata.

There is no authorized public Tracker VALORANT API, so the site does not fetch or mirror statistics. [Research and the future authorization/snapshot requirements](docs/competitive-profiles.md) document this decision. The supplied DSTX link retains its selected Competitive season; the UI never presents it as the current season or compares it to Premier profiles.

## Public routes

- `/` — Home
- `/esports/valorant/premier` — Premier Match Center
- `/esports/valorant/roster` — Roster
- `/content` — Creators
- `/products/jersey` — Drop 01
- `/company` — About

Legacy URLs redirect to the closest current destination.

## Deploy

- Build command: `pnpm run build`
- Output: `dist`
- Canonical routes get route-specific static metadata pages during the Vite build.
- `public/_redirects` contains canonical legacy/trailing-slash redirects.
- A top-level `404.html` gives unknown direct URLs a real 404 response.
- Known deep routes are emitted as static HTML files and hydrate into the React app.
- Node.js is pinned through `.node-version`.
- Target: Cloudflare Pages

## Product rules

The site only publishes information and assets that exist in the repository data. Product requests are manual. The customizer only prepares a request summary; it does not place or confirm an order.

A closed calendar with incomplete results is labelled as a closed published phase with an unconfirmed outcome. Published points are not presented as a final score, and missing results never prove elimination. Confirmed playoff results determine placement and championships.

## Design direction

Research, product decisions and remaining release checks are recorded in [docs/design-evolution.md](docs/design-evolution.md). Roster selections can be shared through `?player=<player-id>` on the canonical roster route.
