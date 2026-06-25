# SHUSH Implementation Notes

## Current Project Snapshot
Current visible pages:
- `index.html`
- `roster.html`
- `drop01.html`
- `about.html`

Final visible pages:
- `index.html`
- `roster.html`
- `drop01.html`
- `about.html`

Current core files:
- `styles.css`
- `script.js`
- `assets/`
- `scripts/validate_shush_static.py`

## Existing Features To Preserve
- static site architecture
- mobile menu with Escape/link-close behavior
- scroll progress
- reveal effects
- roster rendering from JS data
- roster filters
- Drop 01 generated message
- Drop 01 copy button
- Backora footer presence
- reduced-motion baseline
- Home hero jersey showcase using `assets/jersey-hero.webp`

## Current Known Issues
- `callroom.html` remains only as a redirect/fallback.
- Some text has encoding artifacts in existing files.
- `assets/avatars/` is intentionally empty.
- Drop 01 output does not yet document `aria-live` in the markup.
- Roster currently uses fallback initials/placeholders until real player photos are added.
- Header/nav has been redesigned into a dark glass component; future header work should be incremental cleanup, not a restart.
- Home hero now centers Drop 01 as the visual entry point. Further Home page copy/section cleanup remains later-stage work.

## Editing Guidance
Stage work should be incremental:
1. Replace structure/concepts.
2. Fix avatar dependency.
3. Improve nav.
4. Rebuild page sections.
5. Add motion only after layout is stable.
6. Clean performance/accessibility.

Avoid broad rewrites until the relevant stage requires them.

## Validation Script Modes
`python scripts/validate_shush_static.py` is for current-stage safety. It reports warnings for unfinished redesign work.

`python scripts/validate_shush_static.py --final` is for final redesign enforcement. It should fail if final pages/concepts are missing or legacy visible terms remain.
