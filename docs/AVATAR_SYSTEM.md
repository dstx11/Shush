# SHUSH Avatar System

## Current State
`assets/avatars/` is intentionally empty except support files. Real player photos will be added later.

This is not an error.

## Required Roster States
The roster must support:
1. Real image available.
2. Player exists but image is missing.
3. No image assigned yet.

## Required Fallback
If no real image is available, render an intentional placeholder:
- player initials
- clean gradient or silhouette
- consistent dimensions
- no broken image icon
- no layout shift
- no external image dependency

## Data Strategy
Recommended:
- player data includes `image` only when the local file exists
- player data includes `initials` for fallback
- rendering code chooses an image component only when `image` is present
- otherwise it renders a placeholder component

Avoid:
- hardcoded paths to files that are not present
- hidden broken images
- remote placeholder images
- generated fake portraits
- changing player identities

## Suggested Future Filenames
When real photos are added, use predictable local filenames:
- `delcio.webp`
- `tiago.webp`
- `tomas.webp`
- `tz.webp`
- `lyel.webp`
- `levi.webp`
- `craquinho.webp`
- `catarina.webp`

## Implementation Notes
Stage 2 switched the roster to fallback-first rendering. Current player data uses initials and does not reference missing avatar files.

Current/final expected behavior:
- no `<img>` tag is created unless the file exists in the project or is explicitly assigned after upload
- placeholders occupy the same space as photos
- real images can replace placeholders by adding files and updating data
- if a future assigned image fails to load, the fallback can still appear instead of a broken image icon
