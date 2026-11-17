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
Keep the existing foundation:
- Vite
- React
- TypeScript
- Tailwind CSS
- React Router

Do not add Next.js, backend services, Supabase, fake checkout/ecommerce flows, or an entire UI kit merely for styling. For an explicitly approved major design/UX overhaul, individual licensed components from React Bits, Uiverse or similar sources may be copied and **adapted** locally if they preserve semantics, accessibility, source notices and bundle budgets. A new runtime animation or particle dependency needs a documented use case, bundle/performance assessment and an alternative comparison. For ordinary maintenance, do not install UI libraries or external particle packages.

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
pnpm run validate:dist
pnpm run check:bundle
pnpm run preview
```


## Research-driven design work

For substantial visual identity, UX, motion, player-select, homepage or full-remodel tasks, consult:
- [Living design intelligence](docs/SHUSH-DESIGN-INTELLIGENCE.md) — documented research, sources, licensing, decisions, rejected patterns, performance and reusable lessons.
- [Full remodel execution prompt](docs/SHUSH-MASTER-DESIGN-PROMPT.md) — use when explicitly tasked with a comprehensive redesign.

In significant design work, verify relevant research against current sources and append dated, source-linked findings and implementation evidence to the living document. Distinguish researched, prototyped and shipped work; do not claim that reading a document retrains the AI model. For trivial bugfixes, do not load these large documents. Maintain existing verified data, test behavior and pt-PT public copy. Work on a branch and do not publish to production without authorization.
