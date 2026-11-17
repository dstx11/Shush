# SHUSH experience overhaul — 16 November 2026

Base: master 6c3a3b4. Preserve the existing Vite/React/Router stack, real portraits,
verified match data, seasonal calendar, one Canvas Christmas tree and local-only studio.

## Confirmed audit and acceptance matrix

| Priority | Finding | Implementation and acceptance |
| --- | --- | --- |
| P0 | Browser titles overwrite route metadata with `Shush`, including 404 | Use real metadata in client and static build; test SPA, direct URLs and canonical query handling |
| P0 | Intro enforces 1600ms and waits up to 3000ms before its exit | 850ms readable beat, bounded 1800ms asset wait, 200ms exit; immediate skip, persistence and reduced motion preserved |
| P0 | Roster CSS has successive overrides and dead lateral-motion rules | One stable player stage; consolidate layout/motion; seven accessible choices, rapid selection, fallback portraits, gestures and dossiers remain |
| P1 | Player information repeats portrait roles and presents equal-weight actions | Editorial player file, role chips, prominent dossier action, primary competitive link, grouped secondary actions, contextual creator/jersey routes |
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

### Validation

`pnpm run validate` passes: TypeScript, seasonal scheduling, Premier records,
competitive profiles, local Drop configuration, tree lifecycle, refinement checks,
asset/link integrity, build, distribution and unchanged bundle limits.
Linux and Windows CI validation also pass on 6aaad901.

Gzip: all JS 134.98 KiB (limit 135), base CSS 15.47 KiB (limit 15.5),
Christmas CSS 10.17 KiB, all CSS 43.25 KiB (previously 44.96).
These are all-chunk compressed totals, not initial-route transfer or field metrics.
No dependency or budget increase.

### Visual review

Before/after full-page evidence covers all six routes in 12 viewport/engine projects.
Production-before pairs were captured in runs 43906611475 and 43909144607; later release runs capture the local after-state, with fresh live-before retrieval opt-in via SHUSH_CAPTURE_BEFORE=1. This preserves genuine before evidence after publication and avoids making release checks depend on the old public build/network. Existing suites retain keyboard, focus, reduced motion, 200% text, blocked APIs,
URL state, snapshots, assets and accessibility checks.

Manually inspected: desktop Home, roster and About; mobile 320 Creators, 375/390
roster and 430 About; tablet 768 roster and 1024 Premier; wide 1920 Creators;
landscape 844 roster; all three desktop Christmas scenes. Native browser QA covers
player/jersey cards and nested-dialog Escape/focus restoration and keyboard isolation. Capture coverage is
broader than this manual sample; not every full-page pixel was manually inspected.

Fixed during QA: nested card Escape also closed the player dossier, and card arrow keys reached the underlying player selector; an overly broad
heading selector enlarged its studio title; seasonal control aliases were scoped
above their variable definitions; the centring test measured viewport rather than
content width after stable scrollbar gutters. A 200% text screenshot exposed header overlap despite no horizontal overflow; rem-based container queries now compact the header with enlarged text, and tests assert separation or an operable compact menu. Narrow enlarged-text navigation also constrains the brand, wraps menu labels and clips decorative portrait serials to prevent text collisions. Inherited emergency word wrapping and a wrapping hero footer prevent enlarged Home text from inflating the mobile layout viewport; tests compare against the configured viewport rather than an already-inflated innerWidth. The copy-geometry test now awaits the completed entrance and visible control before recording its initial box.

Reviewed reference changes: Home/roster desktop and mobile, desktop About and three
desktop tree scenes. Tree scenes change by one pixel in container width from the
scrollbar gutter; composition and single-Canvas lifecycle stay intact. Drop
references were separately inspected after correcting selected-control colors. No blanket screenshot
update command was used.

### Preserved behavior and boundaries

Seven real portraits/players, optional sound, deep links, swipe, keyboard shortcuts,
dossiers, verified Tracker identities, match archive, calendar/TXT/poster exports,
local drafts/reset/undo, jersey front/back zoom, Creator channels, brand download,
partner, seasonal scheduling, LAB and one main Christmas tree remain.
The new studio shares bounded resource loading, offscreen rendering, stale-result
rejection, error/retry and download logic.

No approved clips, anecdotes, equipment, chemistry or new results were provided.
Those remain content-dependent; no invented content, fake live data, price,
checkout or order flow was added. Jersey PNGs are indicative, not print proofs.

### Measured loading sample

On source 6aaad901, three initial/repeat pairs in Chromium 390 × 844 recorded
startup LCP candidates of 124–128ms on initial visits and 64–164ms on repeat visits;
observed startup CLS was zero and no long tasks were observed. Initial visit samples
settled around 1.49–1.52s including the intro, repeat samples around 189–214ms.
This is an unthrottled local CI preview with an existing browser context/cache,
not a physical phone, cold-cache production visit, field INP or Core Web Vitals
certification. Metrics JSON is attached to the CI artifact.

### Release evidence

PR: https://github.com/dstx11/Shush/pull/28

The release gate is the full corrected CI run: both operating-system validation
jobs and all three browser shards must pass before merge. The production check
then compares the deployed asset entry to this build on all six routes, plus
metadata, HTTP status, 404, robots and security behavior. Final run/deployment
status is recorded in the PR and the delivery response rather than predicted here.
