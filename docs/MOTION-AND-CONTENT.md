# SHUSH — cinematic interface and content provenance

The production source is `master`, with a Vite + React static build. Do not maintain parallel public versions of the site.

## Motion language

The shared entry/reveal and accessibility system is `src/styles/motion.css`. The hero's pointer-following artwork is in `src/hooks/useCinematicPointer.ts` and `src/styles/hero-cinema.css`. `CinematicStory` and its home-only CSS provide the scroll-bound stage and decorative ticker. The intro's four states share `BrandIntro` and `src/styles/intro.css`.

- Animate `transform`, individual `translate`, and `opacity` whenever possible.
- Never animate layout-dependent properties during scrolling.
- The cinema stage uses CSS view timelines only with `@supports`, and has a complete static fallback.
- A single pointer animation frame controls the hero; it must not rerender React. It runs for fine pointers and only with motion enabled.
- Decorative ticker playback is limited to when it is visible and the tab is active.
- Every effect must stop when `prefers-reduced-motion: reduce` or the site motion setting is active.
- The static prerender and the no-JavaScript experience must keep the real text and links; no required information is hidden inside motion.
- Intro is automatic, contains no Enter button, is dismissible with Escape and cannot hang indefinitely.

## Results and factual copy

`src/data/verified-matches.ts` is a manual, dated transcription of the **ten most recent results visible** on the public [Tracker.gg team page](https://tracker.gg/valorant/premier/teams/a5552155-90d0-4559-b879-f08e5f9f05b8). Reviewed 13 November 2026. It is not a live API, not an exhaustive history, and not the unverified internal Premier calendar. New results must be checked at source before they are added, with a new accurate verification date. The owner's seven-person roster remains the authority for SHUSH members; do not infer roster membership from old match lineups.

## Maintenance

Keep one production source. Numeric `v3`/`v5` stylesheet variants and stale iteration progress files were retired from the current tree, while git history remains available for audits and safe rollback. Do not delete commits, tags, or deployed production files merely to hide old revisions.

Use `pnpm run typecheck`, `pnpm run build`, `pnpm run check:bundle`, `pnpm run validate:dist`, and Playwright before merging.
