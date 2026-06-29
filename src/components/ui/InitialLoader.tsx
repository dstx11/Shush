import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { motionPresets, timing } from '../../lib/motion';

let initialLoaderSeen = false;

export function InitialLoader() {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(() => !initialLoaderSeen);

  useEffect(() => {
    if (!visible) return;

    const timeout = window.setTimeout(
      () => {
        initialLoaderSeen = true;
        setVisible(false);
      },
      reduceMotion ? 120 : 620,
    );

    return () => window.clearTimeout(timeout);
  }, [reduceMotion, visible]);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="initial-loader"
          variants={reduceMotion ? undefined : motionPresets.loader}
          initial={reduceMotion ? false : 'initial'}
          animate={reduceMotion ? undefined : 'animate'}
          exit={reduceMotion ? undefined : 'exit'}
          transition={{ duration: reduceMotion ? 0.1 : timing.normal }}
          aria-label="A entrar no lobby SHUSH"
        >
          <motion.strong initial={reduceMotion ? false : { opacity: 0, y: 8 }} animate={reduceMotion ? undefined : { opacity: 1, y: 0 }} transition={{ duration: timing.normal }}>
            SHUSH
          </motion.strong>
          <motion.span
            className="loader-sweep"
            initial={reduceMotion ? false : { scaleX: 0 }}
            animate={reduceMotion ? undefined : { scaleX: 1 }}
            transition={{ duration: reduceMotion ? 0.1 : 0.48, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.span className="loader-scanline" variants={reduceMotion ? undefined : motionPresets.scanline} initial={reduceMotion ? false : 'initial'} animate={reduceMotion ? undefined : 'animate'} exit={reduceMotion ? undefined : 'exit'} />
          <small>ENTERING LOBBY</small>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
