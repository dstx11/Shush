# AGENTS.md — SHUSH website instructions for Codex

## Project
This repository is the SHUSH website, a static HTML/CSS/JS project.

Final pages:
- `index.html`
- `roster.html`
- `drop01.html`
- `about.html`

Current legacy concepts that must be removed:
- Call Room
- Troll Mode
- meme-heavy copy
- fake esports grandeur

## Brand direction
SHUSH is a small premium gamer micro-org/team with a strong visual identity.

The site should feel:
- dark, premium and sophisticated
- gamer, but not childish
- technical and credible
- immersive and smooth
- well aligned and spacious
- professional, but not corporate

Core sentence:
> Sem barulho. Só rounds.

Backora is the technical/digital partner and must remain integrated with credibility.

## Non-negotiable direction
Do not make SHUSH look like a fake giant esports organization.
Do not make SHUSH look like a meme site.
Do not preserve weak old ideas just because they already exist.

The goal is:
> A small gamer micro-org with strong identity, a premium jersey showcase, a professional roster, a credible About page and a smooth immersive website experience.

## Technical constraints
Keep:
- vanilla HTML
- vanilla CSS
- vanilla JavaScript
- static site architecture
- existing jersey/logo/Backora assets where useful
- roster filters
- Drop 01 manual order flow
- accessibility baseline
- `prefers-reduced-motion`
- mobile responsiveness

Do not add:
- frameworks
- heavy dependencies
- fake sponsors
- fake achievements
- fake rankings
- fake match history
- fake organization history
- real ecommerce/checkout if the current project only supports manual request

## Avatar asset rule
The `assets/avatars/` folder may be empty. Real player photos will be added later.

The roster must:
- render correctly without avatar images
- use clean CSS placeholders/initials when no photo is available
- never show broken image icons
- upgrade gracefully when avatar files are later added
- not generate fake player photos or use remote placeholder images

## Design priorities
1. Text alignment and visual hierarchy
2. Home hero
3. Jersey showcase
4. Header/nav
5. Mobile layout
6. Roster professionalism
7. Drop 01 as launch/concept page
8. About page
9. Motion and microinteractions
10. Performance/accessibility cleanup

## Motion rules
- Fix layout before adding motion.
- Prefer `transform` and `opacity`.
- Avoid animating `width`, `height`, `top`, `left`, `margin`, `padding`.
- Avoid heavy filters and constant expensive blur.
- Use `will-change` sparingly.
- Respect `prefers-reduced-motion`.
- Simplify motion on mobile when needed.

## Copywriting rules
Voice should be:
- short
- clean
- confident
- premium
- human
- gamer
- professional
- slightly distinctive

Avoid:
- “experiência única”
- “paixão pelo gaming”
- “excelência competitiva”
- “comunidade inovadora”
- “performance e união”
- “elite”
- “world class”
- “legacy”
- excessive jokes
- AI filler

Good examples:
- “Sem barulho. Só rounds.”
- “Uma equipa pequena, uma identidade cuidada e uma presença feita para durar.”
- “Gaming, estética e estrutura. Sem promessas falsas.”
- “A primeira peça oficial da SHUSH, criada com a Backora.”
- “Não somos uma mega organização. Somos uma equipa com direção visual.”

## Accessibility requirements
- `lang="pt-PT"`
- semantic `<nav>` with `aria-label`
- `aria-current` on active nav links
- mobile menu button uses `aria-expanded` and `aria-controls`
- Escape closes mobile menu
- visible `:focus-visible`
- sufficient contrast
- `prefers-reduced-motion`
- `aria-live` on Drop 01 generated output
- meaningful image alt text
- decorative images use empty alt
- form labels and useful input names
- keyboard navigation works

## Validation before finishing
Run or explain how to run:
- `python -m http.server 5173`
- `python scripts/validate_shush_static.py`

Confirm manually:
- all pages open
- nav links work
- active nav works
- mobile menu opens/closes
- Escape closes menu
- roster renders without avatar images
- roster filters work
- Drop 01 form works
- generated message works
- copy button works
- no horizontal scroll
- no text overlap
- no visible Call Room references
- no visible Troll Mode references
- no broken image icons

## Reporting format after each task
Return:
1. Files changed
2. What changed
3. What was intentionally not changed
4. Risks/limitations
5. Validation performed
6. Manual checks still needed
