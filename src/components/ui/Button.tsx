import type { ReactNode } from 'react';
import { motion, type HTMLMotionProps, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { hoverMotion } from '../../lib/motion';

type ButtonProps = HTMLMotionProps<'a'> & {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
};

export function Button({ children, variant = 'primary', className = '', ...props }: ButtonProps) {
  const reduceMotion = useReducedMotion();
  const base =
    'group inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 text-xs font-extrabold uppercase tracking-[0.12em] transition duration-300 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-shush-purpleGlow';
  const styles =
    variant === 'primary'
      ? 'border border-shush-purpleGlow bg-shush-purple text-white hover:bg-shush-purpleGlow'
      : 'border border-white/15 bg-shush-surface2 text-shush-text hover:border-shush-purpleGlow hover:bg-shush-surface';

  return (
    <motion.a className={`${base} motion-button ${styles} ${className}`} whileHover={reduceMotion ? undefined : hoverMotion.button} whileTap={reduceMotion ? undefined : hoverMotion.tap} {...props}>
      <span>{children}</span>
      <ArrowRight aria-hidden="true" className="h-4 w-4 transition group-hover:translate-x-1" />
    </motion.a>
  );
}
