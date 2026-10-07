import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';
import { transitions } from '../../lib/motion';

type PageTransitionProps = {
  children: ReactNode;
};

export function PageTransition({ children }: PageTransitionProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="route-frame"
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
      transition={reduceMotion ? undefined : transitions.normal}
    >
      {children}
    </motion.div>
  );
}
