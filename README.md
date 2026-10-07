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
pnpm run check:assets
pnpm run check:links
pnpm run build
pnpm run validate:dist
pnpm run check:bundle
pnpm run preview
```

Use `pnpm run validate` for the full sequence. Premier tests cover runtime timezone independence, Lisbon DST boundaries, window edges, playoff outcomes and rejection of invalid static data. Pull requests to `master` run the same checks in GitHub Actions.

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
