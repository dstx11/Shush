# SHUSH

SHUSH is a dark premium gamer team site built with Vite, React, TypeScript, Tailwind CSS, Framer Motion and lucide-react.

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
- Cloudflare Pages SPA fallback works without `public/_redirects` while there is no top-level `404.html`.

## Site Structure

- Home
- Esports
- Content
- Products
- Company

The Products flow is manual. There is no checkout, payment integration or backend in this project.

Admin shell: hidden visual-only modal via `↑ ↑ ↓ ↓ ← → ← →`. It does not authenticate, persist or protect anything.
