# SHUSH Accessibility Guide

## Required Baseline
- `lang="pt-PT"` on every HTML page
- semantic `<nav>`
- `nav` has `aria-label`
- active nav link has `aria-current="page"`
- mobile menu button has `aria-expanded`
- mobile menu button has `aria-controls`
- Escape closes mobile menu
- visible `:focus-visible`
- sufficient text contrast
- `prefers-reduced-motion`
- Drop 01 generated output uses `aria-live`
- meaningful images have meaningful alt text
- decorative images use empty alt text
- form fields have labels and useful names
- keyboard navigation works

## Navigation
Use normal site navigation semantics. Do not use `role="menu"` for basic links.

The mobile menu must:
- open from the button
- close from the button
- close on Escape
- close after link click
- update `aria-expanded`

## Images
Meaningful:
- jersey showcase image
- SHUSH logo when used as identity
- Backora mark when used as partner identity

Decorative:
- repeated footer marks where nearby text already names the brand
- background/texture elements

## Forms
Drop 01 inputs need:
- visible labels
- useful `name` attributes in final implementation
- accessible focus states
- output with live announcement

## Testing
Manual keyboard pass:
- Tab through header
- open mobile menu
- close with Escape
- activate nav links
- use roster filters
- complete Drop 01 form
- copy/generated output remains understandable
