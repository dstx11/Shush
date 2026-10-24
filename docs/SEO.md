# SHUSH search visibility

Technical SEO uses the existing static React build, without tracking or new dependencies.

- `src/data/meta.ts` owns unique titles and descriptions for all six routes, including Home.
- `scripts/prerender.mjs` emits real visible HTML, a sitemap of published routes, and JSON-LD for SHUSH (SportsTeam), WebSite, WebPage/AboutPage and breadcrumbs.
- `src/data/seo.ts` keeps page schema consistent with client navigation. Player and jersey query parameters canonicalize to their parent page.
- Large search image previews are permitted; social previews use existing real assets.
- Production remains indexable, preview deployments remain noindex, unknown URLs remain real 404s. No invented founding date, address, social account, review, offer, price or current result.
- Distribution and browser tests guard unique metadata, schema consistency, headings, navigation and parameter canonicalization. Existing visual baselines remain unchanged.

## Owner-side indexing and measurement

No Search Console or Bing Webmaster account access is available in this session. No submission or verification is claimed.

1. Verify `shush.pt` in Google Search Console using the actual DNS token supplied by Google. Do not add a placeholder token.
2. Submit `https://shush.pt/sitemap.xml`; inspect Home and the roster and request indexing if appropriate.
3. Check indexing/canonical reports, structured data, search queries, clicks and impressions; compare a 28-day baseline after recrawling.
4. Verify Bing Webmaster Tools and submit the same sitemap.
5. Keep match records sourced and dated. Publish original real team updates when available; link to SHUSH from the team's genuine public profiles.

Structured data helps interpretation, not a guarantee of rankings, rich results, Discover inclusion or autocomplete suggestions. External search tools could not retrieve shush.pt during this session; deploy verification uses direct HTTP and the existing Cloudflare/GitHub checks instead.

References: Google Search Central SEO Starter Guide, Organization structured data, Site Names, Build and Submit a Sitemap, Robots Meta Tags specifications.
