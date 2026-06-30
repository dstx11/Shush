import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';
import { motionPresets } from '../../lib/motion';

type PageTransitionProps = {
  children: ReactNode;
};

export function PageTransition({ children }: PageTransitionProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="route-frame"
      initial={reduceMotion ? false : motionPresets.page.initial}
      animate={reduceMotion ? undefined : motionPresets.page.animate}
      exit={reduceMotion ? undefined : motionPresets.page.exit}
      transition={reduceMotion ? undefined : motionPresets.page.transition}
    >
      <motion.span
        aria-hidden="true"
        className="page-wipe"
        variants={reduceMotion ? undefined : motionPresets.pageWipe}
        initial={reduceMotion ? false : 'initial'}
        animate={reduceMotion ? undefined : 'animate'}
        exit={reduceMotion ? undefined : 'exit'}
      />
      <motion.span aria-hidden="true" className="route-top-bar" variants={reduceMotion ? undefined : motionPresets.railDraw} initial={reduceMotion ? false : 'hidden'} animate={reduceMotion ? undefined : 'visible'} />
      <svg className="route-snake" viewBox="0 0 420 42" aria-hidden="true" focusable="false">
        <motion.path d="M8 28 C78 4, 118 42, 184 20 S303 2, 412 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" variants={reduceMotion ? undefined : motionPresets.snakeLine} initial={reduceMotion ? false : 'hidden'} animate={reduceMotion ? undefined : 'visible'} />
      </svg>
      {children}
    </motion.div>
  );
}
