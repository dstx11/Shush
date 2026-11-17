# SHUSH — Design Intelligence / Living Knowledge Base
Version: 1.0 | Research cut-off: 2026-11-17 | Status: research and design guidance, not implemented UI.

> Purpose: durable, evidence-linked design knowledge for future SHUSH work. This file informs decisions; it does not train or change model weights. Future agents must read relevant sections during substantial visual or UX work, then update discoveries with sources and observed results. Do not load the entire file for a trivial bugfix.

## 0. Creative reset — binding direction (2026-11-17)

**The user explicitly discarded the entire former SHUSH visual design. Treat this as a GREENFIELD VISUAL REDESIGN, not an evolution of old appearance.** The existing site is only an inventory of real data, user journeys, implementation realities and regression tests. Old screenshots, palettes, typography, composition, spacing, layout patterns, hover styles and motion are **not** creative baselines. Their continued presence in code or documents is not a reason to keep them. Redesign every visual layer from first principles; refactor or replace UI components as necessary. Legacy visual regression snapshots are evidence of what changed, not target appearances; update only after human inspection.

Keep only legitimate nonvisual contracts: verified content, authentic player and brand identity assets where appropriate, shareable URLs, page destinations, accessibility, exports, seasonal schedule, actual competition facts, metadata, deployment and technical reliability. Existing fonts are candidates, never required; old color names are historical, not palette prescriptions. The **new** user-approved direction is luxury dark purple with refined, dense-but-clean UI, responsive AAA-quality game-feel, cinematic but restrained movement, optical craft and original interaction language. Develop new palette/type/material systems through prototypes and evidence.

**How research should affect the new design:** compare several original art directions first, establish new visual rules, then select/adapt sourced effects. Never use "preserve the existing design" as a decision criterion. Test real user journeys and benchmark performance against old build, not aesthetic resemblance. Future agents should record which old implementations were replaced and what new design hypothesis proved stronger.

## 1. Source of truth and project reality

- Repository: https://github.com/dstx11/Shush ; deployment: https://shush.pt/.
- Stack confirmed from package.json: React 19, React Router 7, Vite 8, TypeScript 6, Tailwind 4, pnpm. Static site deployed to Cloudflare Pages. Do not turn it into Next.js, a backend, ecommerce service or an account-based application.
- Existing routes: Home (/), Premier (/esports/valorant/premier), Roster (/esports/valorant/roster), Creators (/content), Drop 01 (/products/jersey), About (/company).
- Existing verified behaviors from README and November 16 overhaul: seven real players and portraits, real Riot IDs and corresponding links, shareable player selection, dossiers, keyboard/touch controls, real Premier archive and calendar exports, creators and channel links, jersey front/back, customizer, local drafts, undo, share/TXT/PNG exports, optional sound, seasonal themes, one Christmas-tree Canvas, LAB, route metadata, correct 404 and redirects.
- Data source restrictions: do not invent match results, live stats, player histories, sponsors, product inventory, checkout, photos, biographies, clips, price, or external integrations. Real data overrides visual ambition.
- Current README documents CI/browser checks. November 16 research reported approximately 135 KiB gzip all-JS, essentially its then 135 KiB budget; measure HEAD afresh before modifying. These figures are historical, not live performance metrics.
- Existing root AGENTS.md is an important control document. Read it, but for substantial approved visual work follow the updated component adaptation policy there. No unapproved wholesale UI-kit installation.

## 2. The prime design thesis

Brand promise: **Sem barulho. Só rounds.** Creative translation: **Silence before impact.**
Desired character: luxury dark purple + competitive precision + cinematic editorial + tactile/game-quality UI.
Default = calm, legible, dark, visually confident. Action/selection = a brief controlled release of energy. User task completion outranks spectacle. Luxury is craft, not excessive glow; minimalism removes irrelevant noise, not useful information.
A static screenshot must look excellent before animation. Every meaningful interaction must clearly respond; no animation should be necessary to understand critical content.
The NEW identity must not imitate a major org, a generic SaaS, a cyberpunk template, a Discord dashboard, or a component demo. There is no obligation to retain any legacy SHUSH visual expression.

## 3. Research findings — evidence and SHUSH application

### R01 — Design research should explain decisions, not add visual noise
Source: NN/g, ten usability heuristics, https://www.nngroup.com/articles/ten-usability-heuristics/ (checked 2026-11-17).
Finding: visibility of system status and aesthetic/minimalist design favor clear feedback and task-relevant content. Implication: every control has distinct idle/hover/focus/selected/pressed/loading/success/failure states; do not add decorative status indicators without actual meaning.
Confidence: direct guidance. Not a claim that SHUSH has passed usability testing.

### R02 — Beauty can conceal UX defects
Source: NN/g, https://www.nngroup.com/articles/aesthetic-usability-effect/ (reviewed September 2026).
Finding: aesthetically pleasing interfaces are often perceived as more usable even when they have problems. Implication: independently test user journeys, keyboard and mobile, not merely ask whether screenshots look premium.
Confidence: direct guidance.

### R03 — Minimalist != empty
Source: NN/g, https://www.nngroup.com/articles/aesthetic-minimalist-design/ .
Finding: useful information and cues should remain; irrelevant elements compete for attention. Implication: real competitive detail is preserved, secondary actions progressively disclosed; never delete important content just to obtain large empty surfaces.
Confidence: direct guidance.

### R04 — Hierarchy is built from contrast, size and grouping
Source: NN/g, https://www.nngroup.com/articles/visual-hierarchy-ux-definition/ .
Finding: color/contrast, scale and proximity/common-region help direct attention. The squint test can reveal an accidental focal point. Implication: each viewport has one obvious focus, predictable groups, a differentiated primary CTA and consistent alignment anchors.
Confidence: direct guidance.

### R05 — Progressive disclosure balances rich functionality with simplicity
Source: NN/g, https://www.nngroup.com/articles/progressive-disclosure/ .
Finding: defer specialized options without removing them. Implication: a prominent roster player identity with on-demand dossier; primary Drop controls first and secondary export/reset/draft actions grouped contextually.
Confidence: direct guidance.

### R06 — Editorial structure makes cinematic work coherent
Source: Bisous case study, 2026-06-29, https://tympanus.net/codrops/2026/06/29/inside-bisous-designing-an-editorial-experience-for-cinematic-cgi/ .
Finding: consistent four-column grid, restrained palette, sans+mono pairing, subtly randomized typography and brand-derived micro-easter-eggs; continuous project transitions. Implication: retain a consistent spatial skeleton while varying per-page compositions, and invent SHUSH-specific microdetails based on the logo/team identity, not generic glows.
Confidence: creator case study; principles are transferable, not a mandate to copy effects.

### R07 — Motion should carry content relationships
Source: Podium case study, 2026-06-23, https://tympanus.net/codrops/2026/06/23/podium-building-a-website-where-running-becomes-storytelling/ .
Finding: designers rejected a pixel-heavy transition because it distracted from content and retained a media-as-transition-object approach. Implication: player portrait/home thumbnail should be the continuity object across related views; overlay effects should never obscure the player.
Confidence: creator case study.

### R08 — Mobile optimization can mean removing costly filters
Source: 4WIDE case study, 2026-04-23, https://tympanus.net/codrops/2026/04/23/building-4wide-turning-distortion-blur-and-motion-into-a-coherent-experience/ .
Finding: the author found mobile blur especially costly and used lighter geometry/images and reduced effects. Implication: SHUSH must not force desktop shaders onto mobile; visually equivalent fallback may outperform the original.
Confidence: author observation, not a general device benchmark.

