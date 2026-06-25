# SHUSH Animation Guide

## Principle
Layout first, motion second.

Motion should make the site feel alive, not noisy.

## Preferred Properties
Use:
- `transform`
- `opacity`

Avoid animating:
- `width`
- `height`
- `top`
- `left`
- `margin`
- `padding`

## Performance Rules
- Avoid heavy filters in animation loops.
- Use `will-change` sparingly and only for elements that are actively animated.
- Avoid heavy infinite animations.
- Avoid scroll jank.
- Keep pointer effects desktop-only when they depend on hover/fine pointer.

## Reduced Motion
Always respect:
```css
@media (prefers-reduced-motion: reduce) { ... }
```

Reduced motion should stop or simplify:
- reveal animations
- ticker movement
- pointer tilt
- decorative loops
- scan/glow effects

## Mobile
Mobile motion should be simpler than desktop motion.

Avoid:
- constant moving backgrounds
- hover-only patterns
- large parallax shifts
- layout-changing animations

## Good SHUSH Motion
- subtle nav hover state
- controlled reveal transitions
- jersey float/tilt after layout is stable
- button feedback
- filter transitions that do not break layout

## Bad SHUSH Motion
- constant glitch
- particle overload
- text shaking
- expensive blur loops
- movement that hides alignment problems
