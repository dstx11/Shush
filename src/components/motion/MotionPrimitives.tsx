import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { motionPresets } from '../../lib/motion';

type PrimitiveProps = {
  children?: ReactNode;
  className?: string;
};

export function MotionRail({ className = '' }: PrimitiveProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.span
      className={`motion-rail ${className}`}
      aria-hidden="true"
      variants={reduceMotion ? undefined : motionPresets.railDraw}
      initial={reduceMotion ? false : 'hidden'}
      whileInView={reduceMotion ? undefined : 'visible'}
      viewport={{ once: true, margin: '-12%' }}
    />
  );
}

export function StatusBadge({ children, className = '', pulse = false }: PrimitiveProps & { pulse?: boolean }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.span
      className={`motion-status-badge ${className}`}
      animate={!reduceMotion && pulse ? motionPresets.statusPulse.animate : undefined}
    >
      {children}
    </motion.span>
  );
}

export function PlayerLockIndicator({ label = 'SELECTED' }: { label?: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.span
      className="player-lock-indicator"
      variants={reduceMotion ? undefined : motionPresets.success}
      initial={reduceMotion ? false : 'initial'}
      animate={reduceMotion ? undefined : 'animate'}
    >
      {label}
    </motion.span>
  );
}
