# Codex Stage Prompts

Use one stage at a time. Do not ask Codex to redesign everything in one pass unless you are ready to review a large diff.

## Stage 0 - Project Preparation And Documentation

Use this only if the support docs need to be regenerated.

Goal:
Prepare the project for future redesign work without changing the visible website.

Do:
- read the whole project first
- update AGENTS.md
- update docs
- document avatar strategy
- document roadmap and QA
- update lightweight validation if needed

Do not:
- redesign pages
- rename `callroom.html`
- remove Call Room
- remove Troll Mode
- rewrite main CSS/JS
- create fake avatars

Done when:
- support docs are clear
- empty avatars state is documented
- future stages are safer
- site behavior is intentionally unchanged

## Stage 1 - Call Room To About

Implement Stage 1 only.

Goal:
Replace Call Room with About across the project.

Do:
- create `about.html`
- update nav links in every page
- update `aria-current`
- update titles and meta descriptions
- remove visible Call Room copy
- remove Call Room references from user-facing docs where relevant
- keep site functional

Do not:
- redesign the Home hero yet
- redesign roster yet
- add new animations yet
- remove Troll Mode unless required by About copy

Done when:
- no visible nav says Call Room
- `about.html` exists and works
- all nav links work
- no broken internal links
- report changed files

## Stage 2 - Remove Troll Mode And Avatar Dependency

Implement Stage 2 only.

Goal:
Remove Troll Mode and make roster work without avatar images.

Do:
- remove troll property from player data
- remove Troll Mode badge
- remove troll-specific CSS if unused
- rewrite player copy in a premium/professional tone
- implement clean initials/placeholders for missing avatars
- ensure no broken image icons if `assets/avatars/` is empty
- preserve roster filters
- preserve roster rendering

Do not:
- redesign the full roster layout yet
- touch Drop 01 beyond shared nav/footer needs

Done when:
- no Troll Mode text remains
- roster renders with empty avatar folder
- filters still work
- copy sounds more professional

## Stage 3 - Header/Nav Liquid Glass

Implement Stage 3 only.

Goal:
Redesign the header/nav into a premium dark Liquid Glass-inspired navigation.

Do:
- keep nav semantic
- use `nav aria-label`
- add `aria-controls` to mobile menu button
- keep `aria-expanded` working
- Escape closes menu
- active page is visually obvious
- desktop nav uses capsule/pill layout
- logo left, links centered, Drop 01 CTA right
- mobile menu becomes premium glass dropdown/panel
- no `role="menu"` for normal site navigation
- keep links readable
- keep contrast high
- avoid excessive blur

Do not:
- redesign Home hero yet
- change roster data beyond Stage 2
- add heavy animations

Done when:
- nav works on all pages
- active link is correct on each page
- mobile menu opens/closes
- Escape closes mobile menu
- no content is hidden awkwardly by header

## Stage 4 - Home Hero And Jersey Showcase

Implement Stage 4 only.

Goal:
Rebuild the Home hero around the jersey as a premium showcase.

Do:
- use wider layout for the Home hero
- make jersey central/dominant
- remove the feeling of "image inside a basic card"
- add spotlight, depth, shadow/pedestal and subtle labels
- improve headline hierarchy
- reduce text clutter
- add CTA to Drop 01 and secondary CTA to Roster
- add pseudo-3D pointer interaction only if safe
- keep mobile clean
- avoid text overlap
- avoid horizontal scroll

Technical:
- prefer transform and opacity
- respect `prefers-reduced-motion`
- reduce motion on mobile
- do not add dependencies

Done when:
- hero uses space better
- jersey feels like showcase/exhibition
- headline and CTA alignment are clean
- mobile hero is readable
- no text overlaps

## Stage 5 - Roster Redesign

Implement Stage 5 only.

Goal:
Make the Roster page more premium, structured and professional.

Do:
- improve roster page hero
- improve card layout and hierarchy
- keep filters functional
- make cards less generic
- keep player personality controlled and professional
- add subtle hover/microinteractions
- improve mobile spacing
- avoid meme copy
- avoid fake competitive stats
- keep avatar fallback working

Done when:
- roster feels like a premium team page
- filters still work
- cards are aligned
- mobile is clean
- no Troll Mode remains

## Stage 6 - Drop 01

Implement Stage 6 only.

Goal:
Make Drop 01 feel like a real jersey launch/concept page.

Do:
- improve page hero
- improve jersey presentation
- improve product/storytelling sections
- improve form layout
- add `aria-live` to output
- add input names where useful
- improve copy button feedback
- keep manual order functionality
- do not invent materials, availability or production claims

Done when:
- Drop 01 feels like a launch page
- form still works
- generated message still works
- copy button still works
- mobile is clean

## Stage 7 - About Page Build

Implement Stage 7 only.

Goal:
Create the final About page content and layout.

Content direction:
- what SHUSH is
- identity
- Drop 01
- Backora
- technical care
- performance/accessibility/static site approach

Tone:
- professional
- concise
- premium
- human
- no fake grandeur
- no Call Room
- no meme-heavy copy

Possible sections:
- About SHUSH
- O que é a SHUSH
- Identidade
- Built with Backora
- Como o site foi construído
- CTA to Drop 01 and Roster

Done when:
- About feels credible
- Backora is integrated professionally
- copy is not generic
- mobile layout works

## Stage 8 - Motion And Microinteractions

Implement Stage 8 only.

Goal:
Make the site feel smooth and immersive without becoming noisy.

Do:
- audit all current animation first
- keep transform/opacity animations
- reduce layout-heavy animation
- refine hover/focus states
- simplify mobile motion
- confirm `prefers-reduced-motion`

Do not:
- add heavy particle systems
- add constant glitch
- add expensive filters in loops

Done when:
- motion supports the layout
- mobile remains smooth
- reduced motion is respected

## Stage 9 - Performance, Accessibility And Cleanup

Implement Stage 9 only.

Goal:
Final technical cleanup.

Do:
- optimize logo usage if possible
- add width/height to important images
- add `fetchpriority` only to critical hero images
- add `decoding="async"` where useful
- review lazy loading
- review aria labels
- review focus-visible
- review `prefers-reduced-motion`
- remove unused CSS from Call Room/Troll Mode
- remove unused JS
- avoid excessive `will-change`
- move cursor glow to transform if currently using top/left
- confirm no horizontal scroll
- run validation

Done when:
- no obvious unused old code
- accessibility basics are improved
- performance risks are reduced
- site still works

## Stage 10 - Final QA

Implement Stage 10 only.

Goal:
Verify the whole site end to end.

Do:
- run `python scripts/validate_shush_static.py --final`
- open all pages
- test nav and active states
- test mobile menu and Escape
- test roster with empty `assets/avatars/`
- test roster filters
- test Drop 01 form, generated message and copy button
- inspect 360/375/390/430 mobile widths
- check for no horizontal scroll
- check for no text overlap
- check for no console errors

Done when:
- QA checklist is complete
- remaining risks are documented
