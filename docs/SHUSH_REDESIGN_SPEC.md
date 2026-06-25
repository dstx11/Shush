# SHUSH Redesign Specification

This document defines the destination for the SHUSH redesign. It is not a request to implement everything at once.

## Final Direction
SHUSH is a small premium gamer micro-org/team with a strong visual identity.

The site should feel:
- dark, polished and immersive
- gamer, but not childish
- technical and credible
- professional, but not corporate
- spacious, aligned and smooth
- honest about scale

Core sentence:
> Sem barulho. Só rounds.

SHUSH should not look like a fake giant esports organization. The strongest version is smaller, sharper and more intentional.

## Final Site Structure
- `index.html` - Home
- `roster.html` - Roster
- `drop01.html` - Drop 01
- `about.html` - About

Legacy status after Stage 2:
- `about.html` is the visible About page
- `callroom.html` may remain only as a redirect/fallback
- roster uses fallback-first avatars with no missing image paths

## Home Direction
Goal: make the Home page the strongest brand entry.

Must include:
- premium dark header/nav
- strong hero around the jersey
- primary CTA to Drop 01
- secondary CTA to Roster
- short identity section
- roster preview
- Drop 01 teaser
- credible Backora partner integration

The jersey should feel like an object on display, not an image placed inside a generic card. Use depth, spotlight, shadow/pedestal and subtle pointer interaction only after the layout is solid.

## Roster Direction
Goal: professional team page with controlled personality.

Keep:
- filters by role
- player identities
- static data-driven rendering

Remove:
- old player-mode labels
- roast copy
- broken/missing avatar images
- fake competitive stats

Roster cards should work with no avatar files. Initials/placeholders must feel intentional and should later upgrade cleanly to real photos.

## Drop 01 Direction
Goal: launch/concept page for the first SHUSH jersey.

Keep:
- manual request flow
- generated message
- copy button

Improve:
- page hero
- jersey showcase
- product/concept storytelling
- form layout
- `aria-live` output feedback

Do not fake stock, checkout, production details or availability.

## About Direction
Goal: credible page that replaces Call Room.

Explain:
- what SHUSH is
- why it exists
- visual identity
- Drop 01
- Backora partnership
- technical/static website care

Tone: concise, human, professional, premium and honest.

## Backora Integration
Backora is the technical/digital partner. It should feel integrated and credible, not like a fake sponsor tile.

Use Backora in:
- footer
- Home partner section
- Drop 01 jersey context
- About technical/digital partner section

Avoid sponsor grids or claims beyond the current relationship.

## Header/Nav Direction
Desktop:
- logo left
- centered capsule nav
- Drop 01 CTA right
- clear active page state
- subtle scroll state
- dark Liquid Glass-inspired surface

Mobile:
- premium glass dropdown/panel
- readable tap targets
- active state
- CTA highlighted
- `aria-expanded`
- `aria-controls`
- Escape closes
- link click closes

Use normal site navigation semantics. Do not use `role="menu"` for basic page nav.

## Layout And Text
Alignment and hierarchy are the first design priorities.

Rules:
- no text overlap
- no random floating copy
- no over-wide paragraphs
- no disconnected CTAs
- no cramped headings
- no mobile squeezing
- use controlled max widths
- use consistent spacing scale
- balance headings when useful

## Visual Direction
Use:
- dark theme
- cold purple/blue
- clean typography
- strong spacing
- controlled glow
- premium glass surfaces
- jersey showcase
- smooth lightweight motion

Avoid:
- fake esports grandeur
- childish meme identity
- overdone particles
- constant glitch
- excessive blur
- generic AI landing-page sections
- visual chaos

## Motion Direction
Layout first, motion second.

Prefer:
- transform
- opacity
- subtle pointer interaction
- reveal transitions with restraint

Avoid:
- animating layout properties
- heavy filters in loops
- constant expensive blur
- noisy particles/glitch overload

Always respect `prefers-reduced-motion`.

## Known Current Risks
- `callroom.html` remains as a fallback file and should not return as a visible nav page.
- Drop 01 output still needs `aria-live` in a later stage.
- Home copy still has older tone and should be refined in its own stage.
- Some existing documents had encoding artifacts; future copy should be saved as UTF-8.