### R09 — Uiverse is the primary micro-detail source
Sources: https://uiverse.io/ and https://github.com/uiverse-io/galaxy , checked 2026-11-17.
Finding: Uiverse shows 7,471 elements on the checked page; the Galaxy repository describes its component archive and MIT license. Use for buttons, switches, checkboxes, tooltips, loaders, tiny input states, CSS patterns. Community items vary widely in semantics and performance; inspect each rather than assuming production quality.
License: carry required MIT copyright/license where substantial source is copied; provenance/author credit when practical. Do not infer identical licenses for unrelated resources.

### R10 — React Bits is the primary high-impact-effects source
Sources: https://reactbits.dev/get-started/index ; https://reactbits.dev/get-started/installation ; https://github.com/DavidHDev/react-bits/blob/main/LICENSE.md , checked 2026-11-17.
Finding: TS/JS and CSS/Tailwind variants, single-component copy or shadcn/jsrepo installation; source of effects such as Blur Text, Split Text, Electric Border, Dark Veil, Light Rays, Magic Bento, Depth Carousel. The license is MIT + Commons Clause, allows use in commercial websites but prohibits selling/sublicensing/redistributing the components themselves as a library/product. Retain notices and confirm third-party material notices.
Implication: research individual components; adapt code into existing architecture; do not ship the entire catalogue or an unmodified library demo.

### R11 — React Bits tools can replace expensive runtime effects with exports
Source: https://reactbits.dev/tools (checked 2026-11-17).
Finding: Background Studio exports images/video/code; Shape Magic and Texture Lab create exportable assets. Implication: prioritize pre-rendered textures, SVG framing and short optimized media before adding a new always-on shader.
Asset licensing still requires checking for each generated/exported asset.

### R12 — Aceternity has both free and paid surfaces
Sources: https://ui.aceternity.com/components ; https://ui.aceternity.com/ai-recommendations ; https://ui.aceternity.com/pricing .
Finding: free React/Tailwind/Motion components coexist with paid blocks, templates and advanced interactions. The catalogue is designed for AI discovery, but licensing and dependencies must be checked per item. Implication: use free cards, navigation, animated text, tooltips and layouts as candidates; no paywall circumvention, no blanket shadcn install.
Confidence: official catalogue/pricing.

### R13 — Motion shared layout is excellent for selection indicators
Source: https://motion.dev/docs/react-layout-animations .
Finding: React layout/layoutId supports shared elements and automatic transform-based layout transitions; potential layout distortion needs testing. Implication: evaluate for roster selection and active tabs, only after measuring dependency weight.
Optimization: https://motion.dev/docs/react-reduce-bundle-size recommends lightweight imports/LazyMotion if installed. Do not assume advertised sample sizes equal SHUSH's bundled results.

### R14 — Native View Transitions may avoid new dependencies
Sources: https://developer.mozilla.org/en-US/docs/Web/API/Document/startViewTransition ; https://developer.chrome.com/blog/view-transitions-in-2025 .
Finding: same-document transitions became broadly available in recent browsers, but feature/support details vary. Implication: prototype a progressive-enhancement route/selection transition; preserve focus, query state, scroll restoration, rapid input and browser back/forward. Do not use experimental element-scoped View Transitions without support assessment.
Priority: CSS > native API > animation library > WebGL for equivalent effects.

### R15 — GSAP is free but not public-domain or MIT
Sources: https://gsap.com/blog/3-13/ ; https://gsap.com/standard-license/ .
Finding: from GSAP 3.13 the bonus plugins are free for standard web use, including commercial projects, under GSAP's own no-charge license. Implication: use for genuinely complex choreography, not basic button hover. Check full license obligations and total bundle impact; avoid using GSAP and Motion for the same job.

### R16 — Composite-friendly animation beats costly repaints
Source: https://web.dev/articles/animations-guide .
Finding: transform/opacity are often cheaper than animated paint-heavy properties such as blur/shadow; inspect in DevTools and apply will-change sparingly. Implication: move highlights via pseudo-element opacity/transform where possible, cap full-screen filtering and animated backdrop blur, watch for layer/memory cost.

### R17 — Immediate feedback is a rendering problem, not merely click-handler speed
Sources: https://web.dev/articles/optimize-inp and https://web.dev/articles/inp .
Finding: INP incorporates input delay, event processing and next paint. Implication: roster rapid-switching should cancel stale work, avoid heavy synchronous updates and measure next-frame responsiveness.

### R18 — Hero asset prioritization matters
Source: https://web.dev/articles/optimize-lcp .
Finding: do not lazy-load likely LCP images; consider priority hints with restraint. Implication: audit whether the hero portrait, logo or heading is LCP on each route; use correct loading priority only after measurement.

### R19 — Movement must have a safe reduction mode
Source: https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions .
Finding: non-essential movement from interactions should be disable-able (WCAG 2.3.3 AAA). Implication: honor prefers-reduced-motion and existing SHUSH motion controls; avoid parallax/auto-loop dependence.
AA compliance also needs focus, labels, contrast, keyboard, correct target sizes; automated scans do not prove conformance.

### R20 — Target-size thresholds must not be misrepresented
Source: https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum .
Finding: WCAG 2.2 AA SC 2.5.8 baseline is 24x24 CSS px with exceptions; enhanced AAA threshold is 44x44. Implication: target comfortable ~44x44 for prominent mobile buttons where feasible, but cite 24x24 AA correctly.

### R21 — Screenshot tests require human review
Sources: https://playwright.dev/docs/test-snapshots and https://playwright.dev/docs/accessibility-testing .
Finding: snapshot environments differ, automated axe catches only some issues. Implication: lock test browser/font/clock, manually inspect changes, test actual journeys and do not approve snapshots blindly.

### R22 — Use perceptual color systems deliberately
Source: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value/oklch .
Finding: OKLCH separates perceptual lightness/chroma/hue and is broadly supported. Implication: create consistent dark-purple ramps and verify actual contrast in browser; OKLCH is a tool, not evidence of accessible combinations.

### R23 — Repository instructions benefit from progressive disclosure
Source: https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra (2026-09-11).
Finding: bloated AGENTS.md and prompts create contradictions and waste context; route relevant tasks to focused docs, and define completion boundaries. Implication: keep AGENTS.md concise; use this long knowledge base only for design and major UI work; use the separate execution prompt rather than pasting all research into every interaction.

### R24 — Genuine visual reinvention needs a new design language, not recoloring old components
Source: Figma, "Figma on Figma: Evolving our visual language", 2024-09-16, https://www.figma.com/blog/figma-on-figma-evolving-our-visual-language/ ; checked 2026-11-17.
Finding: Figma's brand studio developed new compositional primitives, color, typographic roles and integrated motion, tested as an interconnected language. Implication for SHUSH: explore NEW primitives, visual grammar, fonts, materials, composition and motion; no automatic preservation of legacy design. The user explicitly wants a zero-based redesign, stronger than the source's own "evolution" framing.
Confidence: primary creator case study. Cost: exploratory prototypes and brand system engineering. Validation: compare multiple independent hero/nav/roster concepts with static screenshots and functional user journeys; no claim of implementation yet.

### R25 — Prototyping multiple alternatives is superior to polishing one speculative design
Source: Nielsen Norman Group, "Case Study: Iterative Design and Prototype Testing of the NN/g Homepage", 2018-08-26, https://www.nngroup.com/articles/case-study-iterative-design-prototyping/ ; checked 2026-11-17.
Finding: several design variants and repeated user/task feedback changed hierarchy, media choice and presentation formats. Implication: create at least three *different* art-direction systems for SHUSH (not 3 purple variations), test core tasks and mobile, then adopt the strongest. The old site provides functionality and task insight, not aesthetic authority; avoid preserving old visual styling out of habit.
Confidence: first-party usability case study, not outcome evidence for SHUSH. Cost: moderate prototyping. Validation: actual browser prototypes, user journeys and documented comparison; research-only at present.

## 4. Art direction and concrete craft rules

