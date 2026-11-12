# SHUSH 2.0 — Campaign system

## Product rules

The SHUSH organisation and VALORANT identity stay central. Verified Premier results, seven roster profiles, creators, the historical About page and the manual Drop 01 jersey configurator are never hidden by a campaign. The LOUD reference is credited as historical inspiration, without implying affiliation or duplicating its artwork.

The theme is a visual and editorial layer. The permanent design is the purple SHUSH identity; Christmas remains the existing cozy experience, now loaded as a separate campaign module.

## Calendar (Europe/Lisbon; inclusive)

- Christmas: 1–26 December.
- New Year: 27 December–3 January.
- Carnival: four days before through one day after Shrove Tuesday, calculated as Easter minus 47 days.
- Valentine's Day: 11–15 February, with the 14th prioritised over an overlapping Carnival campaign.
- Easter: Palm Monday through Easter Monday, based on a moving Gregorian Easter.
- Summer: 1 July–31 August.
- Halloween: 24 October–1 November.
- Base: all other dates.
- April Fools: intentionally not scheduled.

See src/seasonal/calendar.mjs for the single scheduler and scripts/test-seasons.mjs for date boundary tests. Future Origins and Matchday campaigns should only activate when an owner confirms the anniversary and the actual match fixture respectively; never invent results, live times, or the founding day.

## Components and assets

- SeasonProvider maintains the active theme while a browser tab stays open across midnight or resumes from suspension.
- themes.ts holds each campaign's headline, tone, introduction and feature copy.
- SeasonArtwork uses one lightweight SVG per hero without a JavaScript animation loop.
- CoreHero shares its roster imagery and actions across all non-Christmas campaigns.
- SeasonFeature contains campaign-specific editorial content; the Valentine's experience includes an optional copyable Duo Queue card.
- ChristmasLanding lazily imports the existing ChristmasTree, WinterLobby and WinterPostcard modules, including their own styles, only when active.
- BrandIntro is limited, dismissible, reduced-motion-aware and shown once per session per campaign.

## Performance and QA

Keep CSS/SVG animations to compositable properties; avoid permanent expensive filters and unnecessary dependencies. Maintain existing route accessibility, responsive profiles, URL-based player selection, manually verified scores, and exact account associations.

Run pnpm run validate and pnpm run test:browser. Review screenshot diffs deliberately before refreshing visual baselines. Verify 320px, 390px, 768px, 1366px, 1920px; zoom and keyboard navigation; midnight transitions; and the bundle budget.

This branch is intended for review. Do not merge or deploy until CI and visual QA pass.
