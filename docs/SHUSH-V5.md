# SHUSH V5 — implementation and verification

Base: validated V4 `01f4ef35863a1a98ecd257bef903752e421a9d42`.
Development: `shush-v5-20261011`, PR #3. Production is unchanged.

## Page ownership

- Home: three real portraits and five short discovery destinations. No full results, second player gallery or creator portrait cards.
- Roster: all seven identities, competitive links, Player DNA, keyboard/swipe selection and jersey links.
- Premier: five verified matches, result/map filters, source disclosures, map aggregates, PNG posters and clearly separated internal archive.
- Creators: channel typography and local SVG graphics; no player photos or competitive details.
- Drop: single product customizer, live print, front/back, zoom, draft, share and TXT workflows.
- Company: brand story, manifesto, brand download and Backora; no player gallery.

## Official player data

Supplied by the owner in the V5 brief. Indices derive from array order, never jersey numbers.

| Index | ID | Public name | Jersey | Size |
| --- | --- | --- | --- | --- |
| 01 | dstx | DSTX | 11 | M |
| 02 | more | More | 13 | M |
| 03 | th0maz7 | Th0maz7 | 07 | M |
| 04 | lyel | Lyel | 14 | XXL |
| 05 | tz | TZ | 10 | M |
| 06 | levi | Levi | 09 | M |
| 07 | catty | Catty | 20 | M |

Single-digit jersey numbers retain the customizer's existing two-digit display format. Their numerical values remain 7 and 9. Internal IDs and all seven Riot IDs/Tracker destinations are unchanged.

## Home rotation

A cursor over the seven-player ring selects three consecutive distinct members and advances by three on each new document. Over seven refreshes, each member appears three times and occupies the centre once. The difference in total appearances never exceeds one for an uninterrupted sequence. Only one integer is stored locally. A module-level visit cache prevents Strict Mode or SPA navigation from advancing the rotation. No timers rotate the portraits. With storage unavailable, the current document remains stable, but cross-refresh balance cannot be guaranteed without persistent state. Tests cover all starting positions, 70 visits each, real reloads and blocked storage.

## Interaction and motion

Short portrait departure overlays the new arrival without delaying URL, focus or selection updates. The previous image is decorative and removed after animation. Reduced motion hides it immediately. Hero pointer response is limited to fine mouse input with motion enabled. Product view transitions, one-time section reveals and keyboard focus share the same visual feedback.

The optional initial brand introduction ends after route/essential image readiness and a target of 1.8 seconds from document navigation; bounded image wait and a six-second fail-safe prevent indefinite display. It runs once per document, never on normal internal navigation. Reduced motion skips it. It does not capture input. Existing static/route loading and error recovery remain.

## Match data and posters

The five records preserve their 2026-10-10 source verification date. A 2026-10-11 web recheck could not access Tracker; no newer verification is claimed. No scraping, private endpoints, live API or fabricated results were added. The old local calendar remains explicitly separate; its windows no longer trigger a simulated Matchday on Home. Premier states that no future match is confirmed.

Map aggregates use only these five records and display the sample size. Filters show only maps available for the chosen outcome. A period filter is unnecessary for five records.

Posters use native Canvas, the local SHUSH logo, typography and actual match facts. Two sizes: 1080 × 1080 and 1080 × 1350. Fonts settle before rendering. Long names are measured and fitted. Rendering uses a detached canvas and generation token, preventing stale format requests overwriting the current preview. Download exports the displayed canvas exactly. Native dialog, Escape, return focus, error/retry and PNG dimensions/bytes are covered by browser tests. Opponent logos/player portraits are not used.

## Technical checks

- Existing architecture and dependencies retained.
- Removed retired Home rail/Matchday presentation, unused clock hook and associated dead CSS. Historical calendar/date logic remains tested.
- Local `pnpm run validate`: passed; JS 98.03 KiB gzip, CSS 14.75 KiB, under existing 100/16 KiB limits.
- `pnpm run check:preview`: all six routes, route metadata, headers, preview noindex, actual 404, redirect and deployed entry asset passed.
- Local Playwright launch could not run: its required Chromium binary is absent. Browser QA runs in GitHub Actions; results and visual review are recorded below when complete.
- Added 1024px coverage alongside 320, 390, 768, 1366, 1920, landscape, reflow and mobile WebKit.
- Core Web Vitals targets are not claimed as measured field results.

## Reference review

Owner-provided V4 hero/gallery captures were inspected. Public Fnatic, G2 and Team Liquid navigation/content structures were consulted on 2026-10-11; Paper Rex was inaccessible. These informed page ownership and concise destinations, without copying assets or compositions.

## External limitations

No approved Riot production/RSO integration or new player statistics were supplied. Advanced stats, favourite agents, sensitivity, gear and future fixtures remain absent rather than fabricated. The preview is a development deployment, not a production merge.

## QA round 178

CI: 353 passed, 25 viewport-specific skips, 17 failures. Nine were the same overly broad accessible select label, corrected in the UI. One WebKit resource-failure test was cache-dependent; it now injects a single decode failure at the image boundary. Seven were expected visual differences, reviewed individually. Only unaffected approved regions (desktop Home, desktop/mobile Drop, mobile Company) were promoted. No thresholds relaxed.

Visual inspection revealed narrow tablet portraits and overly repeated discovery panels. The hero now stacks at tablet widths; mobile portrait heights preserve more of the faces. Discovery uses open editorial divisions. Roster mobile now exposes the official jersey number/size and places arrow controls directly beneath the portrait. Both PNG formats were visually reviewed and their bytes/dimensions passed on every browser project.
