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
pnpm run build
pnpm run preview
```

Pull requests to `master` also run install, typecheck and production build in GitHub Actions.

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
- `public/_redirects` only contains legacy URL redirects; Cloudflare Pages handles unmatched SPA routes natively.
- Node.js is pinned through `.node-version`.
- Target: Cloudflare Pages

## Product rules

The site only publishes information and assets that exist in the repository data. Product requests are manual. The customizer only prepares a request summary; it does not place or confirm an order.