### Colors
Fully NEW candidate palette ideas only, NOT legacy or approved production tokens:
- Obsidian #09070F; midnight plum #120D1D; raised surface #1C1628; active surface #292039.
- Muted stroke #3A2D49; core violet #9268C7; lavender #C5ABE6; warm white #F3EEF7; secondary text #B7ACBF.
Use semantic tokens, validate contrast and chroma, inspect bright-purple light bleed. Strong purple is limited to branded highlights, primary actions and selected states. Neutral dark must dominate.

### Surface materials
Define matte graphite, smoked acrylic, satin plum, restrained metal/edge highlight, product studio and tactical graphite. Each needs idle/hover/focus/selected states. Do not put the same glossy glass card in every section. Optical highlight must not obscure text.

### Typography
Treat legacy fonts such as Space Grotesk, Manrope and IBM Plex Mono only as research candidates, with NO preference. Explore an original type system from zero; select fonts for actual brand character, licensing, performance, legibility and optical composition. Assign clear display, body, micro-label and tabular score roles. Correct line breaking, optical alignment, letter spacing, baseline rhythm. Body remains static; occasional title animation is intentional, not default.

### Composition
Create recognizable alignment anchors and content widths, but unique page compositions. Every viewport needs one dominant story and one clear next action. Use contrast, proximity, scale, negative space and deliberate grouping. Avoid repeating a generic SaaS hero + six bento cards pattern.

### Border craft
Develop a consistent hierarchy of hairline/inset/double-edge/selected-glow. Check rounded corners at 1x and 2x, internal alignment, stroke consistency, stacking and transitions. Use fewer but better accents; no illuminated border around every element.

### Tactile controls
Each real control has clear affordance and complete states: idle, hover, focus-visible, press, selected (if relevant), busy, success/failure, disabled. Prefer small compression, surface reflection and highlight motion over big scaling. No fake success, no decorative disabled actions that appear functional.

### Signature language
Choose 2–4 original motifs and apply consistently:
- LUMEN: directional edge light linked to active/focus state.
- PRESS: brief tactile compression and shadow/inner-light response.
- TRANSFER: shared active indicator for nav, player selection and tabs.
- APERTURE: selective mask reveal of portrait/hero.
- SIGNAL: consistent local feedback, loaded/failed/success state.
Never make these costly global effects without measured benefit.

## 5. Page-specific design intelligence

### Home
Design the first static frame before writing animations. Strong editorial wordmark, actual competitive context and one obvious path. Story rhythm: identity -> verified competition -> roster -> creators -> jersey -> identity close. Distinct section types; no arbitrary landing-page padding inflation. A restrained ambient field may run behind the hero, not every section.

### Roster — flagship
Stable character stage and seven real player choices. Compare tactical rail, character tile selector, editorial hybrid. Portrait remains aligned while selection changes via masks/lighting/crossfade/name animation. Immediate active state; cancel stale image decoding/animation; preserve ?player= URL, swipes, Home/End/keyboard and dossiers. Avoid lateral slides and fake game character artwork. Dossier primary action is verified competitive link, secondary copy/share grouped clearly.

### Premier
Tactical information density: verified records vs published windows vs unknown status. Strong score numerals, hierarchy, provenance, accessible expansions and filters, timeline only if useful. Never imply a live schedule or determine elimination from incomplete archive. Preserve Lisbon timezone/calendar semantics.

### Creators
Editorial people-first presentation using available real imagery and verified channels. Discoverable external actions, no fabricated audience numbers or videos. Vary page composition but keep labels and interaction conventions consistent.

### Drop 01
Product stage with honest front/back imagery and functional customization. Use studio lighting, not fake 3D. Inputs with 16px+ mobile text where useful, live updates, clear controls for reset/undo/save/share/export, Unicode safety, error recovery; manual request, not checkout.

### About
Short real story from available records, editorial milestones, coherent use of real brand assets, partner and download. No fictional heroic lore or fake major-org claims. Keep it credible for a small esports organization.

### Seasons / Christmas
Ambient palette shifts without changing usability. One Christmas-tree Canvas. Manage RAF, offscreen state, cleanup, mobile density and reduced motion. No duplicate tree.

## 6. Suggested component-fit shortlist (research candidates, not installed)

| Need | Investigate | Priority | Design/engineering caveat |
|---|---|---|---|
| Main action | Uiverse subtle press + custom CSS | P0 | adapt semantic states and notices |
| Active nav | native CSS shared pill / Motion layoutId | P0 | do not add Motion blindly |
| Player focus | CSS mask + React Bits Pixel Transition | P0 | evaluate photos and motion cost |
| Hero typography | Split Text / Masked Heading | P1 | keep first-frame readable |
| Portrait emphasis | Spotlight Card / Glare Hover | P1 | avoid facial distortion |
| Button edge | Electric Border or simpler CSS | P1 | prefer CSS if equivalent |
| Match details | accessible accordion + subtle motion | P0 | verify season semantics |
| Card surface | Uiverse visual study + native CSS | P0 | source can be adapted |
| Atmosphere | Dark Veil vs optimized static export | P1 | max one heavy hero effect |
| Background alternative | Silk / Light Rays | P2 | measure mobile |
| Drop view change | CSS crossfade / View Transitions | P0 | no fake 3D |
| Logo presence | Electric Logo | P2 | use as rare special intro |
| Player previews | Depth Carousel / Option Wheel | P2 | prefer accessible rail if better |
| Tooltip | Aceternity / native accessible popover | P1 | keyboard/touch behavior |
| Toast | minimal live-region feedback | P0 | avoid generic huge notifications |
| Season timeline | custom editorial timeline | P1 | no animation that hides results |
| Text data | Count Up only on actual figures | P2 | misleading when data incomplete |
| Signatures | original LUMEN / PRESS / TRANSFER | P1 | reuse throughout |

Reject by default: always-on Glitch, multiple custom cursors, hyperspeed full-screen, large parallax on portraits, 3D globe without geographical task, unnecessary terminal UI, fake metric counters, accidental drag-only interaction, repeated animated bento cards.

## 7. Motion and performance budgets (project heuristics, not external standards)

- Recommend one clear moving focal point in a viewport, with at most one low-contrast ambient background. Use judgement, not a hard requirement.
- New motion-system draft timings: 80–140ms instant feedback, 150–260ms hover, 200–350ms selection, 300–600ms panel/shared transition, 500–900ms rare cinematic reveal. Tune with user-task testing; never let animation block input.
- Full static render should be attractive. Reduced effects degrade in order: remove looping glow -> simplify parallax -> remove shader -> remove nonessential entrance motion; retain status changes via nonmoving cues.
- JS engine selection: CSS > Web Animations API/native View Transitions > one selective motion engine > WebGL only if a signature effect beats optimized CSS/SVG/still media.
- Do not animate layout/paint-heavy blur continuously; prefer pseudo-elements and transform/opacity. Beware will-change memory allocation.
- Initial image/LCP not lazy-loaded; viewport-outside media should be lazy. Check actual route-specific element with tracing.
- Treat previous ~135 KiB gzip all-JS limit as a historical warning, not current measurement. Run current build/budget before change; measure per-route chunks and start-up main-thread work. Do not defeat tests by increasing budgets without evidence.
- Official field targets (75th percentile): LCP <=2.5s; INP <=200ms; CLS <=0.1. Lab data cannot establish field results.

## 8. Practical visual QA protocol

