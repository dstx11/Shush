# SHUSH — Player Select and seasonal refinement

## Research basis — 13 November 2026

The [r/gaming discussion](https://www.reddit.com/r/gaming/comments/1lv9mjg/whats_the_best_character_select_screen_youve_seen/) points to character select experiences remembered for *personality* (SSX Tricky's short repeating character poses), *worldbuilding* (Diablo II's campfire), *spatial camera language* (1080° Snowboarding's lodge), *immediate feedback* (Marvel vs. Capcom 2), *reaction to highlighted choice* (Mega Man 3), and *a character's contextual story* (Wild Arms 3).

These are inspirations, not copied code, artwork, cinematics, or sound. The SHUSH roster consists of seven real people, so the UI never invents classes, powers, win rates, abilities, or biographical claims.

## Character select

The existing `RosterSection` preserves URLs (`?player=`), seven buttons and seven public Tracker.gg links, true game roles, jersey links, share and copy, and mobile swipe. The additions are:
- Seven different SVG signatures rendered by `PlayerSignature.tsx`. Their paths and visual rhythms are unique to the seven roster IDs, not gameplay stats.
- Fine-pointer parallax via the shared `useCinematicPointer` hook; CSS properties use transforms/translate, and the loop stops on pointer exit or in background tabs.
- Selection feedback, a direction-aware portrait change, optional replay, and an original synthetic cue that starts **muted** and only plays after explicit user opt-in.
- Number shortcuts 1–7, arrow/Home/End movement on the existing strip, and native buttons and links throughout.
- Accessible status text and focus cues; decorative graphics are hidden from accessibility APIs. Site/OS reduced motion is respected, including mid-transition.

## Seasonal scenes

All seven named campaigns retain their real calendar rules under `Europe/Lisbon`. `SeasonFeature` adds meaningful scene responses: the Valentine duo connection, the Carnival reveal, Easter's 3/3 progress, summer day-night skies and waves, New Year's orbital clock, and the Halloween spotlight with button fallback. CSS ambience is local to each scene and decorative particles do not intercept interactions.

### Christmas — exactly one tree

The **only rendered tree** is the animated Canvas `ChristmasTree` inside `HeroShowcase`. The duplicate decorative silhouette formerly in `WinterLobby` has been replaced by a flat constellation of seven interactive ornaments. The ornament actions still reveal the matching real roster members. The postal studio and presents stay unchanged.

## Performance and safeguards

No React rerenders from cursor parallax, no WebGL, no third-party animation framework, and no autoplay sound. Seasonal particles use opacity/transform and respect the site's reduced motion setting. CSS for the player select is route-only, while the heavier Christmas Canvas and seasonal experiences remain conditionally loaded. All historical versions and Git commits are preserved; deprecated files are removed only when demonstrably unused.

Validate with `pnpm run validate`, Playwright on Chromium/WebKit, desktop and mobile visual evidence, and Cloudflare preview/production HTTP smoke tests.

## Integrated selection and dossiers

The roster now uses one composition: a compact seven-player selector comes before the selected portrait and published facts. The second row of large portraits and oversized introductory heading were removed. Decorative geometry, idle glow and orbit effects were reduced. Existing direct selection, keyboard shortcuts, touch gestures, shared URLs and optional audio remain available. The selector is dedicated to choosing people; the selected profile provides its one external Tracker action, instead of repeating seven external links beside the selection controls.

Native dossiers preserve the current selection and allow previous/next navigation. Escape returns focus to the current player control. Seasonal preview exploration and local LAB error recovery remain unchanged.

## Readable entrance

The automatic introduction now has a 1600 ms readable identity beat, a 320 ms exit and a 3000 ms maximum asset wait. Previously, cached images could dismiss it before its arrival animation finished. The minimal scene uses the real logo, wordmark and seasonal subtitle, without orbit rings, decorative rays or simulated numbered loading steps. The remembered intro key is versioned so returning visitors see the revised introduction once. Reduced-motion users and blocked storage still bypass it; Escape and skip remain available.

Browser regression coverage verifies the minimum readable beat and bounded exit. Visual comparisons wait until the introduction closes before capturing page content.
