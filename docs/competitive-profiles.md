# Competitive profiles — decision record

Research date: 8 October 2026. Associations were supplied and confirmed by the project owner. `src/data/players.ts` remains the source for public names, roles and real avatars. `src/data/competitive-profiles.ts` stores account associations and the exact supplied links; changing a Riot ID requires updating its URL too.

## Official access findings

- [Tracker developer FAQs](https://trackernetwork.freshdesk.com/support/solutions/articles/19000152565-developer-apis-faqs), updated 9 June 2025, list Apex Legends and The Division 2. VALORANT is not supported. They prohibit undocumented endpoints and scraping, and require whitelisting for supported APIs.
- [Tracker support, 25 January 2026](https://feedback.tracker.gg/t/request-valorant-api/65389) explicitly confirms that no VALORANT API is offered. [Support, July 2023](https://feedback.tracker.gg/t/valorant-api-inquiry/28078) explicitly disallows use of the internal API.
- [Public API authentication](https://tracker.gg/developers/docs/authentication) uses `TRN-Api-Key`. This does not grant access to VALORANT. [Apex documentation](https://apex.tracker.gg/site-api) describes 30 requests per 60 seconds, non-commercial use and credit/link-back; those are Apex conditions, **not** a VALORANT quota or licence. No applicable VALORANT rate limit or redistribution licence was found.
- [Official overlays](https://tracker.gg/overlays) support VALORANT as an OBS/stream browser source. The documented flow requires a configured overlay and account login. No documented general website profile embed or licence to reuse its statistics was found. A streaming overlay is not treated as website/API permission.
- The linked [Tracker Terms of Service](https://thetrackernetwork.com/home/tos) returned HTTP 403 to the research tool; its contents could not be independently reviewed. The readable official FAQs already prohibit the proposed scraping/internal-API alternatives. No claim of terms approval is made.
- [Riot's VALORANT documentation](https://developer.riotgames.com/docs/valorant) requires an approved production key, Riot Sign On and player opt-in within the integrating service to show player statistics. A public Tracker profile or the player's consent to Tracker is not SHUSH authorization. Secrets must never be put in a Vite client bundle.

## Implemented experience

Seven real player selection cards lead to a shareable `?player=<id>` spotlight with avatar/initials, existing public identity, roles, Riot ID, mode and a named external Tracker link. Selectors precede the spotlight so mobile visitors can choose a player immediately. Public names such as More and tz remain distinct from their account names. No separate profile routes are added without more real content.

DSTX's supplied link intentionally selects Competitive and a specific season UUID. The UI labels this as a selected season, never the current season. Other links retain their Premier/default-period queries. No comparison, rank, K/D, win rate, ACS, agents or match count is inferred. Profile availability/privacy is explained beside the link.

There are no network requests to Tracker, scraping, API keys, iframes, imported Tracker branding, loading skeletons or simulated error states. The official source remains directly accessible even if its data is private. The site does not depend on Tracker availability for rendering. SHUSH credits Tracker.gg by name and links to the actual account.

## Future authorized statistics

The identity registry is independent of the presentation and any statistics provider. If authorized access becomes available, keep this registry and add a separate validated snapshot source rather than mixing metrics into player biographies. Before implementation, obtain explicit provider/product approval and player opt-in, review redistribution/attribution terms and the actual granted rate limits. RSO/key handling would require separately authorized infrastructure; the current static project adds none.

Only an approved build-time source or authorized service should produce snapshots. A future record must include player/account identity, provider, queue, season/act, sample size, capture time and metric definitions. Reject mismatched accounts, seasons and queues. Define freshness/expiry from the provider contract; expired metrics must be labelled or hidden, never presented as live. Cache approved snapshots with bounded retries respecting actual provider response headers; keep a last verified snapshot only with its visible date, or fall back to the existing source link. Revoked/private/unavailable accounts must not expose stored personal statistics. Test loading, error and unavailable states only when a real data-loading flow exists.

## Checks

Build-time validation rejects unknown/duplicate players, duplicate accounts, mismatched Riot ID encoding, fragments, credentials, non-Tracker hosts, incorrect queues and unlabelled season queries. Node tests cover the seven owner-confirmed mappings, Unicode, spaces and malicious/malformed URLs. Browser CI checks all seven displayed identities and outgoing destinations without calling Tracker and records responsive screenshots across Chromium/WebKit projects.
