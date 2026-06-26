# SHUSH Release Notes

Release baseline: `64c546c final qa performance cleanup`

## Included Pages
- `index.html` - Home
- `roster.html` - Roster
- `drop01.html` - Drop 01
- `about.html` - About
- `callroom.html` - legacy redirect/fallback to About

## Current Site State
- SHUSH is presented as a small gamer micro-org with dark premium visual direction.
- Roster renders 8 players in entry order: Tiago, Delcio, Tomas, Lyel, Tz, Lei, Craquinho, Catarina.
- Delcio is Flex.
- Tiago has a subtle IGL badge.
- Drop 01 is a manual interest/message flow only.
- Backora remains the technical/digital partner.

## Assets
- Five real roster avatars use optimized WebP files in the live site.
- PNG avatar files remain in the source tree as masters.
- Tiago, Lei and Craquinho still use intentional placeholder states until real photos exist.

## Release Notes
- No fake checkout, price, payment or stock flow is present.
- No fake sponsor, trophy, ranking, scale or org-history claims are present.
- The known validator warning for `callroom.html` is intentional because the file is kept as a redirect/fallback.

## Validation
- `scripts/validate_shush_static.py` passes with 0 errors and 1 intentional warning.
- `scripts/validate_shush_static.py --final` passes with 0 errors and 1 intentional warning.
