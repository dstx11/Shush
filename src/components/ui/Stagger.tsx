import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';
import { motionPresets } from '../../lib/motion';

export function Stagger({ children, className }: { children: ReactNode; className?: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div className={className} variants={reduceMotion ? undefined : motionPresets.staggerParent} initial={reduceMotion ? false : 'hidden'} whileInView={reduceMotion ? undefined : 'visible'} viewport={{ once: true, margin: '-10%' }}>
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div className={className} variants={reduceMotion ? undefined : motionPresets.staggerItem}>
      {children}
    </motion.div>
  );
}
