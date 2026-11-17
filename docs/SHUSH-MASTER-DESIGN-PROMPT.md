# SHUSH — Master Creative Director / Full Remodel Execution Prompt
Version: 8.0 | 2026-11-17 | For a coding/design agent with repository access

## THE JOB

Remodel the real SHUSH website end-to-end: https://shush.pt/ , repository https://github.com/dstx11/Shush . The target is **quiet luxury x cinematic VALORANT esports x tactile AAA game UI**, with dark graphite/plum, restrained amethyst, refined silver highlights, intentional editorial composition, exceptional small UI details and measurable usability.

**This prompt is an execution brief, not permission to publish.** Use a dedicated branch and a verified preview; do not deploy to production without explicit authorization. Preserve the small, honest identity of SHUSH: **Sem barulho. Só rounds.** Never fake giant-org status, stats or content.

Before substantial design work, read:
1. AGENTS.md (binding repository conventions).
2. docs/SHUSH-DESIGN-INTELLIGENCE.md (evidence-linked living research, choices, costs and reusable design principles).
3. README.md and docs/experience-overhaul-2026-11.md (actual behavior, preserved features, historical tests and limitations).
4. Relevant source/data and tests for the feature being changed.

These documents are not a substitute for inspecting the current branch and measuring the live build. Resolve conflicting historical facts using current code and confirmed records. Use only the relevant portions of the knowledge base for the current phase. Do not dilute your context with unrelated references.

## ACT AS A CREATIVE STUDIO, NOT A COMPONENT INSTALLER

Use the combined standards of: creative director; art director; product designer; UX researcher; interaction designer; motion director; creative developer; accessible front-end engineer; performance engineer; visual QA reviewer.

Their jobs in practice:
- Art direction defines a coherent visual concept and what NOT to add.
- Product design makes routes, tasks, content and actions easy to find and use.
- Motion reveals hierarchy, feedback and continuity rather than showing off.
- Engineering ships maintainable React/TypeScript, not a tangled demo.
- QA checks screenshots, user journeys, focus, real data and actual load costs.
- Critique compares different plausible designs and eliminates weaker ideas.

Never mistake a premium aesthetic for a usable experience. Never choose by library popularity. Never adopt the first implementation uncritically.

## RESEARCH, LEARN, ACCUMULATE

Research current primary sources for consequential claims and UI components, prioritizing official docs, maintained source and licenses. Draw inspiration from Awwwards, Codrops, creator case studies and real interactive sites, but do not blindly reproduce their visual design or code.

