import type { TargetAndTransition, Transition, Variants } from 'motion/react';

export const timing = {
  instant: 0.08,
  fast: 0.18,
  normal: 0.32,
  slow: 0.55,
  page: 0.45,
  deliberate: 0.82,
};

export const easing = {
  premium: [0.22, 1, 0.36, 1] as const,
  exit: [0.4, 0, 1, 1] as const,
  snap: [0.16, 1, 0.3, 1] as const,
  tactical: [0.2, 0.8, 0.2, 1] as const,
};

export const transitions = {
  fast: { duration: timing.fast, ease: easing.premium },
  normal: { duration: timing.normal, ease: easing.premium },
  slow: { duration: timing.slow, ease: easing.premium },
  page: { duration: timing.page, ease: easing.premium },
  deliberate: { duration: timing.deliberate, ease: easing.premium },
  exit: { duration: timing.fast, ease: easing.exit },
  snap: { duration: timing.normal, ease: easing.snap },
  tactical: { duration: timing.slow, ease: easing.tactical },
} satisfies Record<string, Transition>;

export const motionPresets = {
  page: {
    initial: { opacity: 0, y: 18, scale: 0.985 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -14, scale: 0.985 },
    transition: transitions.page,
  },
  pageExit: {
    initial: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.98, transition: transitions.exit },
  },
  pageWipe: {
    initial: { scaleX: 0, opacity: 0, transformOrigin: 'left center' },
    animate: { scaleX: 1, opacity: 1, transition: transitions.page },
    exit: { scaleX: 0, opacity: 0, transformOrigin: 'right center', transition: transitions.exit },
  },
  wipe: {
    initial: { scaleX: 0, opacity: 0, transformOrigin: 'left center' },
    animate: { scaleX: 1, opacity: 1, transition: transitions.page },
    exit: { scaleX: 0, opacity: 0, transformOrigin: 'right center', transition: transitions.exit },
  },
  loader: {
    initial: { opacity: 1 },
    animate: { opacity: 1 },
    exit: { opacity: 0, y: -10, transition: transitions.normal },
  },
  scanline: {
    initial: { scaleX: 0, opacity: 0 },
    animate: { scaleX: 1, opacity: 1, transition: transitions.slow },
    exit: { opacity: 0, transition: transitions.fast },
  },
  reveal: {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: transitions.slow },
  },
  revealX: {
    hidden: { opacity: 0, x: -24 },
    visible: { opacity: 1, x: 0, transition: transitions.slow },
  },
  revealMask: {
    hidden: { opacity: 0, clipPath: 'inset(12% 0 12% 0)' },
    visible: { opacity: 1, clipPath: 'inset(0% 0 0% 0)', transition: transitions.slow },
  },
  staggerParent: {
    hidden: {},
    visible: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
  },
  staggerItem: {
    hidden: { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0, transition: transitions.normal },
  },
  dropdown: {
    hidden: { opacity: 0, y: -8, scale: 0.98, transformOrigin: 'top center' },
    visible: { opacity: 1, y: 0, scale: 1, transition: transitions.normal },
    exit: { opacity: 0, y: -6, scale: 0.985, transition: transitions.exit },
  },
  dropdownItem: {
    hidden: { opacity: 0, y: 8, x: -4 },
    visible: { opacity: 1, y: 0, x: 0, transition: transitions.fast },
  },
  accordion: {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: 'auto', transition: transitions.normal },
    exit: { opacity: 0, height: 0, transition: transitions.exit },
  },
  mobileDisclosure: {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: 'auto', transition: transitions.normal },
    exit: { opacity: 0, height: 0, transition: transitions.exit },
  },
  navIndicator: {
    initial: { scaleX: 0, opacity: 0 },
    animate: { scaleX: 1, opacity: 1, transition: transitions.fast },
  },
  panel: {
    hidden: { opacity: 0, y: 20, scale: 0.985 },
    visible: { opacity: 1, y: 0, scale: 1, transition: transitions.slow },
  },
  panelLayer: {
    hidden: { opacity: 0, y: 14 },
    visible: { opacity: 1, y: 0, transition: transitions.normal },
  },
  statusPulse: {
    animate: { opacity: [0.72, 1, 0.72], scale: [1, 1.015, 1], transition: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' } },
  },
  numberSwap: {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0, transition: transitions.fast },
    exit: { opacity: 0, y: -12, transition: transitions.fast },
  },
  progressFill: {
    hidden: { scaleX: 0, transformOrigin: 'left center' },
    visible: { scaleX: 1, transition: transitions.deliberate },
  },
  rosterSwap: {
    initial: { opacity: 0, x: 24 },
    animate: { opacity: 1, x: 0, transition: transitions.normal },
    exit: { opacity: 0, x: -18, transition: transitions.exit },
  },
  playerCard: {
    rest: { y: 0, scale: 1 },
    hover: { y: -4, scale: 1.01, transition: transitions.fast },
    tap: { scale: 0.985, transition: transitions.fast },
  },
  jerseySwap: {
    initial: { opacity: 0, scale: 0.96, rotateY: -10 },
    animate: { opacity: 1, scale: 1, rotateY: 0, transition: transitions.normal },
    exit: { opacity: 0, scale: 0.985, rotateY: 10, transition: transitions.exit },
  },
  jerseyProduct: {
    hidden: { opacity: 0, y: 34, scale: 0.96 },
    visible: { opacity: 1, y: 0, scale: 1, transition: transitions.slow },
  },
  formField: {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: transitions.normal },
  },
  success: {
    initial: { opacity: 0, scale: 0.92 },
    animate: { opacity: 1, scale: 1, transition: transitions.fast },
    exit: { opacity: 0, scale: 0.96, transition: transitions.exit },
  },
  errorShake: {
    animate: { x: [0, -5, 5, -3, 3, 0], transition: { duration: 0.28, ease: easing.tactical } },
  },
  footer: {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: transitions.slow },
  },
  snakeLine: {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { pathLength: 1, opacity: 1, transition: transitions.deliberate },
  },
  railDraw: {
    hidden: { scaleX: 0, opacity: 0, transformOrigin: 'left center' },
    visible: { scaleX: 1, opacity: 1, transition: transitions.slow },
  },
  tacticalGrid: {
    hidden: { opacity: 0, scale: 0.985 },
    visible: { opacity: 1, scale: 1, transition: transitions.deliberate },
  },
  mapPing: {
    animate: { scale: [0.88, 1.18, 0.88], opacity: [0.55, 1, 0.55], transition: { duration: 1.85, repeat: Infinity, ease: 'easeInOut' } },
  },
  milestone: {
    hidden: { opacity: 0, scale: 0.72 },
    visible: { opacity: 1, scale: 1, transition: transitions.snap },
  },
  creatorSignal: {
    animate: { scaleY: [0.45, 1, 0.55], opacity: [0.45, 1, 0.55], transition: { duration: 1.4, repeat: Infinity, ease: 'easeInOut' } },
  },
  scrollRail: {
    hidden: { scaleY: 0, transformOrigin: 'top center' },
    visible: { scaleY: 1, transition: transitions.slow },
  },
  reduced: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: timing.instant } },
    exit: { opacity: 0, transition: { duration: timing.instant } },
  },
} satisfies Record<string, Variants | Record<string, unknown>>;

export const hoverMotion = {
  card: { y: -3, transition: transitions.fast },
  button: { y: -2, transition: transitions.fast },
  tap: { scale: 0.98, transition: transitions.fast },
} satisfies Record<string, TargetAndTransition>;

export function withoutMotion<T>(value: T, fallback?: T) {
  return fallback ?? value;
}

export function reducedAware<T>(reduceMotion: boolean, value: T, fallback?: T) {
  return reduceMotion ? fallback : value;
}
