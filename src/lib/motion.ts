import type { Transition, Variants } from 'motion/react';

export const easing = {
  premium: [0.22, 1, 0.36, 1] as const,
  exit: [0.4, 0, 1, 1] as const,
};

export const transitions = {
  fast: { duration: 0.18, ease: easing.premium },
  normal: { duration: 0.32, ease: easing.premium },
  slow: { duration: 0.55, ease: easing.premium },
  exit: { duration: 0.18, ease: easing.exit },
} satisfies Record<string, Transition>;

export const motionPresets = {
  reveal: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: transitions.slow },
  },
  dropdown: {
    hidden: { opacity: 0, y: -8, scale: 0.985, transformOrigin: 'top center' },
    visible: { opacity: 1, y: 0, scale: 1, transition: transitions.normal },
    exit: { opacity: 0, y: -5, scale: 0.99, transition: transitions.exit },
  },
  jerseySwap: {
    initial: { opacity: 0, scale: 0.97 },
    animate: { opacity: 1, scale: 1, transition: transitions.normal },
    exit: { opacity: 0, scale: 0.985, transition: transitions.fast },
  },
  rosterSwap: {
    initial: { opacity: 0, x: 24 },
    animate: { opacity: 1, x: 0, transition: transitions.normal },
    exit: { opacity: 0, x: -18, transition: transitions.exit },
  },
  railDraw: {
    hidden: { scaleX: 0, opacity: 0, transformOrigin: 'left center' },
    visible: { scaleX: 1, opacity: 1, transition: transitions.slow },
  },
  statusPulse: {
    animate: {
      opacity: [0.76, 1, 0.76],
      transition: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' },
    },
  },
  success: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1, transition: transitions.fast },
  },
} satisfies Record<string, Variants | Record<string, unknown>>;