Preferred role split:
- **Uiverse** (https://uiverse.io/): micro-controls, button feedback, switch/checkbox, loaders, tooltips and carefully chosen pure CSS details. Check original component provenance and MIT notices.
- **React Bits** (https://reactbits.dev/get-started/index): cinematic text, controlled visual effects, distinct atmospheres, backgrounds and experimental components. Review installation/licensing; select TS/CSS or TS/Tailwind version of individual components. Preserve MIT + Commons Clause notices and third-party licenses.
- **Aceternity** (https://ui.aceternity.com/components): free accessible candidate cards, navbars, lighting and layout patterns; distinguish paid blocks and interactions.
- **Motion**: only when shared layout/state transition needs it and measured size is acceptable.
- **GSAP**: only if complex choreography warrants its runtime cost; use its standard license.
- **Native CSS/SVG/WAAPI/View Transitions**: default for simple or equivalently convincing effects.
- **Three.js/WebGL**: exceptional, lazy-loaded signature effect only if it has clear visual value above optimized static/CSS alternatives.

**Every significant discovery must be recorded** as a dated evidence entry in docs/SHUSH-DESIGN-INTELLIGENCE.md with URL, observation, SHUSH application, alternatives, cost, confidence, license and validation status. Update/revise stale entries, keep rejected ideas and reasons, and do not claim unrun tests or unseen browser behavior. Accumulation means verified reusable project context, not model retraining.

## BASELINE BEFORE MASS CHANGE

Inspect current branch, package.json, AGENTS.md, README, actual source layout, real assets, visual snapshots and current CI checks. Confirm all six public routes and their existing content/state behavior. Compare actual production and local baseline screenshots. Note current bundle size; the historical all-JS gzip budget was ~135 KiB near saturation, and it must NOT be assumed current or enlarged casually. Check that the intro, router focus/scroll restoration, seasonal state and one Christmas-tree Canvas still work. Preserve everything real and authorized.

Create a branch and keep commits scoped by working phase. Do not mutate master or deploy. Keep an implementation ledger noting researched, designed, implemented, validated, rejected and pending decisions with exact evidence. Do not stop at a roadmap when implementation is possible.

## THE ART DIRECTION

Creative thesis: **SILENCE BEFORE IMPACT**.
Default state = stillness, clarity, contrast, technical precision. Interactive state = precise, short light/pressure/selection response. Rare narrative moments = a controlled cinematic expansion.

Visual DNA:
- black/obsidian, midnight plum, neutral graphite, smoked acrylic and muted satin purple
- carefully rationed amethyst/lavender accents, pale off-white text, optional silver/metallic edge
- clean but visually rich; luxury materials, not endless glass cards
- optical typography, deliberate cropping of real portraits, editorial asymmetry with consistent grid anchors
- subtle micro-bevel, border highlights, layered shadows, meaningful depth, polished rounded corners
- atmospheric light and texture; no neon overuse, random purple blobs or cyberpunk template
- sparse, legible gaming-style metadata and interactive status, never invented competitive data.

Initial candidate palette, not approved values: #09070F, #120D1D, #1C1628, #292039, #3A2D49, #9268C7, #C5ABE6, #F3EEF7, #B7ACBF. Use semantic tokens; inspect real browser contrast and color relationships; prefer consistent ramps (OKLCH where useful). Keep existing brand assets and evaluate actual fonts before adding any.

Define at least these material roles: matte structural, satin content panel, smoked glass overlay, selected illuminated control, tactical Premier surface, product studio. Every role must have a coherent idle/hover/focus/selected/disabled treatment.

Define one consistent set of radii, space, type, elevation, border, color, z-index and motion tokens; variations should be purposeful, not arbitrary.

## THE COMPOSITION SYSTEM

Each viewport has one dominant focus and one clear next action. Combine grid discipline with deliberate page-specific composition. Use contrast, size, proximity, framing and negative space to create hierarchy. Page text should be short, accurate, in **European Portuguese**, with strong editorial display typography and clear user-interface labels.

Do not default to generic centered SaaS hero, equal-weight bento cards everywhere or huge whitespace for its own sake. Build first static screenshot before animation; verify with squint/blur hierarchy check.

## CUSTOM SHUSH INTERACTION SIGNATURES

Design and test original systems, not a random buffet:
- **LUMEN:** a directional highlight and edge-light vocabulary for active/focus controls.
- **PRESS:** physically satisfying micro-compression, shade and reflection for action.
- **TRANSFER:** continuous selected indicator for nav/tabs/player selectors where context benefits.
- **APERTURE:** precise mask reveal for rare hero/portrait transitions.
- **SIGNAL:** consistent busy/success/error/empty/confirm feedback with local relevance.
- **ATMOSPHERE:** one coherent ambient material, adapted subtly by major page/season.

Use only the best 2–4 signatures when a smaller set is stronger. No persistent custom cursor, no multi-shader extravagance, no infinite animation under every card, no dramatic movement of whole sections for hover.

## COMPONENT QUALITY CONTRACT

Before integrating any library component:
1. Identify the real user task and visual role.
2. Compare 2–3 different concepts for major UI decisions (hero, roster, nav, signature button), not superficial color variants.
3. Check source, rights, maintenance, semantics, dependencies and expected size.
4. Prefer copy/adapt individual licensed source files over installing an entire UI framework.
5. Convert to project tokens/variants, ensure strict CSS scoping and TypeScript quality.
6. Provide complete idle, hover, focus-visible, press, selected, busy, success/error, disabled behavior wherever applicable.
7. Inspect in production-like layout at desktop and mobile; measure expensive paint, jank and layout changes.
8. Register ADOPT/ADAPT/RECREATE/COMBINE/REJECT in the design knowledge base with evidence.

Uiverse is for small tactile improvements; React Bits is for rare signature motion and backgrounds; Aceternity for compositional patterns. The resulting UI must NOT reveal its component-library origins.

## MOTION DIRECTOR REQUIREMENTS

Use motion to communicate continuity, user input, hierarchy and brand. Geometry stays largely stable; light, material, mask and opacity carry most movement. Prefer CSS transforms/opacity and measured compositor-safe effects over animating blur/filter/shadow on full-screen regions.

Draft timing families (tune, not hard targets): instant response 80–140ms; hover 150–260ms; selection 200–350ms; panel/shared layout 300–600ms; rare cinematic 500–900ms; ambient 8–30s. Never require a user to wait for a transition before another action.

All interactive animation must be interruptible; fast player switching must cancel stale transitions and image requests. Respect reduced motion and existing site setting. Heavy visual scenes pause when hidden or off-screen, and have attractive static fallback. Do not scrolljack or intercept native browser actions unnecessarily.

For transitions evaluate native View Transitions first, then Motion layoutId or GSAP if justified. Preserve scroll restoration, query-parameter navigation, focus and browser history.

## PAGE-BY-PAGE EXPERIENCE BLUEPRINT

### HOME — THE IDENTITY STAGE
Build a beautiful first frame: authentic SHUSH logo, confident typography, dark-purple light, carefully cropped real assets, one clear CTA and concise supporting information. Compose an intentional editorial journey:
identity -> verified Premier context -> authentic roster discovery -> creators -> premium Drop 01 -> memorable closing.
Use variation of layout, not repetitive card rows. One restrained atmospheric scene, no slow forced loading. Optional brief text reveal after meaningful content appears. The hero must still feel finished with animations disabled.

### ROSTER — THE FLAGSHIP CHARACTER SELECT
Treat seven actual players like a polished AAA character-selection UI, not a corporate people directory. Compare 3 viable compositions: tactical tile rail, editorial large-portrait hybrid, compact game selector. Select by speed, focus hierarchy, actual portrait quality and mobile discoverability. Keep a **stable stage**: swapping players changes portrait, spotlight, name, number, role and real dossier information using layered opacity/mask/light, not large sideways movement. Repeated selection is instant and safe. Preserve seven IDs, real portraits, ?player deep link, keyboard/Home/End, swipe + visible alternatives, dossier modal, tracker/copy/share, focus restoration. Make the selected state unambiguous. Mobile must advertise offscreen choices.

### PREMIER — THE TACTICAL ARCHIVE
Build a precise competitive information environment. Clear true season, published phase, verified records, wins/losses, result date, source and unknown outcome. Develop legible score cards and accessible expandable details, restrained filtering and optional chronological timeline. Do not imply an active league, invent game data, or infer elimination from missing results. Preserve Lisbon dates and tentative calendar exports. Optimize for rapid retrieval of a documented result.

### CREATORS — HUMAN EDITORIAL
Real people and channels; distinct portrait-led compositions with consistent action hierarchy. No fictional clips or popularity indicators. External platform actions clearly labeled and keyboard reachable. Atmosphere and materials may differ from Premier but retain SHUSH tokens.

### DROP 01 — HONEST PREMIUM PRODUCT STUDIO
A clean and accurate front/back jersey presentation with studio lighting, zoom and responsive preview; no invented 3D model. Personalization needs instant visual updates, pt-PT labels, mobile-friendly inputs, correct Unicode, reset/undo, local draft, copy/share/PNG/TXT with real loading/error/success feedback. No fake checkout, pricing or stock. Keep informative text concise and near controls.

### ABOUT — STORY THROUGH FACTS
Short authentic micro-org history, understated manifesto, accurate partner and brand downloads. Build editorial chapters with purposeful transitions and large typography, not a fictional triumph montage.

### SEASONS AND CHRISTMAS — LIVING, NOT LOUD
Theme updates adjust accents, light and textures while keeping the same material system. Keep exactly one main Christmas-tree Canvas and preserve its lifecycle, keyboard, reduced-motion, performance and mobile behavior. Decorative atmosphere must not cover information.

## QUALITY OF SMALL DETAILS

Review 30+ concrete checks at component and page level:
- optical icon/text alignment; accurate stroke size; stable baseline and cap-height rhythm
- consistent primary/secondary action grouping; correct pressed state; no active-vs-hover confusion
- correct border thickness across corners; shadow inset continuity; gradient direction and transparency
- line breaks; comfortable text length; real mobile input font sizes; consistent tabular score digits
- image crop and fallback; no face distortion; no product texture falsification
- even card padding; page container anchors; touch target size; viewport safe areas
- tooltip and toast placement; meaningful local confirmation; screen-reader state announcements
- click targets matching apparent controls; no fake clickable decorations; correct disabled semantics
- graceful scroll and focus behavior; Escape; back/forward; quick repeated input; no stale state
- initial paint without opacity-blackout; no 404 flashes; loading placeholders with fixed geometry
- mobile menu no collision at 200% reflow; no horizontal overflow; no duplicate tree
- legible dark-mode color combinations; secondary text remains readable; verify under real shaders
- terminal request boundaries; no unauthorized external API, fake statistics, or proprietary source copying.

## USER JOURNEY TESTS

Must succeed, with desktop and mobile variants:
A) new visitor discovers purpose and one useful destination;
B) visitor finds all seven players, switches rapidly, opens dossier, copies Riot ID and shares player URL;
C) visitor finds one confirmed Premier result and recognizes its season/provenance;
D) visitor visits verified creator channel;
E) visitor customizes jersey, flips view, exports/retries, and restores a local draft;
F) visitor uses keyboard-only navigation, Escape and back/forward;
G) visitor uses reduced motion and still accesses every function;
H) visitor lands directly on a deep link and sees correct metadata/content;
I) seasonal and Christmas states run without duplicate Canvas or disabled controls.

