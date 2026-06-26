# SHUSH Performance Guide

## Baseline
The site is static and should stay lightweight.

Keep:
- vanilla HTML
- vanilla CSS
- vanilla JavaScript
- no frameworks
- no heavy dependencies

## Images
- Use existing jersey/logo/Backora assets where useful.
- Avoid huge assets for tiny UI elements.
- Use optimized WebP copies for roster avatars; keep PNGs as source/master files.
- Use `loading="lazy"` below the fold.
- Use `decoding="async"` where useful.
- Add width/height to important images where possible.
- Use `fetchpriority="high"` only for the critical hero image.
- Keep avatar handling local; no remote placeholders.

## CSS
- Removed unused legacy concept CSS after the related stages.
- Avoid excessive `backdrop-filter`.
- Avoid large stacked shadows everywhere.
- Keep responsive rules direct and maintainable.

## JavaScript
- Keep interactions small and static-site friendly.
- Avoid unnecessary global pointer listeners.
- Avoid expensive scroll handlers.
- Use passive listeners where appropriate.
- Stop decorative animation work when `prefers-reduced-motion` is active.

## Final Cleanup Targets
- missing asset references
- unused CSS selectors
- unused JS branches
- layout-shifting image dimensions
- heavy infinite animation
- cursor glow based on `top`/`left` if it causes jank
