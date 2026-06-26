# Avatar Assets

This folder now contains the first real roster avatar source files.

Available PNG source/master files:
- `delcio.png`
- `tomas.png`
- `catarina.png`
- `lyel.png`
- `tz.png`

Players without a real file still use the roster initials/placeholder fallback.

Available optimized WebP files used by the website:
- `delcio.webp`
- `tomas.webp`
- `catarina.webp`
- `lyel.webp`
- `tz.webp`

## Rules
- Do not generate fake player photos.
- Do not download placeholder images.
- Do not use remote placeholder images.
- Do not change player identities.
- Do not reference missing avatar files without a fallback.
- Do not leave broken image icons.

## Required Roster Behavior
The roster must render cleanly when a player has no image file.

Use:
- initials
- clean CSS placeholder
- gradient/silhouette treatment
- stable avatar dimensions

When more real photos are added later, replacing placeholders should be simple and should not require layout changes.

## Optimization
The PNG files are source/master assets. The live roster uses optimized WebP copies generated locally at 768x768.

## Suggested Future Filenames
Only use these paths in player data when the files actually exist:
- `delcio.webp`
- `tiago.webp`
- `tomas.webp`
- `tz.webp`
- `lyel.webp`
- `levi.webp`
- `craquinho.webp`
- `catarina.webp`
