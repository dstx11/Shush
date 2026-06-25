# SHUSH Redesign Specification

## Final direction
SHUSH should become a premium micro-org gamer experience.

Small, but intentional. Dark, but readable. Gamer, but sophisticated. Interactive, but lightweight. Professional, but not corporate. Confident, but not fake.

## Final pages
- Home (`index.html`)
- Roster (`roster.html`)
- Drop 01 (`drop01.html`)
- About (`about.html`)

## Remove
- Call Room as a concept
- `callroom.html` as the main page
- Troll Mode
- troll-specific badges/classes/copy
- meme-heavy writing
- fake esports grandeur

## Home
The Home page is the brand entry point.

Must include:
- dark Liquid Glass-inspired nav
- strong hero
- jersey as centerpiece
- primary CTA to Drop 01
- secondary CTA to Roster
- short identity section
- roster teaser
- Drop 01 teaser
- Backora integration

The hero must not feel like a card with an image dropped inside. The jersey should feel like a showcase object with spotlight, depth, shadow/pedestal and subtle interactivity.

## Roster
The Roster page must feel premium and professional.

Keep personality, remove meme energy.

Required:
- clean roster hero
- filters preserved
- cards aligned
- graceful avatar fallback/initials
- no broken images when avatars are missing
- no Troll Mode
- no insulting/roast copy

## Drop 01
Drop 01 should feel like a launch/concept page, not a simple form.

Required:
- stronger page hero
- jersey presentation
- honest product/concept language
- manual request form preserved
- generated message preserved
- copy button preserved
- `aria-live` for output
- no fake shop claims

## About
About replaces Call Room.

Should explain:
- what SHUSH is
- identity
- Drop 01
- Backora
- technical care
- performance/accessibility/static approach

Tone:
- professional
- human
- concise
- credible
- not corporate fake
- not meme-heavy

## Header/Nav
Inspired by dark Liquid Glass, adapted to SHUSH.

Desktop:
- logo left
- capsule nav centered
- Drop 01 CTA right
- active link as pill/liquid indicator
- subtle hover
- scroll state

Mobile:
- premium glass dropdown or side panel
- readable links
- active state
- CTA highlighted
- `aria-expanded`
- `aria-controls`
- Escape closes
- click link closes

## Text and alignment
Critical priority.

No text overlap. No random floating text. No cramped headings. No over-wide paragraphs. No disconnected CTAs. No mobile squeezing.

Use controlled max-widths, balanced headings where useful, responsive typography and a consistent spacing scale.

## Performance
Use static, lightweight implementation.

Prefer transform/opacity animation. Avoid layout-heavy animation. Review image sizes. Add image dimensions where useful. Use fetchpriority only for critical hero image. Use decoding async when useful. Avoid excessive blur and will-change.

## Avatar strategy
The avatar folder may be empty.

Roster should render with CSS initials/placeholders first and optionally upgrade if images are later added.

Do not create fake photos.
Do not use remote placeholder images.
Do not leave broken image icons.
