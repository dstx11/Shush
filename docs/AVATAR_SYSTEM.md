# SHUSH Avatar System

## Current State
`assets/avatars/` now contains five real PNG source/master avatar files:
- `delcio.png`
- `tomas.png`
- `catarina.png`
- `lyel.png`
- `tz.png`

The live roster uses optimized WebP copies generated from those masters:
- `delcio.webp`
- `tomas.webp`
- `catarina.webp`
- `lyel.webp`
- `tz.webp`

Tiago, Lei and Craquinho still use fallback placeholders until real files are added.

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
- `lei.webp`
- `craquinho.webp`
- `catarina.webp`

## Implementation Notes
Stage 2 switched the roster to fallback-first rendering. The roster now mixes real local avatars with placeholder-only players.

Current real avatar paths in player data:
- `assets/avatars/delcio.webp`
- `assets/avatars/tomas.webp`
- `assets/avatars/tz.webp`
- `assets/avatars/lyel.webp`
- `assets/avatars/catarina.webp`

The PNG files remain source/master assets. The WebP files are the optimized web delivery format.

Current/final expected behavior:
- no `<img>` tag is created unless the file exists in the project or is explicitly assigned after upload
- placeholders occupy the same space as photos
- real images can replace placeholders by adding files and updating data
- if a future assigned image fails to load, the fallback can still appear instead of a broken image icon
