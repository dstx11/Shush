# SHUSH — design evolution

Research and implementation audit: 7 October 2026. Source of truth: the existing repository, its real assets and static data. This evolution continues the professional rebuild; it does not replace the application or add services.

## Research and choices

| Reference inspected | Useful principle | SHUSH decision |
| --- | --- | --- |
| [Team Liquid](https://teamliquid.com/) | Competition schedule, editorial updates, team identity and jersey have distinct destinations; an empty upcoming schedule is explicit. | Keep the Match Center as the competitive source. Never turn missing results into elimination or invent a next match. |
| [G2](https://g2esports.com/) | Teams, creators and videos are easy to discover alongside products. | Connect the real creators to their player selection and their external channels; retain the six clear public destinations. |
| [100 Thieves](https://100thieves.com/) | Apparel carries brand identity; teams and creators remain separate, findable areas. | Let the actual jersey carry the visual weight. Keep one manual Drop, with no catalogue, cart or fictional commercial details. |
| [Fnatic](https://fnatic.com/) | The rendered desktop homepage uses real photography, strong display type and compact competitive context. | Retain Space Grotesk, Manrope and IBM Plex Mono. Use larger identity type and shorter copy, with real avatars and initials where imagery is missing. |
| [Riot Games](https://www.riotgames.com/en) | Editorial destinations reflect available games and stories. | No news feed: there is no real maintained editorial dataset in SHUSH. |
| [Web Vitals](https://web.dev/articles/vitals) | Loading, interaction and layout stability must be measured separately. | Retain image dimensions, preload, route splitting and bundle budgets. Remove delayed opacity reveals on the critical hero. Bundle size alone is not a Core Web Vitals result. |

The references supply principles, not layouts, imagery or copy. Fnatic was also inspected visually in the live browser. Text retrieval from other references supports information architecture, not a claim of complete visual/mobile inspection. The Apeks homepage is inactive; it was not treated as a current design reference. No unsupported trend claim or borrowed brand asset is used.

## Direction: less noise, more identity

The name and existing sentence already define a credible direction: quiet confidence before the round. Black space, a restrained purple accent, large type, thin rules and the existing jersey are the main materials. The hero puts the sentence above the conventional copy/image pairing. On smaller screens, the sentence, jersey and introduction form separate reading stages. No generated imagery, particles, video substitutes or new font dependency.

The Home remains short: identity, competitive context, players, creators and a compact Drop destination. About describes a small organisation directly. Repetitive explanations about the website itself are replaced with concrete destinations. Match Center language remains deliberately careful about incomplete published data.

## Implemented product decisions

- Roster selections use `?player=<real-id>`, so Home and Creators can open the correct player. Selection replaces the query without resetting scroll; invalid IDs safely select the first player.
- Creators have distinct channel and roster links, avoiding a whole-card link with several competing destinations.
- Real roster numbers replace positional indexes. No country, biography, statistics or achievement is inferred.
- The Premier qualification meter shows published points against the configured threshold; it does not establish a final outcome. Results expose win/loss to assistive technology and dates use `time`.
- Drop fields explain where personalisation appears; requests remain manual. Input text is 16px to avoid small-text zoom on iOS.
- Footer contrast and link target height improved. The header is flatter, without backdrop blur. Shared hover/focus and reduced-motion rules remain.
- Obsolete rail/selected-badge primitives and their styles/animations removed. TypeScript rejects unused locals/parameters, link checks include template-literal destinations, and CI runs on Linux and Windows.

## Intentionally absent

Individual profile pages lack sufficient real content. There is no maintained news dataset, verified organisation social profile list, subscription service or checkout. More routes, search, newsletters, notifications and integrations would create maintenance and factual gaps without a current user benefit.

## Verification limits

Full local validation and GitHub CI must pass for the published commit. Live desktop QA and HTTP checks are performed on its deployment. The current browser API does not expose viewport resizing: narrow/mobile and tablet visual QA remains a release gate. CSS review is not a substitute for that check. No field LCP/INP/CLS measurements are claimed and no automatic merge is authorised.
