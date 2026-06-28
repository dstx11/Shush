import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Button } from '../ui/Button';

const jerseyViews = {
  front: {
    label: 'Frente',
    src: '/assets/jersey/frontjersey.webp',
    alt: 'Jersey SHUSH Drop 01 vista de frente',
  },
  back: {
    label: 'Verso',
    src: '/assets/jersey/backjersey.webp',
    alt: 'Jersey SHUSH Drop 01 vista de costas',
  },
} as const;

type JerseyView = keyof typeof jerseyViews;

export function HeroShowcase() {
  const [view, setView] = useState<JerseyView>('front');
  const reduceMotion = useReducedMotion();
  const active = jerseyViews[view];

  return (
    <section id="top" className="hero-stage relative min-h-screen overflow-hidden px-5 pb-8 pt-24">
      <div className="absolute inset-0 serpent-texture" aria-hidden="true" />
      <div className="hero-vignette" aria-hidden="true" />
      <div className="serpent-trail trail-one" aria-hidden="true" />
      <div className="serpent-trail trail-two" aria-hidden="true" />

      <motion.p
        aria-hidden="true"
        className="ghost-word"
        initial={reduceMotion ? false : { opacity: 0, scale: 0.92, y: 26 }}
        animate={reduceMotion ? undefined : { opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
      >
        SHUSH
      </motion.p>

      <div className="hero-shell">
        <motion.div
          className="hero-product"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.72, y: 68, rotateX: 8 }}
          animate={reduceMotion ? undefined : { opacity: 1, scale: 1, y: [0, -14, 0], rotateX: 0 }}
          transition={
            reduceMotion
              ? undefined
              : {
                  opacity: { duration: 0.55 },
                  scale: { duration: 1.05, ease: [0.16, 1, 0.3, 1] },
                  rotateX: { duration: 1.05, ease: [0.16, 1, 0.3, 1] },
                  y: { duration: 7.5, repeat: Infinity, ease: 'easeInOut' },
                }
          }
        >
          <div className="jersey-orbit">
            <div className="jersey-aura" aria-hidden="true" />
            <AnimatePresence mode="wait" initial={!reduceMotion}>
              <motion.img
                key={view}
                src={active.src}
                alt={active.alt}
                width="1280"
                height="1280"
                fetchPriority="high"
                decoding="async"
                className="jersey-hero-image"
                initial={reduceMotion ? false : { opacity: 0, scale: 0.965, rotateY: view === 'front' ? -18 : 18 }}
                animate={reduceMotion ? undefined : { opacity: 1, scale: 1, rotateY: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, scale: 0.985, rotateY: view === 'front' ? 14 : -14 }}
                transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
              />
            </AnimatePresence>
            <div className="pedestal" aria-hidden="true" />
          </div>
        </motion.div>

        <motion.div
          className="hero-copy left"
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
        >
          <span className="section-kicker">Drop 01</span>
          <h1>A camisola da SHUSH.</h1>
          <p>Preto. Roxo. Silêncio no lobby.</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button href="/products">Ver produtos</Button>
            <Button href="/esports" variant="secondary">
              Ver esports
            </Button>
          </div>
        </motion.div>

        <motion.div
          className="hero-switcher"
          initial={reduceMotion ? false : { opacity: 0, y: 22 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.48 }}
        >
          <span>Silence the lobby.</span>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(jerseyViews) as JerseyView[]).map((key) => (
              <button
                key={key}
                type="button"
                aria-pressed={view === key}
                onClick={() => setView(key)}
                className={`rounded-2xl px-4 py-3 text-xs font-black uppercase tracking-[0.18em] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-shush-purpleGlow ${
                  view === key ? 'bg-shush-purple text-white shadow-glow' : 'bg-white/[0.045] text-shush-muted hover:bg-white/[0.08] hover:text-shush-text'
                }`}
              >
                {jerseyViews[key].label}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
