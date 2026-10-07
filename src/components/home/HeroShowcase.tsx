import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { activePremierSeason } from '../../data/season';
import { motionPresets } from '../../lib/motion';
import { calculatePublicMatchDayState } from '../../lib/premier';
import { MotionRail, StatusBadge } from '../motion/MotionPrimitives';
import { AppLink } from '../ui/AppLink';
import { Button } from '../ui/Button';

const jerseyViews = {
  front: { label: 'Frente', src: '/assets/jersey/frontjersey.webp', alt: 'Jersey SHUSH vista de frente' },
  back: { label: 'Verso', src: '/assets/jersey/backjersey.webp', alt: 'Jersey SHUSH vista de costas' },
} as const;

type JerseyView = keyof typeof jerseyViews;

export function HeroShowcase() {
  const [view, setView] = useState<JerseyView>('front');
  const reduceMotion = useReducedMotion();
  const active = jerseyViews[view];
  const state = calculatePublicMatchDayState(activePremierSeason);

  return (
    <section id="top" className="hero-stage home-identity-stage audit-hero relative overflow-hidden px-5 pt-24">
      <div className="audit-hero-glow" aria-hidden="true" />
      <div className="hero-shell is-identity audit-hero-shell">
        <motion.div
          className="hero-copy identity audit-hero-copy"
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.58, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="section-kicker">SHUSH / Valorant + Creators</span>
          <h1>
            Sem barulho.
            <span>Só rounds.</span>
          </h1>
          <MotionRail className="hero-title-rail" />
          <p>Uma micro-org gaming com identidade própria, roster público, Premier e um primeiro drop que não precisa de fingir ser maior do que é.</p>

          <div className="audit-hero-status">
            <StatusBadge pulse={state.kind === 'match_day_live' || state.kind === 'playoffs_live'}>{state.title}</StatusBadge>
            <span>{state.detail}</span>
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button href="/esports/valorant/premier">Premier</Button>
            <Button href="/esports/valorant/roster" variant="secondary">Ver roster</Button>
          </div>
        </motion.div>

        <motion.div
          className="audit-hero-product"
          initial={reduceMotion ? false : { opacity: 0, y: 26, scale: 0.98 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="audit-product-index">DROP 01</span>
          <div className="audit-product-frame">
            <AnimatePresence mode="wait" initial={false}>
              <motion.img
                key={view}
                src={active.src}
                alt={active.alt}
                width="1280"
                height="1280"
                fetchPriority="high"
                decoding="async"
                initial={reduceMotion ? false : motionPresets.jerseySwap.initial}
                animate={reduceMotion ? undefined : motionPresets.jerseySwap.animate}
                exit={reduceMotion ? undefined : motionPresets.jerseySwap.exit}
              />
            </AnimatePresence>
          </div>
          <div className="audit-product-controls">
            <div role="group" aria-label="Vista da jersey">
              {(Object.keys(jerseyViews) as JerseyView[]).map((key) => (
                <button key={key} type="button" aria-pressed={view === key} onClick={() => setView(key)}>
                  {jerseyViews[key].label}
                </button>
              ))}
            </div>
            <AppLink href="/products/jersey">Explorar Drop 01 →</AppLink>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