1. Baseline each of six routes desktop and mobile, including representative player selected, mobile menu, Premier expanded state, customized jersey, seasonal Christmas.
2. Static pass: check first-frame hierarchy, crop, proportion, type, spacing, edge, shadow, color, density.
3. Interaction pass: idle -> hover -> focus -> press -> selected -> busy/success/error, pointer exit and rapid repeat.
4. Responsive pass: 320, 375, 390, 430, 768, 1024, 1366, 1440, 1920 px, landscape mobile, 200% text/reflow, tablet.
5. Accessibility pass: keyboard, screen-reader semantics/labels, Escape/focus restoration, touch gestures with alternatives, contrast, 24px AA target-size rule (prefer ~44px for primary touch controls), reduced motion.
6. Reliability pass: direct links, back/forward, query state, local drafts, calendar/PNG/TXT, error states, asset decoding, offline/fallback conditions.
7. Rendering pass: Chrome DevTools Paint Flashing, performance traces, CPU throttling, long tasks and mobile WebKit.
8. Playwright screenshots with stable environment; never blindly update snapshots. Axe catches common issues but is not sufficient alone.
9. Re-run relevant tests after each meaningful change, and full validation before release.

Validation commands inherited from the functional codebase, not from the previous visual style: pnpm run typecheck; pnpm run validate; pnpm run test:browser; pnpm run build; pnpm run check:bundle; pnpm run check:links; pnpm run check:assets.

## 9. Design learning protocol — how future agents accumulate knowledge

**This is repository knowledge, not permanent training.** AI agents gain context only when they read this file; they do not autonomously absorb future changes.

For any significant design research or delivered UI iteration:
1. Inspect relevant existing entries to avoid duplication.
2. Research current primary sources, date them and distinguish observation from promotional claims.
3. Add a numbered R-entry under Research findings or a dated entry below with: date, source URL, claimed observation, SHUSH implication, confidence (official guidance / creator case study / user testing / hypothesis), cost, and acceptance evidence.
4. Update the component shortlist only when something is actually evaluated. Never label a preview as tested in SHUSH.
5. Keep immutable factual constraints intact unless new verified project evidence changes them.
6. Record alternatives REJECTED and why; save rejected approaches so later AI does not repeat known mistakes.
7. If actual code is implemented, write commit/branch, screenshots inspected, test results and measured bundle/performance in a dated implementation entry.
8. Revisit stale claims, license status, browser compatibility and pricing before making consequential technical choices.
9. In case of conflict: user/current repository truth and verified test evidence > latest official docs > case study > design hypothesis; do not overwrite a fact with a preference.
10. Keep root AGENTS.md short; only surface this knowledge for substantial UI, UX, motion, design or major refactor tasks.

### Template for a new learning

**ID:** RNN / date  
**Source:** exact URL; accessed date; source type  
**Observed:** what the source explicitly supports  
**Inference:** what might transfer to SHUSH  
**Recommendation:** adopt/adapt/recreate/reject with reason  
**Risk and cost:** size/dependencies/performance/a11y/license  
**Validation:** evidence needed or completed screenshot/test/metric  
**Status:** research / prototype / shipped / rejected / superseded

### Template for an implementation learning

**Date + branch/commit:**  
**Problem:**  
**Options considered:**  
**Decision and why:**  
**Actual implementation:**  
**Evidence:** named screenshots, user task results, measurements, tests  
**Residual risks:**  
**Follow-up not completed:**

## 10. Current known design tensions / decisions requiring investigation

- Rich interactive component sources vs original AGENTS.md blanket UI-library prohibition: allow controlled, licensed per-component source adaptation; avoid wholesale framework addition unless justified, reviewed and explicitly approved for the change.
- Cinematic roster vs actual seven portraits and accessibility: stable main stage and small differentiated selection, with accessible static fallback.
- Premium glass/blur vs performance: visual equivalence from gradients and pseudo-elements is often better.
- Prompt length vs AI performance: detailed research lives here; operational prompt stays concise and points here.
- Competition credibility vs design: factual gaps should use clear unknown/published status rather than beautiful fictional statistics.
- Visual experimentation vs publishability: LAB/previews until real browser and full user journeys verified.

## 11. Research source index and refresh rules

Official/primary:
- React Bits catalogue, installation and license: https://reactbits.dev/get-started/index ; https://reactbits.dev/get-started/installation ; https://github.com/DavidHDev/react-bits/blob/main/LICENSE.md
- React Bits tools: https://reactbits.dev/tools
- Uiverse and MIT archive: https://uiverse.io/ ; https://github.com/uiverse-io/galaxy
- Aceternity: https://ui.aceternity.com/components ; https://ui.aceternity.com/ai-recommendations ; https://ui.aceternity.com/pricing
- Motion layout and bundle: https://motion.dev/docs/react-layout-animations ; https://motion.dev/docs/react-reduce-bundle-size
- GSAP release + license: https://gsap.com/blog/3-13/ ; https://gsap.com/standard-license/
- Browser native transitions: https://developer.mozilla.org/en-US/docs/Web/API/Document/startViewTransition
- Performance: https://web.dev/articles/animations-guide ; https://web.dev/articles/optimize-inp ; https://web.dev/articles/optimize-lcp ; https://web.dev/articles/vitals
- Accessibility: https://www.w3.org/TR/WCAG22/ ; https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum ; https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions
- Visual and a11y testing: https://playwright.dev/docs/test-snapshots ; https://playwright.dev/docs/accessibility-testing
- UX: https://www.nngroup.com/articles/ten-usability-heuristics/ ; https://www.nngroup.com/articles/aesthetic-minimalist-design/ ; https://www.nngroup.com/articles/progressive-disclosure/ ; https://www.nngroup.com/articles/visual-hierarchy-ux-definition/
- Agent guidance: https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra

Creative case studies, not standards:
- Podium: https://tympanus.net/codrops/2026/06/23/podium-building-a-website-where-running-becomes-storytelling/
- 4WIDE: https://tympanus.net/codrops/2026/04/23/building-4wide-turning-distortion-blur-and-motion-into-a-coherent-experience/
- Bisous: https://tympanus.net/codrops/2026/06/29/inside-bisous-designing-an-editorial-experience-for-cinematic-cgi/

Refresh checked catalog counts/pricing, licenses and browser support before significant future decisions. Do not copy source page text verbatim into this file; these entries are concise synthesized lessons.

## 12. Research history

- **2026-11-17 / v1.2:** Added greenfield brand-system research from Figma and alternative-prototype evidence from NN/g; explicit instruction not to treat former SHUSH visuals as reference. No UI changes made.
- **2026-11-17 / v1.1:** Binding greenfield-visual-reset clarification. The old design has no aesthetic authority; preserve only authentic content and actual functional contracts. Legacy fonts and styling explicitly demoted to optional research inputs. 
- **2026-11-17 / v1.0:** Initial deep synthesis of UI libraries, licensing, web motion, UX heuristics, creator case studies, project constraints, accessibility, performance, testing and agent-documentation practices. No UI was implemented, no build/test run was made in this research-only change. See companion docs/SHUSH-MASTER-DESIGN-PROMPT.md for the task execution entrypoint.

## 13. First greenfield implementation — 2026-11-17

