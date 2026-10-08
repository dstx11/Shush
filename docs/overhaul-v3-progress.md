# SHUSH — Overhaul V3

Working branch: audit-pro-20261007. Base: master. PR #1. No automatic merge.

Baseline: ec79c6cd04b05f233975e62d7c04ec8fdd3258cd, CI #146 passed (Linux, Windows, 54 browser tests; 6 desktop mobile-menu skips). All JS 89.64 KiB gzip; CSS 9.58 KiB gzip. Six-route before screenshots: CI #146 responsive-qa artifact.

| Block | Scope | Status |
| --- | --- | --- |
| A | Identity, header, editorial Home | Validated locally and CI #147 (six-width browser/Cloudflare checks) |
| B | Player Select, copy Riot ID, sharing, mobile selector | Validated locally and CI #148 |
| C | Match Center, expandable weeks, call-ups, streams, ICS | Validated locally and CI #150; disclosure image QA correction verified |
| D | Dedicated creator compositions | Validated locally and CI #151 |
| E | Drop configurator, Unicode, URL restore/share, reset, TXT, optional draft | Validated locally and CI #152 |
| F | About, Backora, brand download, footer and true 404 | Validated locally and CI #153; all six desktop/mobile compositions inspected |
| G | Responsive, keyboard, motion, interactions and accessibility QA | Complete: CI #155, 195 passed and 21 viewport-specific skips; all eight QA surfaces inspected |
| H | CSS/dead code cleanup, bundles, deploy and final audit | Runtime audit complete; eight reviewed visual baselines committed as a required gate for the current head |

## Evidence and limits

- Public names/numbers remain those in players.ts; confirmed Riot associations stay separate.
- Tracker VALORANT API/website embed is unavailable for this integration; no scraping or unlicensed stats.
- Only June/July 2026 is registered; incomplete results cannot establish final points or playoff outcomes.
- No confirmed clips/thumbnails, future season, order contact, price, stock, size chart, manufacturing facts or contact email exists. Conditional features needing these facts stay absent.
- Screenshot inspection, automated accessibility checks and deployment validation are release gates.
- CI #154 passed all 48 route axe scans and expanded navigation scans. Eight reload tests exposed an inaccurate history-event counter; it now counts document requests. Global overflow hiding was removed to restore sticky positioning and make overflow checks meaningful.
- Body pre-rendering was evaluated and deferred; the reasoning is recorded in design-evolution.md. Route-specific metadata is static; page bodies are client-rendered.

This ledger is updated per block for immediate resumption without rebuilding or treating pending QA as passed.

## Release audit

- Published runtime: 9d4441d50862790e7054e79af050c7dbc27ee4c4, CI #155. Linux, Windows, 195 passing browser tests; 21 intentional viewport-specific skips. No test retries or ignored accessibility rules.
- Actual Cloudflare checks: all six routes return 200 with their metadata and security headers; unknown route returns 404; canonical redirect and current built entry asset verified. Immutable runtime preview: https://3b37e92c.shush-4n1.pages.dev/.
- Eight reviewed Linux Chromium visual references cover Home, selected player, back-jersey customization and About at 1366/390px. Snapshot comparison is added to the same required browser job. Check the current-head workflow result in PR #1 before merge; references cannot update automatically.
- Final runtime bundle: all JS 95.31 KiB gzip, CSS 11.34 KiB gzip, 59 transformed modules. V3 baseline: 89.64 / 9.58 KiB gzip. Added interactions cost 5.67 / 1.76 KiB and stay below the 100 / 16 KiB budgets. Main entry 82.63 kB gzip (Vite decimal units).
- No production dependency was added. Axe is development-only. Legacy audit.css, unused Reveal and obsolete overrides are removed; shared page headings/actions belong to shared styles.
- Visual inspection covered six pages at desktop 1366, mobile 320/390, tablet 768, wide 1920, mobile WebKit, landscape 844×390 and effective 200% reflow. Short-height form and real sticky preview tests passed. These are browser emulations, not physical-device or native virtual-keyboard tests.
- No field LCP/INP/CLS or complete WCAG conformance is claimed. Automated route/menu scans, visible keyboard focus, focus containment, reduced motion, touch targets and recovery behavior passed.
- Core P0 and viable P1 work is complete. Conditional content needing statistics authorization, verified clips, more seasons or an order contact remains absent rather than invented. P2 body pre-rendering remains deferred on evidence/complexity grounds.
- Working branch remains audit-pro-20261007; master is untouched and PR #1 remains unmerged. Current-head CI and Cloudflare deployment must stay green for merge.
