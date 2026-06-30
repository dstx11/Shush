import { motion, useReducedMotion } from 'motion/react';
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import { motionPresets } from '../../lib/motion';

type RevealProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  className?: string;
  delay?: number;
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className'>;

export function Reveal<T extends ElementType = 'div'>({ as, children, className, delay = 0, ...props }: RevealProps<T>) {
  const reduceMotion = useReducedMotion();
  const Component = motion(as ?? 'div');

  return (
    <Component
      className={className}
      initial={reduceMotion ? false : 'hidden'}
      whileInView={reduceMotion ? undefined : 'visible'}
      variants={reduceMotion ? undefined : motionPresets.reveal}
      viewport={{ once: true, margin: '-12%' }}
      transition={reduceMotion ? undefined : { delay }}
      {...props}
    >
      {children}
    </Component>
  );
}
