# SHUSH: coordinated entrance and editorial refinement

Baseline: master 2366eb5. The winter tree, seasonal editions, roster rotation, match archive, player links, jersey customizer, drafts, exports and postcards remain available.

## Changes

- Entrance has no artificial minimum. Fonts and eager images resolve before a 320 ms visual exit; a 3 s deadline keeps failed resources from blocking access. Escape and a visible Skip action reveal content immediately. Seasonal/year-specific completion persists across tabs when storage is available.
- Route CSS animations pause while the entrance covers the page and resume on reveal. The dialog backdrop exits with the dialogue surface. Runtime reduced-motion changes also dismiss the entrance.
- Motion controls are available in the desktop header, mobile menu and footer, synchronise immediately, and respect operating-system preferences. The canvas tree also stops and resumes on the manual preference, including a cross-tab preference update. Focused reveal sections are exposed without waiting for an intersection callback.
- Replaced four repeated destination panels with one short editorial interlude. Home keeps the seven-player gallery, three match records, creator links and product/history destinations. Added restrained serif contrast, warmer lighting and clearer closing cards.
- About presents the origin once and gives the current team the main title. Spring secrets no longer reintroduce personal nick references. Creators explain the real channel destinations without invented clips or broadcast schedules.
- Drop availability appears before editing. The customizer is explicitly a preview while ordering is unavailable; save, share, TXT and draft flows are retained. No official contact exists in the supplied data, so none is invented.
- Players, Premier, creators, product/gallery and About CSS load with their routes. Static HTML links include every route's stylesheet dependencies so no-JavaScript pages remain styled.
- HTTPS responses request HSTS for the current host only. Content-hashed JS and CSS receive long immutable cache lifetimes; non-versioned images retain short revalidation.

## Boundaries

This change does not replace createRoot with hydration. Existing build-time disabled controls and visit-specific state require an explicit matching render contract before that migration. It preserves balanced player rotation instead of silently removing it.

Administrative branch protection cannot be updated through the available GitHub mutation tools; the local gh client has no authenticated session. No credentials or unrelated sessions were accessed. Protection therefore remains a separate operational task.

Build validation passes. Global CSS changed from 20.48 to 14.67 KiB gzip; combined CSS changed from 32.86 to 35.29 KiB due to separate compression dictionaries. Total JS is 121.37 KiB versus 121.80 KiB. The serif accent uses an existing local font resource; reduced CSS does not imply reduced total first-load bytes. Global CSS now has a stricter 15 KiB budget; each route stylesheet is capped at 3 KiB and the whole CSS distribution at 36 KiB.

Browser CI and visual review results are recorded in the pull request before deployment. Bundle sizes are gzip build measurements, not Core Web Vitals or device performance claims.
