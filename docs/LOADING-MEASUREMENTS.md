# Loading observations

The browser suite records three pairs of initial-intro and repeat visits in mobile-390 and desktop-1366 Chromium. `loading-metrics.json` is saved with each browser artifact and attached to the report.

The report captures first contentful paint, the latest LCP candidate, startup CLS using maximum session windows, observed long tasks, resource count and the active seasonal edition. Sampling ends after the intro, fonts, hero images and rendering frames settle. The same context/cache is reused: an initial intro is not a cold network measurement.

These are unthrottled local CI observations, not field Core Web Vitals, INP measurements, a device benchmark or production-network latency. There are deliberately no arbitrary speed thresholds before a baseline is established. Functional assertions still require a completed entrance and a valid paint observation.

The unused shush:ready dispatch in PageTransition was removed after confirming there are no remaining listeners. Intro resource readiness remains owned by BrandIntro; route navigation, focus and scroll restoration are unchanged.

References: https://web.dev/articles/cls and https://web.dev/articles/lcp
