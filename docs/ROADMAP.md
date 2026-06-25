# SHUSH Redesign Roadmap

## Stage 0 - Project Preparation And Documentation
Goal: create support docs and guardrails without changing the visible website.

Files likely to change:
- `AGENTS.md`
- `docs/*`
- `assets/avatars/README.md`
- `scripts/validate_shush_static.py`

Constraints:
- no redesign
- no page rename
- no Call Room removal
- no Troll Mode removal
- no fake avatars

Risks:
- docs may drift if future stages skip updating them

Validation:
- read docs
- run `python scripts/validate_shush_static.py`

Done:
- future stages have clear instructions, roadmap and QA checklist

## Stage 1 - Call Room To About
Goal: replace Call Room with About.

Files likely to change:
- `about.html`
- `callroom.html`
- all page nav blocks
- README/support docs if user-facing

Constraints:
- do not redesign full site yet
- do not remove unrelated roster behavior

Risks:
- broken nav links
- wrong active states
- stale Call Room references

Validation:
- open all pages
- run validation
- check nav active states

Done:
- About exists and visible Call Room references are gone

## Stage 2 - Remove Troll Mode And Avatar Dependency
Goal: professionalize roster data/copy and make avatars fallback-first.

Files likely to change:
- `script.js`
- `styles.css`
- `roster.html`
- `assets/avatars/README.md`

Constraints:
- preserve filters
- keep player identities
- no fake photos

Risks:
- filters breaking
- missing image icons
- card layout shift

Validation:
- roster renders with empty avatars folder
- filters work
- no broken image icons

Done:
- no Troll Mode remains and roster works without photos

## Stage 3 - Header/Nav Liquid Glass Redesign
Goal: create premium dark navigation.

Files likely to change:
- all HTML headers
- `styles.css`
- `script.js`

Constraints:
- semantic nav
- no heavy dependencies
- keep mobile usable

Risks:
- header covering content
- mobile menu keyboard gaps

Validation:
- desktop and mobile nav
- Escape closes
- active link correct

Done:
- nav feels premium and works everywhere

## Stage 4 - Home Hero And Jersey Showcase
Goal: rebuild Home around the jersey.

Files likely to change:
- `index.html`
- `styles.css`
- `script.js`

Constraints:
- no fake claims
- motion after layout
- mobile first pass required

Risks:
- text overlap
- jersey too small
- heavy motion

Validation:
- desktop/mobile screenshots
- no horizontal scroll
- reduced motion

Done:
- jersey is the Home centerpiece

## Stage 5 - Roster Redesign
Goal: make roster polished and professional.

Files likely to change:
- `roster.html`
- `script.js`
- `styles.css`

Constraints:
- filters preserved
- fallback avatars preserved
- no fake stats

Risks:
- crowded cards
- too much personality in copy

Validation:
- filters
- empty avatar state
- mobile layout

Done:
- roster feels like a premium team page

## Stage 6 - Drop 01 Redesign
Goal: make Drop 01 a launch/concept page.

Files likely to change:
- `drop01.html`
- `styles.css`
- `script.js`

Constraints:
- manual request only
- no fake shop/stock claims
- keep generated message/copy button

Risks:
- form regression
- unclear manual flow

Validation:
- form works
- output updates
- copy button works
- `aria-live`

Done:
- Drop 01 feels intentional and functional

## Stage 7 - About Page Build
Goal: create credible About page.

Files likely to change:
- `about.html`
- `styles.css`

Constraints:
- no fake history
- no corporate filler
- Backora integrated credibly

Risks:
- generic copy
- too much explanation

Validation:
- copy review
- mobile layout
- nav active state

Done:
- About clearly explains SHUSH and Backora

## Stage 8 - Motion And Microinteractions
Goal: refine motion after layout is stable.

Files likely to change:
- `styles.css`
- `script.js`

Constraints:
- transform/opacity
- reduced motion
- no heavy loops

Risks:
- jank
- noisy site feel

Validation:
- reduced motion
- mobile smoothness
- console check

Done:
- site feels smooth without becoming loud

## Stage 9 - Performance, Accessibility And Cleanup
Goal: remove old code and reduce risk.

Files likely to change:
- `styles.css`
- `script.js`
- all HTML pages
- assets if explicitly needed

Constraints:
- no feature regressions
- no dependency additions

Risks:
- deleting still-used selectors
- over-optimizing

Validation:
- validation script
- manual QA
- console check

Done:
- old Call Room/Troll Mode code removed and basics are clean

## Stage 10 - Final QA
Goal: verify the full site.

Files likely to change:
- only small fixes from QA

Constraints:
- do not introduce redesign churn

Risks:
- missed mobile width
- stale docs

Validation:
- full QA checklist
- `python scripts/validate_shush_static.py --final`

Done:
- checklist complete and risks reported
