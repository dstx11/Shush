# SHUSH

SHUSH is a dark premium gamer site built with Vite, React, TypeScript, Tailwind CSS v4, Motion, React Router DOM v7, Supabase JS prep and lucide-react.

## Local Development

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

## Deploy

- Build command: `pnpm run build`
- Output directory: `dist`
- Static SPA fallback: `public/_redirects` maps public routes to `index.html`.
- Cloudflare Pages target: static Vite build from `dist`.

## Supabase Prep

Client integration is prepared in `src/lib/supabase.ts` with:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

No service role key, frontend password or real auth flow is implemented.

## Site Structure

- `/`
- `/esports`
- `/esports/valorant`
- `/esports/valorant/premier`
- `/esports/valorant/roster`
- `/esports/valorant/results`
- `/esports/valorant/tournaments`
- `/content`
- `/content/more`
- `/content/th0maz7`
- `/products`
- `/products/jersey`
- `/products/jersey/custom`
- `/company`
- `/company/partners`
- `/company/contact`

Products are manual. There is no checkout, payment integration or backend.

Admin shell: hidden visual-only modal via `↑ ↑ ↓ ↓ ← → ← →`. It does not authenticate, persist or protect anything.
