import { motion, useReducedMotion } from 'motion/react';
import { footerLinks } from '../../data/nav';
import { motionPresets } from '../../lib/motion';
import { SnakeLine } from '../motion/MotionPrimitives';
import { AppLink } from '../ui/AppLink';

const MotionAppLink = motion.create(AppLink);

export function Footer() {
  const reduceMotion = useReducedMotion();

  return (
    <footer className="relative px-5 py-14">
      <SnakeLine className="footer-snake-divider" />
      <motion.div
        className="footer-shell mx-auto flex max-w-7xl flex-col gap-6 border-t border-white/10 pt-8 text-sm text-shush-muted lg:flex-row lg:items-center lg:justify-between"
        variants={reduceMotion ? undefined : motionPresets.staggerParent}
        initial={reduceMotion ? false : 'hidden'}
        whileInView={reduceMotion ? undefined : 'visible'}
        viewport={{ once: true, margin: '-10%' }}
      >
        <div>
          <strong className="block text-shush-text">SHUSH</strong>
          <span>Sem barulho. Só rounds.</span>
        </div>
        <motion.div className="flex flex-wrap gap-2" variants={reduceMotion ? undefined : motionPresets.staggerParent}>
          {footerLinks.map((item) => (
            <MotionAppLink key={item.href} href={item.href} className="footer-link" variants={reduceMotion ? undefined : motionPresets.staggerItem}>
              {item.label}
            </MotionAppLink>
          ))}
          <motion.a href="https://backora.org/" target="_blank" rel="noreferrer" className="footer-link footer-backora inline-flex items-center gap-3" variants={reduceMotion ? undefined : motionPresets.staggerItem}>
            <img src="/assets/brand/backora-logo.png" width="320" height="293" alt="" className="h-5 w-auto" loading="lazy" decoding="async" />
            <span>Backora</span>
          </motion.a>
        </motion.div>
      </motion.div>
    </footer>
  );
}