Do not judge success by screenshots alone. The aesthetic-usability effect can mask task failures.

## ACCESSIBILITY STANDARD

Target WCAG 2.2 AA. Correctly apply its 24x24px minimum target size rule with exceptions; aim ~44x44 for prominent touch controls where practical. AAA reduced animation guidance is useful, but do not mislabel it as AA. Check labels, semantic controls, tab order, focus not obscured, escape, dialog trapping, focus restoration, contrast, pointer alternatives and screen-reader statuses. Automated axe is not full WCAG certification.

## PERFORMANCE BOUNDARIES

Maintain or improve current performance; measure first. Avoid justified-looking regressions. Keep initial-route JS as light as possible; review actual gzip totals/chunks and the existing check:bundle. Use native CSS/WAAPI for small interactions, conditional heavy effect lazy imports. LCP hero images should not be lazy. Use Chrome performance traces including paint flashing, throttling and mobile WebKit. Core Web Vitals field targets at p75: LCP <=2.5s, INP <=200ms, CLS <=0.1. Record lab vs field distinction, device, cache and test conditions. Do not artificially raise limits to call the work successful.

## CRITIQUE LOOP AND ACCEPTANCE

For each major feature, run:
1. Inspect actual state and real data.
2. Research references and identify an underlying principle.
3. Explore different designs and document why one wins.
4. Implement stable functional base (not screenshot-only).
5. Render and inspect desktop, mobile, static, hover, selection and focus.
6. Critique hierarchy, aesthetics, task friction, originality, cost and coherence.
7. Correct weaknesses rather than layering CSS overrides.
8. Test user journey, accessibility, reduced motion and performance.
9. Commit validated work and update research/decision knowledge.

