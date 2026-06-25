# AGENTS.md - SHUSH website instructions for Codex

## Project Purpose
This repository is the SHUSH website: a static vanilla HTML/CSS/JS site for a small premium gamer micro-org/team.

Final pages:
- `index.html` - Home
- `roster.html` - Roster
- `drop01.html` - Drop 01
- `about.html` - About

Current legacy concepts are temporary and must be removed in staged redesign work:
- Call Room
- Troll Mode
- meme-heavy copy
- fake esports grandeur

## Brand Direction
SHUSH should feel dark, premium, technical, immersive, gamer and professional without pretending to be a giant esports organization.

Core sentence:
> Sem barulho. Só rounds.

Positioning:
- small gamer micro-org with strong identity
- premium jersey showcase
- professional roster
- credible About page
- Backora as technical/digital partner
- smooth static website experience

Do not make SHUSH look like a meme site, a fake major org, or a corporate template.

## Hard Removals For Future Stages
Future implementation must remove:
- Call Room as a concept and primary nav page
- Troll Mode text, badges and data
- roast/meme-heavy player copy
- fake sponsors, fake achievements, fake rankings, fake match history and fake org history
- any real checkout/ecommerce claim while Drop 01 is only a manual request flow

Do not preserve weak old ideas just because they already exist.

## Technical Constraints
Keep:
- vanilla HTML
- vanilla CSS
- vanilla JavaScript
- static site architecture
- existing logo, jersey and Backora assets where useful
- roster filters
- Drop 01 manual order flow
- accessibility baseline
- `prefers-reduced-motion`
- mobile responsiveness

Do not add:
- frameworks
- heavy dependencies
- generated fake people
- remote placeholder images
- real ecommerce/checkout

## Coding Rules
- Read the existing project before editing.
- Keep changes staged and scoped.
- Prefer small, reviewable tasks over one large redesign.
- Preserve working features unless the stage explicitly replaces them.
- Use semantic HTML and clear class names.
- Avoid inventing claims, stats, sponsors or history.
- Do not edit generated-looking assets unless requested.

## Avatar Folder State
`assets/avatars/` is intentionally empty except documentation/keep files. Real player photos will be added later.

Roster implementation must:
- render correctly without avatar images
- use clean CSS placeholders, initials, silhouettes or gradient fallbacks
- never show broken image icons
- only include an `image` path when that file exists
- upgrade gracefully when real files are later added
- make photo replacement simple

Never:
- create fake avatars
- download placeholder avatars
- generate AI player portraits
- reference missing avatar files without a fallback
- change player identities to solve missing images

## Design Rules
Priorities:
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

Visual direction:
- dark theme
- cold purple/blue accents
- clean typography
- strong spacing
- controlled glow
- darker gamer Liquid Glass-inspired nav
- jersey as a showcase object
- smooth but lightweight motion

Avoid visual chaos, overdone particles, constant glitch, excessive blur, cramped sections and generic AI landing-page layouts.

## Copy Rules
Voice:
- short
- clean
- confident
- premium
- human
- gamer
- professional
- slightly distinctive

Good examples:
- "Sem barulho. Só rounds."
- "Uma equipa pequena, uma identidade cuidada e uma presença feita para durar."
- "Gaming, estética e estrutura. Sem promessas falsas."
- "A primeira peça oficial da SHUSH, criada com a Backora."
- "Não somos uma mega organização. Somos uma equipa com direção visual."

Avoid:
- "experiência única"
- "paixão pelo gaming"
- "excelência competitiva"
- "comunidade inovadora"
- "performance e união"
- "elite"
- "world class"
- "legacy"
- excessive jokes
- roasts
- troll language
- AI filler

## Animation Rules
- Fix layout before adding motion.
- Prefer `transform` and `opacity`.
- Avoid animating `width`, `height`, `top`, `left`, `margin` and `padding`.
- Avoid heavy filters in loops.
- Use `will-change` sparingly.
- Respect `prefers-reduced-motion`.
- Reduce motion on mobile where needed.
- Motion should feel alive, intentional and lightweight, not noisy.

## Accessibility Rules
Required:
- `lang="pt-PT"`
- semantic `<nav>` with `aria-label`
- `aria-current="page"` on active nav links
- mobile menu button with `aria-expanded` and `aria-controls`
- Escape closes mobile menu
- visible `:focus-visible`
- sufficient contrast
- `prefers-reduced-motion`
- `aria-live` on Drop 01 generated output
- meaningful alt text for meaningful images
- empty alt text for decorative images
- labels and useful names for form fields
- keyboard navigation works

## Performance Rules
- Keep the site static and lightweight.
- Do not add frameworks or heavy dependencies.
- Optimize logo and image usage where possible.
- Avoid huge assets for tiny UI.
- Use lazy loading where appropriate.
- Use `fetchpriority` only for critical hero images.
- Use `decoding="async"` where useful.
- Define image width/height where possible.
- Avoid excessive `backdrop-filter`.
- Avoid heavy infinite animations and scroll jank.
- Remove unused CSS/JS after the redesign.

## Validation Commands
Run from the project root:
```bash
python -m http.server 5173
python scripts/validate_shush_static.py
```

For final redesign enforcement:
```bash
python scripts/validate_shush_static.py --final
```

## Definition Of Done
For each future stage:
- stage scope is respected
- required files/pages work
- roster filters still work
- Drop 01 manual request still works
- no fake information is introduced
- empty avatars state is handled
- mobile has no horizontal scroll
- focus and keyboard behavior work
- validation has been run or clearly explained
- manual checks still needed are listed

## Reporting Format
Return:
1. Files changed
2. What changed
3. What was intentionally not changed
4. Risks/limitations
5. Validation performed
6. Manual checks still needed
