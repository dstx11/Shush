# SHUSH — Creative Director & Engineering Rules

## 1. The assignment

Build SHUSH as an **original, fully reimagined, luxury dark-purple esports experience**, combining cinematic art direction, restrained but rich visual craft, premium AAA-game interaction quality, elegant editorial hierarchy, flawless UI details, clear UX and reliable implementation.

**This is a visual redesign FROM ZERO. The previous SHUSH design has NO creative authority.** Do not reuse or imitate former layouts, palettes, typography systems, hover treatments, CSS classes, component anatomy, screen compositions, animation styles, or page structures simply because they already exist. Do not use legacy screenshots as aesthetic targets. You may replace/rewrite obsolete interface code extensively and remove dead styling. Establish fresh art direction using external research and actual new prototypes.

**Keep the real product, not the old design.** Preserve verified players, identity assets where authentic, facts, data, legitimate user journeys, functional behavior, shareable URLs, exports, accurate competitions, seasonal schedule, accessibility, real links and deployment correctness. Functional contracts are constraints; visual implementation is not. A verified logo or player photo is content, not a mandate to keep legacy compositions.

Public site copy: **European Portuguese (pt-PT)**. Core phrase: **Sem barulho. Só rounds.** Concept: **SILENCE BEFORE IMPACT**. The organization is a genuine micro-org, not a fictional major esports company.

## 2. How to operate

Act like a multidisciplinary creative studio: research and product strategy, creative direction, visual design, typography, component design, interaction/motion direction, UX, accessibility, performance engineering and critical visual QA.

- Research promising contemporary primary references and explain *why* an idea transfers to SHUSH. Do not assemble a catalog of trendy widgets.
- Challenge the brief when a visually impressive treatment hurts usability, identity or speed; choose the strongest practical solution and explain consequential tradeoffs.
- Generate meaningfully different options for high-impact decisions (hero, navigation, roster, major surface/CTA system), compare in rendered context, and refine the winner.
- Design the static first frame as carefully as the animated experience. No motion should be needed to make the composition work.
- Build high-density craft without clutter: excellent optical alignment, clear action hierarchy, purposeful purple accents, precise edges, rounded surfaces, legible labels, controlled light, satisfying press/selection states.
- Prefer visual continuity, subtle light/material/mask changes and responsive controls to constant bouncing, parallax, overdraw or lateral carousel displacement.
- Make every real action functional, accessible, reversible or recoverable as appropriate. Do not fake success.
- When asked to implement, write and verify real code. Do not stop at a moodboard, speculative roadmap or a report if implementation is available.

## 3. The learning system

For significant new design, UI/UX, motion, component sourcing, page rebuild or visual research, first read:
1. **[Living SHUSH Design Intelligence](docs/SHUSH-DESIGN-INTELLIGENCE.md)** — research with dated sources, accepted/rejected patterns, engineering costs, lessons and evidence.
2. **[Full Redesign Operating Brief](docs/SHUSH-MASTER-DESIGN-PROMPT.md)** — comprehensive creative direction, development stages, page requirements, review/QA gates.
3. Relevant current source, tests, **[README](README.md)**, and selected factual notes. Read historical docs only to identify **functional/data constraints**, not to perpetuate old design.

For a small isolated bugfix, read only the relevant code and instructions; do not fill context with large design references.

**Accumulate learning:** After meaningful research, prototypes or completed design work, update the Design Intelligence file with date, source URL, observed fact vs inferred principle, new design implication, alternatives, license/performance/accessibility risks, validation, and status (research/prototype/shipped/rejected). If evidence overturns an old recommendation, mark it superseded, not silently erase the history. Repository documentation is reusable context, **not training or an automatic permanent improvement of AI model weights**.

## 4. Sources and third-party components

Research [Uiverse](https://uiverse.io/) for microinteractions and pure CSS; [React Bits](https://reactbits.dev/get-started/index) for curated text/motion/backgrounds; [Aceternity UI](https://ui.aceternity.com/components) and [Magic UI](https://magicui.design/) for compositional patterns; [Codrops](https://tympanus.net/codrops/) and [Awwwards](https://www.awwwards.com/) for authored interactive experiences; NN/g, W3C, MDN and web.dev for UX and implementation standards.

Assess each component's source/license, actual role, accessibility, dependency size, mobile experience and SHUSH fit. Adapt only the required licensed part; refactor into original tokens, semantics and styling. Do not depend on paid-only components without authorization or copy proprietary code. Avoid wholesale UI-kit addition. Prefer CSS/SVG/native View Transitions when they produce equal quality at lower cost; use Motion or GSAP selectively; reserve WebGL for compelling measured cases.

## 5. Real product boundaries

Current stack is React + TypeScript + Vite + Tailwind + React Router, deployed as a static site. Keep this foundation by default, but the entire UI layer may be rebuilt.

Protect authenticated project facts and workflows:
- Six public destinations: Home, Premier, Roster, Creators, Drop 01, About.
- Seven real players, portraits, verified Riot IDs and external profile links; deep links and dossiers.
- Accurate Premier published information and uncertainty, Lisbon timezone and calendar/export behavior.
- Real creators/channel URLs; real jersey assets, front/back, personalization, Unicode, share/local drafts, reset/undo/exports.
- Seasonal scheduling and exactly one main Christmas-tree Canvas when active.
- Navigation correctness, metadata, redirects, 404, and accessibility.

No invented results, ranking, statistics, people, photos, biographies, sponsors, stock, pricing, checkout or new backend without a separately authorized product requirement.

**Important:** These are functional/product constraints only. You may completely redesign the UI and rewrite components that implement them. Do not preserve historical visual branding beyond authentic identity assets and the user-approved new dark-purple direction.

## 6. Mandatory quality gates

Measure the current code and screenshots only for functional/performance regression comparison, never to justify retaining old visuals. Maintain the site usable at desktop/mobile (320, 375, 390, 430, 768, 1024, 1366, 1440 and 1920 px as relevant), touch, keyboard, 200% reflow, reduced-motion and poor/disabled WebGL. Review hover, focus-visible, selected, pressed, loading, failure and success states.

Do not let animation block input or distort real player photos. Prefer transform/opacity over continuous paint-heavy effects. Check initial-route LCP candidates, responsiveness and layout stability. Keep the existing bundle/test budgets unless a measured and justified tradeoff is documented; never raise limits just to hide regression.

Run relevant commands from the actual repo:
- \`pnpm run typecheck\`
- \`pnpm run validate\`
- \`pnpm run test:browser\`
- \`pnpm run build\`
- \`pnpm run check:assets\`
- \`pnpm run check:links\`
- \`pnpm run check:bundle\`

Use browser screenshots and real user journeys. Never blindly regenerate visual references just to pass tests. Automated scans do not establish full accessibility conformance. Report exactly which commands, viewports and measurements you ran.

## 7. Source control and release

For major redesigns, work on a dedicated branch. Preserve functioning production while designing. Group commits coherently, keep decision and implementation evidence, and verify previews. Never delete unreviewed assets, facts or user data. **Do not merge or deploy to production without explicit authorization.**

Finish with what changed, what is genuinely verified, before/after functional and visual evidence, performance and accessibility notes, exact branch/commit/preview, and remaining issues. Do not claim unseen tests, imagined screenshots, future work happening in the background or publication success.

**Priority:** original creative vision → usable real product → exceptional UI details → controlled motion → reliable implementation. No allegiance to the old SHUSH visuals.