A visual quality matrix is useful: hierarchy, brand distinction, typography, materials, controls, motion, task efficiency, mobile, accessibility, runtime. Scores are subjective hypotheses, not fabricated measurement; critical failures always block release.

## EXECUTION PHASES

0. Current branch/code/visual/bundle baseline; inventory and release guardrails.
1. Focused primary research and design candidate register; first accumulated knowledge update.
2. Design language: semantic palette, material/radius/spacing/type/border/state tokens.
3. Component primitives: buttons, controls, navigation, status, panels; CSS refactor.
4. Motion and view-transition primitives with accessible reduced mode.
5. Intro + global nav + first-frame homepage redesign.
6. Roster flagship stage/dossier/selection (highest interaction priority).
7. Premier competitive information presentation and chronology.
8. Creators and About editorial compositions.
9. Drop 01 honest premium product studio and functional configurator.
10. Seasonal and Christmas integration, single Canvas.
11. Original SHUSH signatures, final optical QA, mobile and performance.
12. Complete regression verification, screenshot review and preview delivery.

Each phase must produce code and testable evidence, not a hypothetical moodboard. Keep documentation proportionate; do not get stuck in endless exploration.

## RELEASE GATES

Run relevant existing commands, including pnpm run typecheck, pnpm run validate, pnpm run test:browser, pnpm run build, pnpm run check:assets, pnpm run check:links, pnpm run check:bundle and preview verification when available. Preserve the current suite's checks for seasons, Premier, profiles, Drop, tree and visual references. Inspect diff screenshots rather than blindly updating baselines; use consistent environment, viewport, fonts and time.

Work on an isolated branch. Do not publish to production until authorized. Do not conceal failure. Deliver actual code, exact commit/branch, verified preview if available, measurements with method and before/after screenshots. Update docs/SHUSH-DESIGN-INTELLIGENCE.md with evidence-backed lessons, explicit rejected alternatives and remaining hypotheses.

## FAILURE CONDITIONS

Reject a result with:
- generic SaaS or cyberpunk-template identity; endless shiny bento cards; purple glow everywhere
- a new motion style in every section; heavy always-on shaders; custom cursors that obstruct use
- inaccurate content or fake stats, events, sponsors, esports results, products or checkout
- roster portrait sliding sideways in an unstable stage or inaccessible selection
- broken deep links, exports, seasons, one-tree requirement, keyboard, focus, reduced-motion
- slow or blocked page navigation, lengthy intro, excessive animation cost, silent errors
- UI library pasted without integration, unsafe licenses, duplicative dependencies
- arbitrary CSS overrides or code without tests, visual review or truthful evidence
- a research-only document presented as completed full remodel.

## FINISHING STANDARD

Make the website **visually extraordinary while operationally quiet**. Refine the smallest border, angle, baseline, press feedback, loading state, crop and focus. Keep stronger visual moments rare enough to have impact. Improve the real user's tasks, not just the designer's screenshots.

**Research -> decide -> craft -> implement -> render -> critique -> optimize -> test -> record evidence -> deliver.**

Begin with the actual code and relevant knowledge. Continue through a complete working release candidate within the available execution environment; if tooling/time blocks full completion, deliver coherent verified work and honestly list what remains. No background delivery promises.
