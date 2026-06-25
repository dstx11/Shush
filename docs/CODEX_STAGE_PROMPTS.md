# Codex Stage Prompts

Use one stage at a time. Do not ask Codex to do all stages at once unless you are ready to review a large diff.

---

## Stage 1 — Call Room → About

Implement Stage 1 only.

Goal:
Replace Call Room with About across the project.

Do:
- create/rename `about.html`
- update nav links in every page
- update `aria-current`
- update titles and meta descriptions
- remove Call Room copy
- remove Call Room references from README
- keep site functional

Do not:
- redesign the hero yet
- redesign roster yet
- add new animations yet

Done when:
- no visible nav says Call Room
- `about.html` exists and works
- all nav links work
- no broken internal links
- report changed files

---

## Stage 2 — Remove Troll Mode and avatar dependency

Implement Stage 2 only.

Goal:
Remove Troll Mode and make roster work without avatar images.

Do:
- remove troll property from player data
- remove Troll Mode badge
- remove troll-specific CSS if unused
- rewrite player copy in a more premium/professional tone
- implement clean initials/placeholders for missing avatars
- ensure no broken image icons if `assets/avatars` is empty
- preserve roster filters
- preserve roster rendering

Do not:
- redesign the full roster layout yet
- touch Drop 01

Done when:
- no Troll Mode text remains
- roster renders with empty avatar folder
- filters still work
- copy sounds more professional

---

## Stage 3 — Header/Nav Liquid Glass

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
- mobile menu becomes a premium glass dropdown/panel
- no `role="menu"` for normal site navigation
- keep links readable
- keep contrast high
- avoid excessive blur

Do not:
- redesign Home hero yet
- change roster data beyond what Stage 2 already did
- add heavy animations

Done when:
- nav works on all pages
- active link is correct on each page
- mobile menu opens/closes
- Escape closes mobile menu
- no content is hidden awkwardly by header

---

## Stage 4 — Home Hero + Jersey Showcase

Implement Stage 4 only.

Goal:
Rebuild the Home hero around the jersey as a premium showcase.

Do:
- use wider layout for the Home hero
- make the jersey central/dominant
- remove the feeling of “image inside a basic card”
- add spotlight, depth, shadow/pedestal and subtle labels
- improve headline hierarchy
- reduce text clutter
- add CTA to Drop 01 and secondary CTA to Roster
- add pseudo-3D interaction with pointer movement if safe
- keep mobile clean
- avoid text overlap
- avoid horizontal scroll

Technical:
- prefer transform and opacity
- respect prefers-reduced-motion
- reduce motion on mobile
- do not add dependencies

Done when:
- hero uses space better
- jersey feels like showcase/exhibition
- headline and CTA alignment are clean
- mobile hero is readable
- no text overlaps

---

## Stage 5 — Roster Redesign

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
- roster feels more like a premium team page
- filters still work
- cards are aligned
- mobile is clean
- no Troll Mode remains

---

## Stage 6 — Drop 01

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

---

## Stage 7 — About Page

Implement Stage 7 only.

Goal:
Create the final About page.

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
1. About SHUSH
2. O que é a SHUSH
3. Identidade
4. Built with Backora
5. Como o site foi construído
6. CTA to Drop 01 and Roster

Done when:
- About feels credible
- Backora is integrated professionally
- copy is not generic
- mobile layout works

---

## Stage 8 — Performance, Accessibility and Cleanup

Implement Stage 8 only.

Goal:
Final technical cleanup.

Do:
- optimize logo usage if possible
- add width/height to important images
- add fetchpriority/high only to critical hero images
- add decoding async where useful
- review lazy loading
- review aria labels
- review focus-visible
- review prefers-reduced-motion
- remove unused CSS from Call Room/Troll Mode
- remove unused JS
- avoid excessive will-change
- move cursor glow to transform if currently using top/left
- confirm no horizontal scroll
- run `python scripts/validate_shush_static.py`

Done when:
- no obvious unused old code
- accessibility basics are improved
- performance risks are reduced
- site still works
