# SHUSH — design evolution

Research and implementation audit: 7–8 October 2026. Source of truth: the existing repository, its real assets and static data. This evolution continues the professional rebuild; it does not replace the application or add services.

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
- Drop field names remain stable while counters and constraints are separate accessible descriptions. Result letters are decorative; assistive technology receives the Portuguese win/loss label.
- Footer contrast and link target height improved. The header is flatter, without backdrop blur. Shared hover/focus and reduced-motion rules remain.
- Obsolete rail/selected-badge primitives and their styles/animations removed. TypeScript rejects unused locals/parameters, link checks include template-literal destinations, and CI runs on Linux and Windows.
- Seven owner-confirmed Riot accounts are integrated into the roster spotlight, with mode, attribution and exact external Tracker destinations. Public nicknames remain unchanged. The selected Competitive season is labelled; no statistics are inferred or scraped. [Access research and future requirements](competitive-profiles.md).
- Player selectors precede the spotlight, initials are centred and mobile portraits are proportional. Selection changes announce the player's name in a persistent status region.
- Each player card now includes the Riot ID and its own bordered Tracker.gg action; the spotlight uses a larger filled purple version. V3 uses a compact horizontal mobile selector with automatic centring of the active card; desktop uses a two-column selector beside the large profile. Real roster numbers, stronger name hierarchy and separate keyboard controls refine the player presentation.
- Rendered responsive QA exposed a page-sized focus outline and empty space around the mobile jersey. The Drop now uses a square image frame and scales preview text to that frame, keeping nick/number on the jersey across screen sizes.
- Slow initial Home loading no longer steals focus from the mobile menu. Later SPA routes still move focus after their content commits; selection query changes preserve scroll/focus.
- Browser CI covers Chromium widths 320/390/768/1366/1920, an effective 200% desktop reflow viewport, mobile landscape and mobile WebKit. Live HTTP smoke checks wait for the actual built entry asset before validating the Cloudflare alias, metadata, security, redirect and real 404. Tailwind scans application source only, so documentation/test text cannot add production utilities.

## Intentionally absent

Individual profile pages lack sufficient real content; existing shareable roster selections now contain competitive identities. There is no maintained news dataset, verified organisation social profile list, subscription service or checkout. Automatic player statistics require separate provider authorization and player opt-in; public Tracker links do not grant those rights. More routes, search, newsletters and notifications would create maintenance and factual gaps without a current user benefit.

## Verification limits

Full local validation, browser QA and the live Cloudflare HTTP check must pass for the published commit. Desktop interaction QA uses the real deployment. The browser interface cannot resize its live window, so narrow/mobile and tablet QA now uses isolated Chromium/WebKit CI renders and their actual screenshots, which have been visually inspected. This closes the previous narrow-viewport release gate; it is emulation, not a claim of physical-device testing. No field LCP/INP/CLS measurements are claimed and no automatic merge is authorised. The PR records the final commit, CI result and deployment.

## V3 implementation

All six compositions were rebuilt around the tactical editorial system. Home uses the three-line identity statement and real jersey, a separate Premier score composition, a portrait discovery rail, platform rows and a large Drop destination. Player Select keeps the active profile prominent, with a compact discovery selector and three user actions: Tracker, exact Riot ID copy and shareable selection. Match Center has native expandable jornadas, published windows, actual call-ups, channel links, filters and tentative RFC 5545 calendar exports. Creators have distinct Twitch/YouTube compositions. Drop has a dedicated configurator, Unicode-safe values, URL restoration, TXT export, explicit device drafts and blocked-API recovery. About combines the small-org narrative, actual counts, manifesto, Backora and a download of the supplied brand asset.

The shared footer and both static/SPA 404 experiences use the same visual language. Old audit overrides and the unused Reveal component were removed. Removing global overflow hiding restores real sticky positioning and lets browser geometry checks detect genuine horizontal overflow. Mobile Drop keeps a compact preview near fields; it becomes static in short viewports so controls remain usable.

## Body pre-rendering assessment (P2)

The build already supplies six route-specific metadata documents and a real static 404. It does not pre-render the React body. Body pre-rendering was evaluated and deferred: the roster and Drop depend on query parameters, Premier uses the Lisbon clock, and correct hydration would require a separate server-render/build path, serialized initial clock state and additional consistency tests. There is no measured field loading or indexing problem establishing a benefit large enough to justify that complexity in this static micro-org site. Preserve route splitting, priority images, font preconnect and small bundles; reassess with real LCP/indexing evidence. No claim of completed SSG or measured Core Web Vitals is made.