**Branch:** `shush-greenfield-luxury-rebuild`, based on research commit `7b9566e9fd033d2096aeaa4d064ccacc47842528` (PR #29 remains unmerged).

**Alternatives implemented as static HTML explorations:** `docs/design-explorations/atelier.html`, `protocol.html`, `nocturne.html`. Each includes navigation, hero, primary action, portrait material and real-player links. These are development documents, not deployed routes or functional roster replacements. Rendered comparison is **pending**: neither screenshots nor user testing could be obtained in this environment.

| Direction | Composition hypothesis | Tradeoff / decision |
| --- | --- | --- |
| Obsidian Atelier | Quiet masthead, editorial serif/sans contrast, arched portrait, restrained action | Best typographic distinction; borrow its contrast and framing |
| Amethyst Protocol | Contained navigation, dense monospace headline, bevelled CTA, framed player tiles | Clear tactical character but too close to a generic gaming dashboard; reject as overall system |
| Nocturne Cinema | Large overlapping image, expansive headline, low-contrast environmental lighting | Strong atmosphere; avoid image-dependent text contrast and dominant full-bleed photography |

**Provisional implementation direction:** Nocturne Atelier. An editorial cover with three authentic portraits, arched contact-sheet images, large neutral sans display and licensed local Lora italic as an expressive counterpoint. Explicit new compositions; the functional roster logic remains intact. The final artistic choice still requires desktop/mobile screenshot critique.

**Implemented:** new hero, desktop/mobile navigation presentation, PRESS buttons, shared dark tokens, redesigned homepage discovery/records/creator/closing compositions, and roster with a vertical desktop player index, stable arched portrait stage, separate dossier column and horizontally scrollable mobile choices. Replaced `players.css`; removed obsolete navigation definitions and the global `cozy.css` import rather than stacking more overrides. Existing standalone Premier, Creators, Drop, About and Christmas visual systems are **not** fully rebuilt. Seasonal calendar and experiences still run through their existing functional components. Non-base seasonal hero copy is preserved.

**Fonts:** display uses the platform Helvetica Neue/Arial sans stack, expressive italic uses the existing licensed local Lora files (`Lora-OFL.txt`), body retains local Manrope for readable controls. This is an explicit mixed editorial typography decision, not a claim that a new font asset was commissioned. No additional packages, copied third-party components or license obligations.

**Targeted reference verification:** web.dev animation guide https://web.dev/articles/animations-guide and W3C target-size guidance https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html opened 2026-11-17. Observed guidance: prefer transform/opacity to paint-heavy animation; AA minimum target is 24px with exceptions. Implementation inference: static lighting, opacity portrait transitions, 44px main controls, native focus and reduced-motion support. No claim of measured INP or WCAG conformance.

**Validation actually executed:** `pnpm install --frozen-lockfile`; baseline and final `pnpm run validate` pass (typecheck, seasons, Premier, competitive profiles, Unicode Drop config, tree lifecycle/visit, refinement, assets, internal links, production build, emitted route metadata/security and bundle budgets). Distribution assertion now accepts the intentionally replaced base-brand heading `Sem barulho.` while preserving existing seasonal alternatives.

| Build metric (script gzip output, kB) | Baseline | First milestone |
| --- | ---: | ---: |
| All JavaScript | 134.98 | 133.63 |
| Base CSS | 15.46 | 14.76 |
| Christmas-only CSS | 10.17 | 10.17 |
| All CSS | 43.24 | 44.73 |

These are build sizes, **not** real-user Web Vitals. No budget was raised. Total CSS increased through route-specific presentation, while eager CSS and total JS decreased.

**Browser limitation:** Playwright Chromium installation returned a truncated ZIP. The available `/usr/bin/chromium` then failed at startup with `socket() failed: Operation not permitted`. The existing five `player-select-cinema.spec.ts` cases were invoked for `mobile-390`, but all failed before running assertions because the Playwright executable was unavailable. No screenshot, responsive check, axe scan or browser journey is claimed. Existing visual baselines were not regenerated. Production and master remain unchanged.

**Required next work:** render all three explorations and selected implementation; review at desktop and mobile widths; fix any crop/overflow/contrast/focus regressions; adapt browser tests that intentionally reference retired visual hooks; complete Premier/Creators/Drop/About and seasonal visual rebuilding; run full browser/axe/reflow/WebKit and interaction/export tests; inspect intentional snapshot diffs; obtain a verified preview before release approval.

## 14. Editorial route implementation and CI findings — 2026-11-17

**Implemented in this continuation:** Creators now uses alternating portrait-led editorial spreads; About becomes a typeset story with origin, seven linked identities, verified partner and original logo download; Premier becomes a graphite two-column score ledger with documented record summary, source disclaimer and functional archive; Drop becomes an accurate product studio with front/back, live Unicode print, zoom and all existing draft/share/export/reset contracts. Replaced each route's stylesheet instead of adding an override layer. Removed retired homepage CSS while retaining the shared portrait failure state. Fixed the footer's return-focus selector and LAB brand trigger after the navigation rewrite. Restored the selected type/material tokens on the actual seasonal root and removed obsolete button overrides.

**Evidence recovered:** GitHub Actions run `44001252284` for the previous implementation. Linux and Windows validation passed. Browser shards failed; shard 1 recorded 262 passes, 112 skips and 77 failures. Many failures reference deliberately retired selectors/headings, not broken account/jersey logic. Downloaded the `responsive-qa-1` artifact and visually reviewed its mobile-390 homepage, full roster and 200% homepage screenshots. Findings: portrait-stage decorative serials were cropped by the arched frame; the enlarged headline stranded punctuation. Removed redundant decorative serials and reduced the responsive title minimum. Those fixes still need fresh rendered confirmation. The 200% test itself timed out on the retired header selector, so the screenshots must not be interpreted as proof that the automated reflow assertion passed.

**Test maintenance:** functional assertions retained while selectors now follow the redesigned interface; homepage rotating portraits use stable `data-home-roster` and `data-home-player` contracts in both base and Christmas. Replaced obsolete exact marketing headings and visual centering requirement with the current copy and nonoverlap checks. No visual snapshots accepted yet. Added responsive screenshots for the three standalone art directions. CI uploads representative desktop/mobile design evidence before its full suite; that preliminary capture cannot hide failures in the existing full test step.

**Validation:** `pnpm run validate` passes after removing obsolete homepage rules and fitting the Drop stylesheet into its unchanged budget. `pnpm exec playwright test --list` loads 1,379 tests without syntax errors. Intermediate build: all JS 133.73 kB, eager CSS 14.04 kB, Christmas-only CSS 10.17 kB, total CSS 44.75 kB gzip. These build metrics are not field performance. Previous failed budget attempts were corrected in source; no budget increased.

**Pending:** inspect current six-route desktop/mobile captures, choose between the rendered art directions, review and accept intentional visual baselines, run complete behavioral/axe/reflow/WebKit validation, refine seasonal visual composition and shared footer, and verify a preview. No production changes or release claim.

### Rendered decision and next refinement — 2026-11-17

**Supersedes the unrendered/provisional status in section 13:** GitHub Actions run `44065348020`, artifact `design-review`, generated all three concept variants and all six real routes at 1366×900 and 390×844. Its 18 representative screenshot/layout tests passed. All 20 generated PNGs were opened and inspected (six concepts plus route captures and open calendar details). Selected **Nocturne Atelier**: Atelier's portrait framing and serif/sans hierarchy, with restrained Nocturne light. Rejected the pure Nocturne overlap because its CTA crosses the player's face on mobile; rejected Protocol's generic dashboard anatomy. This is authored visual review, not user research.

**Visual corrections:** removed cropped ornamental serials from the roster frame; retained the stable stage and rapid-selection handlers. Mobile Drop now puts the actual product higher by shortening redundant cover copy. Seasonal headings can wrap instead of clipping. The footer gains a coherent editorial closing while retaining motion settings, real destinations and explicit return focus. Christmas receives a new Solstice cover, plum/warm-silver tokens, flat studio framing around the original single tree Canvas, and an original portrait contact sheet. Removed old green page-wide skins; native tree lighting/pause/rotation, seven ornaments and local postcard renderer remain intact. Seasonal scheduling code and tree lifecycle are unchanged.

**CI diagnostic:** shard 1 at `d1ee0a1` finished with 337 passes, 118 skips, 5 failures; shard 2 finished with 317 passes, 138 skips, 5 failures. In each, four failures are the intentionally redesigned visual regions and one is an actual LAB contrast bug. The trace and screenshot show a selected button's dark text on a dark hover background. Root cause: the generic `.lab-component-case button:hover` outranked its selected background. Exclude pressed buttons from that generic hover rule; keep the existing axe assertion unchanged.

**Reviewed visual references:** six exact PNGs from that run (Home viewport, customized Drop gallery, About cover, each at desktop/mobile) were individually opened before copying to the matching baseline paths. The roster full-page reference is not accepted yet because the footer is still being refined; Christmas references also require inspection. No blind snapshot regeneration or tolerance increase.

**Measured lab sample at `d1ee0a1`:** Chromium mobile viewport 390×844, CI localhost preview, existing browser context/cache, no CPU/network throttling. Six startup samples reported LCP candidates 136–200 ms, startup CLS 0 and no long tasks. These values only cover the instrumented startup interval; they are not field p75, cold-cache mobile-device results, full-session CLS or measured INP. Intro entry took about 1.54–1.62 s on unseen-intro samples, with repeat visits around 193–262 ms to settle. Source: `loading-metrics.json` in `responsive-qa-1`.

**Latest local validation after Solstice/footer work:** `pnpm run validate` passes. All JS 133.59 kB; eager CSS 14.21 kB; Christmas-only CSS 8.04 kB; combined CSS 42.81 kB gzip. No dependency/budget increase. Browser revalidation of this last refinement and remaining snapshot review are still release gates.

### Published preview and final visual corrections — 2026-11-17

**Preview verified at `e7e4511`:** https://9fe7cb2b.shush-4n1.pages.dev/ . Opened in a live desktop browser, followed Home → Roster → More, opened/closed his dossier with restored focus, followed his jersey link and edited the nickname to `SHUSH 愛` and the phrase. The live print updated with the retained player/number/size. Returned Home; screenshot saved in `docs/evidence/shush-preview-e7e4511.jpg`. `pnpm run check:preview` also passed against that exact immutable deployment: all six routes, current build asset, metadata, security/indexing policy, real 404, canonical redirect, immutable asset caching, robots and sitemap. Production was not changed.

**Complete e7 browser run `44067079347`:** 961 passed, 409 skipped (existing project-specific coverage), nine visual failures. No behavioral, axe, reflow, export, tree lifecycle or WebKit assertion failed. LAB contrast now passes. The nine failures comprise the two new roster/footer images, six new Christmas frames and a one-pixel mobile Drop gallery height/raster shift after its cover changed. The two roster captures and mobile Drop capture were opened and accepted individually; tolerances remain unchanged.

**Additional visual defect found during review:** the ice tree's crown crossed its title in the desktop frame. Do not accept those six tree references yet. Tree height now reserves space beneath the actual measured title and crown glow, recalculated on resize and after fonts load. The single Canvas, native interactions and animation lifecycle are retained. The controlled lifecycle fixture includes the title geometry. CI now uploads all three tree-scene captures at desktop/mobile alongside route/concept evidence before full QA, allowing these corrections to be inspected explicitly.

**Crown correction reviewed:** run `44068557824`, early `design-review` artifact, produced the six new exact scene images. All six were opened individually: titles now have clear separation from the crown in desktop/mobile; original lighting, palettes and controls remain. Accepted these exact images as references. A live-browser-only font fallback defect was also found in Home's decorative/link arrows; replaced those Unicode glyphs with the existing SVG arrow and two small explicit SVG paths. CI's font set had rendered the former glyphs, so the live journey was necessary to catch this. New SVG Home references still require rendered review. Local typecheck/build/budget pass: all JS 133.74 kB, CSS unchanged.

**SVG live verification:** immutable deployment https://0e14b621.shush-4n1.pages.dev/ (`b7b6ab5`) was opened in the same browser where the font fallback failed. The Home arrows now render correctly. Saved the new viewport in `docs/evidence/shush-preview-b7b6ab5.jpg`; the older screenshot records the discovered defect. The verified branch alias also passed the full HTTP smoke for this build.

**Final Home references reviewed:** run `44069039099`, early `design-review` artifact. Its only candidate mismatches were the two intentionally updated SVG Home views. Both were opened at 1366×900 and 390×844 and accepted, including correct arrow drawing, readable copy, unobstructed faces and fitting actions. All six tree comparisons and other visual regions passed that preliminary capture. No further runtime/style changes were made after `b7b6ab5`; the next commit contains reviewed references, documentation and the live screenshot only. Full CI on that commit remains the final automated gate.

## 15. Photographic fidelity and mobile product continuity — 2026-11-17

**Starting evidence:** final run `44069710120` at `666446d` passed Linux/Windows and all browser shards: 970 passed, 409 project-specific skips, zero failures; 48 preliminary capture cases and all fourteen pixel comparisons passed. The immutable preview was verified in a live browser. This closes the preceding section's pending final gate.

**New findings:** the square portrait sources were chosen using their narrow CSS box width even when `object-fit:cover` scaled them to the much taller frame. Live desktop DOM inspection at https://0e14b621.shush-4n1.pages.dev/ showed 384px candidate files in 318px/418px-tall slots; density-corrected `naturalWidth` was about 313 CSS pixels and is not the physical file width. Source assets were checked locally: 160×160, 384×384 and 768×768. In the deterministic mobile capture the old `40vw` hint could choose 160px for a 280px-tall frame. This explains visible softness; it is not a problem with the original photographs.

**Primary reference checked:** MDN responsive images https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Responsive_images and sizes https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/sizes . Observed fact: the browser chooses `srcset` using the supplied `sizes` hint and physical pixel density. SHUSH inference: for these square `cover` sources the hint must cover the larger rendered dimension, including the crop. RECREATE with existing native image attributes; no third-party component or new license.

**Implemented:** honest crop-sized hints for the three homepage portraits, seven-player contact sheet and Christmas contact sheet. The roster's 45×55px desktop thumbnails now request a 55px slot instead of `13vw`, retaining responsive density selection. Rejected always downloading 768px because the smaller thumbnails do not need it; rejected a runtime resize observer because these frame dimensions are already known in CSS. Source photos/crops and assets remain unchanged. Tradeoff: sharp hero photography can request larger image files; this is intentional and should not be described as a lower image-transfer budget. Roster thumbnail traffic decreases.

**Mobile product decision:** the former icon link jumped from the form back to the gallery. Its replacement is a labelled 44px-height `Ampliar` button in the existing sticky summary, opening the actual configured back in the native lightbox. Close/Escape restores the initiating control with `preventScroll`; the edited values, document scroll and URL fragment remain intact. Reuses the existing single lightbox rather than introducing another viewer or an oversized permanently sticky product that would crowd short screens.

**Craft and cleanup:** keyboard focus now receives the same portrait saturation, contact-sheet border and score/link emphasis as hover. Editorial arrows animate the SVG rather than moving a text span, and respect both OS reduced motion and the site setting. Removed unused former cover/navigation/opening rules from `editorial.css`, preserving live shared primitives, footer return target and match transitions.

**Validation executed:** `pnpm run validate` and `git diff --check` pass. Build gzip kB: JS 133.78 (previous 133.74), eager CSS 13.66 (14.21), all CSS 42.27 (42.81), Christmas CSS 8.04 (unchanged). No dependencies or budget increases. Added behavioral regression coverage for actual selected image resolution at desktop/mobile/2× density/WebKit and mobile preview/Unicode/flip/Escape/focus/scroll preservation. Browser execution, sharpened Home/thumbnail pixel-reference review and the updated live preview remain pending at this checkpoint.

**Rendered review at `07a61e1`:** run `44072442235`, early `design-review` artifact, generated the new Home and mobile editing journey. Opened both Home candidates and accepted their sharper physical source images as the two new exact references. The other twelve visual regions matched. Opened the mobile lightbox and return-to-form screenshots: dialog print/flip/return worked, but visual inspection exposed an existing CSS leak that the functional test did not catch. `.drop-mobile-preview small` was applying its 10px metadata style to the phrase inside the 70px jersey thumbnail, producing oversized wrapped print. Scoping metadata under `.drop-mobile-summary` restores the miniature's own proportional container-unit text and number. Added a geometric guard against overflowing miniature text.

**Live evidence:** https://2b345869.shush-4n1.pages.dev/ was opened in the same desktop browser used for the initial inspection. The center portrait now selects the full 768px source for its 418px crop while flanks retain 384px sources for 318px crops. Saved `docs/evidence/shush-portrait-refinement-07a61e1.jpg`; the mobile native preview is recorded in `docs/evidence/mobile-personalization-preview.png`. The exact immutable deployment passed `pnpm run check:preview` for all six routes and hosting/security/metadata/404/redirect/cache/indexing checks. Mobile miniature CSS recovery and full browser regression checks are the remaining gate at this checkpoint.

**After miniature scoping:** `pnpm run validate` passes again. Gzip kB: JS 133.82, eager CSS 13.66, total CSS 42.26, Christmas CSS 8.04. These are build sizes, not field Web Vitals. The live viewer already preserves accurate full-size printing; the miniature fix affects its own metadata scope only.

## 16. Roster discovery and searchable Premier archive — 2026-11-17

**Prior gate closed:** run `44073133131` at `0ac4ecd` passed Linux/Windows, 978 browser cases (419 project-specific skips), all fourteen visual comparisons and preview HTTP checks. The photographic, keyboard and mobile jersey work in section 15 is verified; its last pending notes describe earlier checkpoints.

**User-task findings:** the initial compact mobile roster reveals only part of seven choices. Keep that fast default, but provide an optional three-column overview so all seven can be found without horizontal scrolling. The ten-match Premier archive previously required manually scanning opponent names; map/outcome filters alone do not answer a visitor looking for a particular team.

**Decisions and alternatives:** add a stable `Ver os 7` toggle above the mobile selector, retaining the same seven real buttons, selection handlers and portrait stage. Closing the overview recenters the selected compact card. Rejected a second player-picker dialog (extra focus/context handling) and a permanently expanded default (unnecessary initial height). It is a view-mode toggle, not hidden extra players: use a stable name and `aria-pressed`, not disclosure semantics. Primary source: W3C button pattern https://www.w3.org/WAI/ARIA/apg/patterns/button/ (label stability and pressed state); compared with disclosure https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/ . Recreate with existing React/CSS, no third-party component/license.

**Archive:** native labelled search field and chronological ordering, combined with existing map/outcome filters. Search normalizes case, accents and repeated spaces while preserving real opponent names. Clearing recovers all ten records, newest-first order and focus on `Todas`; incoming match hashes continue to reset the explorer and reveal the real target. The map summary still reports the complete documented sample. No altered facts, new data fetch, backend or invented result. Native search semantics checked against MDN https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/search . Search uses a 16px field font and flexible sizing for narrow screens; sorting uses the existing ISO dates without mutating the source array.

**Validation executed:** `pnpm run validate`, `pnpm exec playwright test --list` (1,415 cases in 27 files), `git diff --check`. Added search intersection/normalization Node assertions and browser journeys for overview selection/collapse/recentering, stable portrait height, expanded-state axe, search/map/outcome, empty recovery, chronological order and reset. Gzip kB: JS 134.25 (previous 133.82), eager CSS 13.66 (unchanged), Christmas CSS 8.04 (unchanged), combined CSS 42.41 (42.26). Existing limits pass without new dependencies. Desktop/mobile screenshots, the intentionally changed compact roster reference, complete browser execution and the new preview remain pending at this checkpoint.

**Rendered critique at `76ad4e3`:** run `44121248432`, early `design-review` artifact. Opened the expanded seven-player mobile overview and compact full-page roster candidate. The overview keeps all seven choices within the row width, selected state clear and main portrait geometry stable. Accepted the exact compact mobile reference after reviewing the new 44px view-mode control and footer flow; the other thirteen visual comparisons match.

**Archive follow-up:** the new search journey reached the correct filtered/empty/recovered states, but its `getByLabel('Ordenar', {exact:true})` lookup timed out. Trace/snapshot show a correctly named native `combobox` with its two options; use the semantic combobox role in the test instead of matching a wrapping label's raw text including options. No app label was changed merely to satisfy the test. Actual browser search for `príme` also returned the authentic Prime Esports record. Saved `docs/evidence/shush-premier-search-76ad4e3.jpg`.

**Layout correction from the mobile screenshot:** the free-wrapping filter row consumed excessive height. Put search first in DOM/tab order; on narrow screens span search/outcome across a responsive grid and group map/date controls side-by-side when text space permits. The minmax grid falls to one column as rem-based text grows. No new source data or selection logic changes. Full browser regression and revised archive captures still pending.

**Revised mobile layout validation:** local `pnpm run validate` passes. Gzip kB: JS 134.25, eager CSS 13.66, Christmas CSS 8.04, combined CSS 42.47. No limit/dependency increase. The responsive filter grid adds only deferred Premier CSS.

## 17. Visible violet glow and actual motion — 2026-11-17

**Prior gate closed:** run `44122294459` at `53016a2` passed Windows/Linux, all three browser shards (987 passed, 428 project-specific skips, zero failures), all fourteen visual regions and the immutable preview HTTP smoke. The preceding roster/archive checkpoint is complete.

**User correction:** the result lacked the glow and animation explicitly requested. The earlier restrained-light interpretation was too quiet. Keep the new editorial composition, real content and legibility while making the purple atmosphere, luminous portraits, headline light, action reflection and entrances immediately perceptible. This direction supersedes the earlier preference for minimal ambient light.

**Implemented:** brighter violet radial atmosphere; slow drifting light and an orbit marker; staggered cover/portrait entrances after the intro overlay finishes; luminous portrait frames, selected roster stage and picker; brighter satin primary actions with a passing reflection on hover/keyboard focus; navigation light; stronger creator/product frames; section and route-heading entrances. A concrete defect was stale reveal selectors for the former Home/About markup. They now target the actual new sections. Removed dead former-perspective keyframes and overrides instead of adding another competing animation layer.

**Engineering decision:** keep glow static and animate its layer using transform/opacity. The hero's continuous layers pause outside the viewport and while the document is hidden, using a balanced IntersectionObserver/visibility listener. OS/manual reduced motion leaves the luminous static design with no animation. Focused content is immediately visible. No new dependency, pointer tracking, canvas or perpetual React state loop. Rejected a site-wide cursor spotlight: touch has no hover and every pointer event would add complexity without fixing the missing core visual treatment.

**Primary references:** web.dev animation guide https://web.dev/articles/animations-guide (prefer opacity/transform over repeatedly painting layout properties); MDN prefers-reduced-motion https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion . These inform implementation, not a claim of measured field performance. Recreated with existing CSS/React; no external component/license.

**Local verification:** `pnpm run validate` passes, including types, logic, links/assets, prerendered routes and existing bundle limits. Gzip kB: all JS 134.40 / 135 limit, eager CSS 13.73 / 15.5, Christmas CSS 8.04 / 10.5, all CSS 43.11 / 45. Existing budgets and pixel tolerances unchanged. Added real-motion browser checks for changing CSS transforms, offscreen pause, manual/OS reduction and a native Playwright video of entrance, hover, section reveal and player selection. The early design-review artifact now captures those alongside existing static comparisons. Rendered review, intentional visual reference updates and full browser CI remain pending at this checkpoint.

**Rendered review at `989819e`:** run `44128426668`, early `design-review` artifact `14349271312`. Opened all eight main-region captures individually. The two Home frames clearly show the intended violet wash, headline glow, brighter action and portrait halos; mobile type, actions and faces fit. The mobile player frame retains the seven-player control and portrait geometry with the stronger light. Accepted only those three mismatching exact `*-actual.png` files; the other eleven pixel comparisons remain unchanged. The desktop roster, desktop/mobile Drop and About were also inspected, preserving image/print detail and legibility.

**Motion proof:** native Playwright recording, 8.52 seconds, sampled at 1/3/5/7 seconds for review: initial identity, luminous Home, hover response, roster selection. `docs/evidence/shush-glow-motion-989819e.mp4` is a compressed copy of the real browser WebM, not a generated concept. The live immutable preview https://01a6263a.shush-4n1.pages.dev/ was opened and its real hero computed style confirmed `violet-drift` running. Clicking the actual motion control changed that to `none` while preserving headline text glow; restored normal motion afterward. Saved the same live viewport bytes as `docs/evidence/shush-violet-glow-989819e.jpg`. The exact deployment passed HTTP checks for all six routes, security, metadata, canonical redirect, true 404, current assets, robots and sitemap. No app code changed after this rendered review; the following commit contains only reviewed references and evidence/documentation. Full CI remains the final gate.

## 18. Portrait folio and silver-satin refinement — 2026-11-17

**Previous gate closed:** `4b6e8ec`, run `44129321677`, passed Windows/Linux, all three browser shards (991 passed, 442 project-specific skips), all fourteen visual comparisons and preview HTTP smoke. Section 17's pending note is an earlier checkpoint.

**New user direction:** more luxury. Retain the requested glow and actual motion, but make the framing, type and materials feel authored. The rectangular hero frames and bare navigation links were still visually basic. This pass refines the selected design rather than changing the product or inventing luxury claims.

**Research:** creator case study by FLOT NOIR, MERSI, published 2026-07-27, https://tympanus.net/codrops/2026/07/27/between-print-and-digital-the-making-of-mersis-website/ , retrieved 2026-11-17 through search (direct open returned 403). Observed: the author connects its presentation to print composition and frames vertical photography deliberately. SHUSH inference: stronger portrait framing and typographic rhythm are more useful than simply increasing bloom. No claim of measured UX improvement. Recreate a SHUSH-specific folio using authentic team assets; no copied source/component or additional license.

**Compared approaches:** rejected gold ornament and luxury-product language because they conflict with SHUSH's purple identity and honest micro-org. Rejected a full-screen shader/extra loader because it adds cost before content. Selected architectural portrait framing, pale metal edges and satin actions, retaining the already requested violet atmosphere. The real browser capture is the acceptance gate, not the descriptive concept.

**Implemented:** taller-looking central arch within the same stable image dimensions, finer inset borders and serif portrait names; rebalanced headline type and gallery widths; a small authentic-logo seal and pt-PT gallery label; grouped navigation with an illuminated selected capsule; pill-shaped beveled satin actions with the existing reflection/press behavior; refined contact-sheet typography and framed closing links; richer plum footer with lighter type. Reworked existing selectors rather than appending competing overrides. Shared satin/edge tokens, no new dependencies/assets/runtime effects. No face/image distortion, new interactions or data changes.

**Local checks:** `pnpm run validate`, `git diff --check` pass. Gzip kB: all JS 134.39 (previous 134.40), eager CSS 13.97 (13.73), Christmas CSS 8.04 (unchanged), all CSS 43.70 (43.11). Existing budgets unchanged. Browser rendering, mobile/reflow review, deliberate visual reference acceptance and complete CI remain pending.

**Rendered critique at `00cd53f`:** early artifact `14368165754`, run `44169602628`. Opened desktop/mobile Home viewport and full-page Home/Roster captures. The new arch, inset edges, selected navigation, satin action and footer form a consistent system; closing links read as composed destination panels. The four intentional Home/Roster reference mismatches require reviewed updates. Crucially, randomized full-page Home showed Th0maz wrapping in a narrow mobile flank and approaching the desktop arrow. Corrected the name size using each portrait's own inline container, keeping it on one line and reserving desktop arrow space. Extended the existing crop check with a deterministic longest-name flank and real rendered text bounds at 320/390px, desktop, 2× density and WebKit. The initial Home candidates are superseded; do not accept them before the name fix is rendered.

**External validation blocker:** the unchanged build dependency `picomatch` was newly reported by CI audit as two high findings (Vite direct and tinyglobby paths). Advisory https://github.com/advisories/GHSA-fc5q-39xc-vjpf , reviewed/updated 2026-11-17, lists versions through 4.0.7 and no patched version. It concerns crafted repeated extglob patterns in Node. The static browser app does not import picomatch; it belongs to build tooling. Left the security gate enabled and did not add an ignore/raise its threshold. Track as an unresolved upstream build-tool advisory; do not describe the complete workflow as green. Windows validation and exact immutable preview HTTP smoke passed. Other browser shards are still running at this checkpoint.

**Name-fit review at `8311c28`:** early artifact `14367437914`, run `44170748638`, contains only the four intended visual-reference failures; no motion/crop/name-fit journey errors. Opened the revised two Home candidates individually. The serif names fit the unequal frames; the center retains its prominence, with appropriate smaller flank captions. The two Roster candidates are byte-identical (SHA-256 checked) to the already inspected preceding captures. Accepted precisely those four actual files; the other ten pixel comparisons retain their references and tolerances. Source code is now frozen for this pass.

**Verification and evidence:** local `pnpm run validate`, browser collection (1,433 cases, 28 files), `git diff --check` and the exact immutable preview https://5629d429.shush-4n1.pages.dev HTTP smoke pass. Updated gzip kB after the name-fit test/source change: JS 134.41, eager CSS 13.97, Christmas CSS 8.04, all CSS 43.72. Preserved all limits. `docs/evidence/shush-silver-satin-8311c28.mp4` is compressed from native browser capture of this code. The following commit contains reviewed references, the recording and this evidence note only. Full browser completion and the unresolved upstream audit must be reported separately; do not equate the audit failure with an interaction failure or claim a fully green workflow.

## 19. Capa de campanha e seleção de jogadores · 17 de novembro de 2026

A avaliação do utilizador substitui a aprovação visual das secções 17 e 18. O tríptico em arco continuava a parecer uma lista de perfis. O anexo original pede uma identidade legível no primeiro enquadramento, com e sem animação.

O estúdio Podium descreve transições em que a própria imagem transporta a mudança entre planos. O autor do caso Motoyoshi Takamitsu descreve a passagem entre visão de conjunto e fotografia isolada. A aplicação à SHUSH é uma escolha nossa: manter um retrato principal e ligar a seleção do índice ao retrato e ao perfil. Não incorporámos código, fotografias ou dependências das referências. Fontes: https://tympanus.net/codrops/2026/06/23/podium-building-a-website-where-running-becomes-storytelling/ e https://tympanus.net/codrops/2025/03/17/case-study-motoyoshi-takamitsu/.

[Três estudos com os retratos reais em desktop e telemóvel](design-explorations/campaign-explorations.jpg). A capa de campanha ganha a Home pela leitura imediata da figura contra as letras. A régie separa a seleção da consulta e informa o roster. A estampa coletiva tem demasiados rostos em competição para servir de abertura. A malha de sete conserva valor como índice mais abaixo na página.

A capa usa uma silhueta por jogador sobre a palavra SHUSH e um cenário abstrato de tecido acetinado criado para o projeto. As sete máscaras acompanham o quadrado das fotografias originais. As miniaturas ficam disponíveis como ligações diretas por toque ou teclado. Um único plano de luz abrandado para fora do enquadramento complementa a opção de movimento reduzido. O arquivo Premier abre com um resultado real datado, o Drop com o produto, os canais com as duas pessoas e a história com o símbolo e o ano de origem. Sem novas dependências. Validação local: 133,98 kB de JavaScript e 43,21 kB de CSS totais em gzip, textura WebP de 36 416 bytes. As maquetas são estudos, separados das capturas de browser.
