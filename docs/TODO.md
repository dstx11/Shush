# SHUSH TODO

Do not complete these tasks in Stage 0. Use this as the staged work queue.

## Structure
- [x] Create `about.html`
- [x] Replace the legacy public room nav item with About
- [x] Keep `callroom.html` as a redirect/fallback for now
- [ ] Keep final pages to Home, Roster, Drop 01 and About

## Design
- [x] Rebuild Home hero around jersey showcase
- [ ] Improve section spacing and hierarchy
- [ ] Make glass surfaces darker and more premium
- [ ] Reduce generic card feel
- [ ] Improve visual rhythm across pages

## Copy
- [x] Remove visible old room copy from public pages
- [x] Remove old mode language
- [x] Remove meme-heavy/roast player copy from roster
- [ ] Rewrite Home identity copy
- [x] Rewrite roster copy in professional gamer tone
- [x] Rewrite Drop 01 copy as honest launch/concept language
- [ ] Write concise About copy

## Roster
- [x] Preserve filters
- [x] Remove old mode data/property
- [x] Remove old mode badge
- [x] Keep player identities unchanged
- [x] Improve roster page hero
- [x] Improve card hierarchy
- [x] Improve filter controls
- [x] Improve avatar placeholder visual quality
- [x] Avoid fake stats and fake achievements

## Avatars
- [x] Make roster fallback-first
- [x] Remove hardcoded missing image paths
- [x] Use initials/placeholders when photos are absent
- [x] Ensure no broken image icons with empty `assets/avatars/`
- [x] Make future photo replacement simple
- [x] Integrate first five real roster avatars
- [ ] Generate optimized WebP avatar files when a local converter is available

## Drop 01
- [x] Improve jersey presentation
- [x] Preserve manual request form
- [x] Add/confirm useful field names
- [x] Add `aria-live` to generated output
- [x] Improve copy button feedback
- [x] Avoid fake checkout, stock or production claims

## About
- [ ] Explain what SHUSH is
- [ ] Explain identity and direction
- [ ] Mention Drop 01 honestly
- [ ] Integrate Backora credibly
- [ ] Mention static/technical care without sounding corporate

## Navigation
- [x] Add `aria-controls` to mobile menu button
- [x] Ensure Escape closes mobile menu
- [x] Ensure link click closes mobile menu
- [x] Create dark Liquid Glass-inspired desktop nav
- [x] Create premium mobile nav panel
- [x] Ensure active nav states work everywhere

## Performance
- [x] Review Home hero image dimensions/loading
- [ ] Avoid excessive blur
- [ ] Remove old unused CSS/JS after redesign
- [ ] Keep animations transform/opacity based
- [ ] Review global pointer/scroll listeners

## Accessibility
- [ ] Confirm `lang="pt-PT"`
- [ ] Confirm semantic nav and `aria-label`
- [ ] Confirm `aria-current`
- [ ] Confirm focus-visible
- [ ] Confirm reduced motion
- [ ] Confirm form labels/names
- [ ] Confirm meaningful/decorative image alt text

## Cleanup
- [ ] Remove unused old room CSS after replacement
- [x] Remove old mode CSS after replacement
- [ ] Remove unused JS after page cleanup
- [ ] Update README after final structure changes

## QA
- [ ] Run local server
- [ ] Run validation
- [ ] Open all final pages
- [ ] Test mobile widths
- [ ] Test roster filters
- [x] Test Drop 01 form/copy
- [ ] Check no broken images
- [ ] Check no horizontal scroll
