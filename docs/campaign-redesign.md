# SHUSH campaign redesign — October 2026

The opening now uses a pale lavender campaign surface, large black type, a purple accent and the real jersey on a dark product stage. The home page introduces the seven players first, then the two creators, the dated Premier record and the Drop.

The roster pairs a large player portrait with a light profile panel. All seven player selectors remain before the selected profile, including in keyboard order. Creators have dedicated photo/platform cards. The Drop uses a light editing surface with white inputs, a dark jersey preview and the existing manual request flow. About and Premier use light panels to give the information more contrast.

Real player photographs, jersey assets, Riot IDs, Tracker destinations and published Premier data are preserved. Players without a photograph retain an initials fallback. No rank, result, achievement, sale or checkout has been invented.

## Reviewing the published branch

Use https://audit-pro-20261007.shush-4n1.pages.dev/ and refresh after a successful deployment. This branch alias follows new deployments; an earlier deployment-specific URL remains on its original version. The `master` branch has not been merged or changed by this redesign.

## Verification

The eight Chromium region snapshots are reviewed against actual CI captures before updating their baselines. Responsive, accessibility and interaction checks continue to cover the six routes and supported viewport/browser combinations. The desktop Drop preview must fit below the fixed header while following the form. Build, asset, link, bundle-size, Premier data, competitive-profile and Drop configuration checks remain enabled.

## Product gallery and roster discovery

The Home roster now exposes previous/next controls and a visible-card range whenever the portraits overflow the available width. Touch scrolling and ordinary profile links remain available. The controls follow scrolling and viewport changes, stop at the ends and respect reduced motion.

The real jersey can be opened from Home or Drop in a native modal gallery. Visitors can switch front/back, enlarge the image for details, pan with touch or keyboard, close with Escape and return to the original control. Personalized names, numbers and phrases remain visible in the Drop gallery. Editing those fields automatically selects the back view. The Home image now keeps the same unrotated framing with or without motion preferences.

Browser coverage exercises roster endpoints, gallery zoom/panning, modal focus containment/restoration, enlarged-gallery accessibility and preservation of the personalized request. Native modal behavior follows the [HTML dialog guidance](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog).
