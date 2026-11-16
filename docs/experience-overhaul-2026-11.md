# SHUSH experience overhaul — 16 November 2026

Base: master 6c3a3b4. Preserve the existing Vite/React/Router stack, real portraits,
verified match data, seasonal calendar, one Canvas Christmas tree and local-only studio.

## Confirmed audit and acceptance matrix

| Priority | Finding | Implementation and acceptance |
| --- | --- | --- |
| P0 | Browser titles overwrite route metadata with `Shush`, including 404 | Use real metadata in client and static build; test SPA, direct URLs and canonical query handling |
| P0 | Intro enforces 1600ms and waits up to 3000ms before its exit | 850ms readable beat, bounded 1800ms asset wait, 200ms exit; immediate skip, persistence and reduced motion preserved |
| P0 | Roster CSS has successive overrides and dead lateral-motion rules | One stable player stage; consolidate layout/motion; seven accessible choices, rapid selection, fallback portraits, gestures and dossiers remain |
| P1 | Player information repeats portrait roles and presents equal-weight actions | Editorial player file, role chips, primary dossier action, grouped competitive actions, contextual creator/jersey routes |
| P1 | Mobile selector does not explain offscreen choices | Numbered compact player cards and visible horizontal exploration hint; keyboard/Home/End and centered selection |
| P1 | Drop exports text only | Lazy image share studio for real player identity and personalized jersey; resilient loading/export, Unicode, explicit indicative composition |
| P1 | Hover state and idle/selected state have different strength across controls | Shared motion tokens; stable light/fill/press feedback, strong persistent selected state, coarse-pointer and reduced-motion rules |
| P1 | Home/Creators/About repeat moving portrait/card hover behavior | Stable geometry, editorial frames, contextual atmosphere and meaningful page-level navigation |
| P1 | Match Center overview and archive are visually separated without an immediate record summary | Actual verified-record count, wins/losses, provenance, archive entry and selected filters; never imply a live season |
| P1 | Existing viewport suite omits 375, 430 and 1440 | Add those widths and before/live versus after/preview screenshot evidence across all six routes; retain 200% text, landscape, WebKit, keyboard and accessibility suites |
| P2 | No approved personal stories, clips, equipment or chemistry data | Do not manufacture Moments, ratings or biographies. Reuse only verified data and existing imagery |

## References

Interaction principles: EA's official FC 26 accessibility resources
(https://www.ea.com/able/resources/ea-sports-fc/fc-26), W3C animation-from-interactions
(https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions),
and web.dev motion accessibility (https://web.dev/learn/accessibility/motion).
These guide focus, control and reduced motion, without reproducing game assets.

## Baseline

`pnpm run validate`: PASS before edits. Gzip budgets: JS 132.43 KiB,
base CSS 15.22 KiB, Christmas CSS 10.17 KiB, all CSS 44.96 KiB.
Initial live browser screenshots captured for all six routes; the final CI capture
matrix records production-before and preview-after at each requested viewport.
Core Web Vitals targets are not measured production results.

## Verification and delivery

To be filled with actual results after implementation and visual inspection.
