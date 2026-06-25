# SHUSH QA Checklist

Use this checklist before accepting redesign-stage changes.

## Commands
- [ ] `python -m http.server 5173` starts successfully
- [ ] `python scripts/validate_shush_static.py` runs
- [ ] `python scripts/validate_shush_static.py --final` passes during final QA

## Pages
- [ ] `index.html` opens
- [ ] `roster.html` opens
- [ ] `drop01.html` opens
- [ ] `about.html` opens after Stage 1
- [ ] no primary nav link points to `callroom.html` after Stage 1
- [ ] no visible "Call Room" text remains after Stage 1
- [ ] no visible "Troll Mode" text remains after Stage 2

## Navigation
- [ ] all nav links work
- [ ] active nav link works on every page
- [ ] desktop nav is aligned
- [ ] mobile menu opens
- [ ] mobile menu closes
- [ ] Escape closes mobile menu
- [ ] clicking a mobile nav link closes the menu
- [ ] mobile nav has no text overlap
- [ ] mobile menu button has `aria-expanded`
- [ ] mobile menu button has `aria-controls`

## Home
- [ ] hero uses space well
- [ ] jersey is the visual centerpiece
- [ ] jersey feels like showcase/exhibition
- [ ] CTAs are aligned
- [ ] headline breaks well
- [ ] no text overlaps jersey
- [ ] Backora appears credibly

## Roster
- [ ] roster renders when `assets/avatars/` is empty
- [ ] no broken image icons appear
- [ ] initials/placeholders look intentional
- [ ] real image state works when images are added
- [ ] filters work
- [ ] cards stay aligned after filtering
- [ ] copy sounds professional
- [ ] no troll/meme-heavy labels remain

## Drop 01
- [ ] page feels like a launch/concept page
- [ ] manual order form works
- [ ] generated message works
- [ ] copy button works
- [ ] output has accessible live feedback
- [ ] no fake checkout/stock claims

## About
- [ ] About replaces Call Room
- [ ] About explains SHUSH clearly
- [ ] Backora is integrated credibly
- [ ] no fake claims
- [ ] copy is concise and human

## Mobile
- [ ] 360px has no horizontal scroll
- [ ] 375px has no horizontal scroll
- [ ] 390px has no horizontal scroll
- [ ] 430px has no horizontal scroll
- [ ] Home is readable
- [ ] Roster is readable
- [ ] Drop 01 is readable
- [ ] About is readable
- [ ] no text overlap

## Accessibility
- [ ] `lang="pt-PT"` is present
- [ ] semantic `<nav>` is present
- [ ] nav has `aria-label`
- [ ] active links use `aria-current="page"`
- [ ] focus-visible states are clear
- [ ] `prefers-reduced-motion` exists
- [ ] Drop 01 output uses `aria-live`
- [ ] inputs have labels and useful names
- [ ] important images have meaningful alt text
- [ ] decorative images have empty alt text
- [ ] keyboard navigation works

## Performance
- [ ] no frameworks or heavy dependencies added
- [ ] no excessive blur everywhere
- [ ] main animations use transform/opacity
- [ ] critical hero image has useful loading hints
- [ ] important images have width/height where possible
- [ ] no huge images used for tiny UI if avoidable
- [ ] no console errors
- [ ] no scroll jank

## Content Integrity
- [ ] no fake sponsors
- [ ] no fake achievements
- [ ] no fake rankings
- [ ] no fake match history
- [ ] no fake organization history
- [ ] Backora wording stays credible
