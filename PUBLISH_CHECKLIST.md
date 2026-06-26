# SHUSH Publish Checklist

## Source Validation
- [x] Static validation passes.
- [x] Final validation passes.
- [x] Known `callroom.html` fallback warning is intentional.
- [x] No public nav or public page links to `callroom.html`.

## Pages
- [x] `index.html`
- [x] `roster.html`
- [x] `drop01.html`
- [x] `about.html`
- [x] `callroom.html` fallback

## Deployment Readiness
- [x] No missing local assets found.
- [x] No broken internal links found.
- [x] No console errors in final browser QA.
- [x] No horizontal overflow in final responsive QA.
- [x] Metadata exists on public pages.
- [x] `lang="pt-PT"` exists on pages.
- [x] Viewport meta exists on pages.
- [x] WebP avatars are used by roster data.
- [x] PNG avatar masters are kept in the source project.
- [x] Drop 01 remains manual interest only.
- [x] No fake checkout, price, payment or stock flow.
- [x] No fake sponsor or scale claims.

## Publish Package
- [x] Clean folder: `release/shush-site/`
- [x] Runtime HTML, CSS, JS and assets included.
- [x] Source docs, scripts and tools excluded from publish folder.
- [x] `index.html` tested from the release folder structure.
- [x] Publish folder served locally and runtime files returned 200.
