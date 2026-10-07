# AGENTS.md - SHUSH website instructions for Codex

## Project Purpose
This repository is the SHUSH website. The root project is now the production source for a Vite + React + TypeScript + Tailwind CSS static site.

Final public areas:
- Home
- Premier
- Roster
- Creators
- Drop 01
- About

## Brand Direction
SHUSH should feel dark, premium, technical, immersive, gamer and professional without pretending to be a giant esports organization.

Core sentence:
> Sem barulho. Só rounds.

Positioning:
- small gamer micro-org with strong identity
- premium jersey showcase
- professional roster
- credible About section
- Backora as technical/digital partner
- smooth static website experience

Do not make SHUSH look like a meme site, a fake major org, or a corporate template.

## Technical Stack
Use only:
- Vite
- React
- TypeScript
- Tailwind CSS
- Motion for React
- lucide-react

Do not add:
- Next.js
- backend services
- Supabase
- UI libraries
- external particle libraries
- fake checkout/ecommerce flows

## Assets
Final public assets live under `public/assets/`.

Roster images must:
- use real provided avatars only
- fall back to premium initials/placeholders when missing
- never reference missing files
- never use generated fake people

Jersey assets live under `public/assets/jersey/`.
Brand assets live under `public/assets/brand/`.

## Copy Rules
Voice:
- short
- clean
- confident
- premium
- human
- gamer
- professional

Avoid fake sponsors, fake rankings, fake achievements, fake match history, fake org history, roast copy and meme-heavy copy.

## Accessibility And Performance
Required:
- `lang="pt-PT"`
- semantic navigation with `aria-label`
- `aria-current="page"` on active nav links
- mobile menu with `aria-expanded` and `aria-controls`
- Escape closes mobile menu
- visible `:focus-visible`
- sufficient contrast
- `prefers-reduced-motion`
- meaningful alt text for meaningful images
- empty alt text for decorative images
- keyboard navigation works

Performance:
- use image dimensions
- lazy-load non-hero images
- keep motion on transform/opacity
- avoid heavy filters in loops
- avoid layout shift and horizontal overflow

## Validation Commands
Run from the project root:

```powershell
pnpm install
pnpm run typecheck
pnpm run build
pnpm run preview
```
