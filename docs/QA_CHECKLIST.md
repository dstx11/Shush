# SHUSH QA Checklist

Use this before accepting Codex changes.

## Pages
- [ ] `index.html` opens
- [ ] `roster.html` opens
- [ ] `drop01.html` opens
- [ ] `about.html` opens
- [ ] No primary nav link points to `callroom.html`
- [ ] No visible “Call Room” text remains
- [ ] No visible “Troll Mode” text remains

## Navigation
- [ ] Active nav link works on every page
- [ ] Desktop nav is aligned
- [ ] Mobile menu opens
- [ ] Mobile menu closes
- [ ] Escape closes mobile menu
- [ ] Click link closes mobile menu
- [ ] Mobile nav has no text overlap

## Home
- [ ] Hero uses more space
- [ ] Jersey is the visual centerpiece
- [ ] Jersey feels like showcase/exhibition
- [ ] CTAs are aligned
- [ ] Headline breaks well
- [ ] No text overlaps jersey

## Roster
- [ ] Roster renders when `assets/avatars/` is empty
- [ ] No broken image icons appear
- [ ] Initials/placeholders look intentional
- [ ] Filters work
- [ ] Copy sounds professional
- [ ] No troll/meme-heavy player labels remain

## Drop 01
- [ ] Manual order form works
- [ ] Generated message works
- [ ] Copy button works
- [ ] Output has accessible live feedback
- [ ] Page feels like a launch/concept page

## About
- [ ] About replaces Call Room
- [ ] About explains SHUSH clearly
- [ ] Backora is integrated credibly
- [ ] No fake claims
- [ ] Copy is concise and human

## Mobile
- [ ] 360px no horizontal scroll
- [ ] 375px no horizontal scroll
- [ ] 390px no horizontal scroll
- [ ] 430px no horizontal scroll
- [ ] Hero readable
- [ ] Roster readable
- [ ] Drop 01 readable
- [ ] About readable

## Accessibility
- [ ] `lang="pt-PT"`
- [ ] semantic nav
- [ ] `aria-current` active links
- [ ] mobile menu has `aria-expanded`
- [ ] mobile menu has `aria-controls`
- [ ] focus-visible states visible
- [ ] `prefers-reduced-motion` exists
- [ ] inputs have labels/names
- [ ] important images have meaningful alt
- [ ] decorative images have empty alt

## Performance
- [ ] No heavy dependencies added
- [ ] No excessive blur everywhere
- [ ] Main animations use transform/opacity
- [ ] Critical hero image has useful loading hints
- [ ] No huge images used for tiny UI if avoidable

## Commands
Run:
```bash
python -m http.server 5173
python scripts/validate_shush_static.py
```
