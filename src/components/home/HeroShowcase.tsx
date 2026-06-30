import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Radio, Users } from 'lucide-react';
import { activePremierSeason, getPlayersByIds } from '../../data/season';
import { motionPresets } from '../../lib/motion';
import { calculatePublicMatchDayState, formatDate, formatWindowCountdown } from '../../lib/premier';
import { MapPing, MotionRail, SnakeLine, StatusBadge, TacticalGrid, UltrawideClampLines } from '../motion/MotionPrimitives';
import { AppLink } from '../ui/AppLink';
import { Button } from '../ui/Button';

const jerseyViews = {
  front: {
    label: 'Frente',
    src: '/assets/jersey/frontjersey.webp',
    alt: 'Jersey SHUSH vista de frente',
  },
  back: {
    label: 'Verso',
    src: '/assets/jersey/backjersey.webp',
    alt: 'Jersey SHUSH vista de costas',
  },
} as const;

type JerseyView = keyof typeof jerseyViews;

export function HeroShowcase() {
  const [view, setView] = useState<JerseyView>('front');
  const reduceMotion = useReducedMotion();
  const active = jerseyViews[view];
  const state = calculatePublicMatchDayState(activePremierSeason);
  const week = 'week' in state ? state.week : null;
  const day = 'day' in state ? state.day : null;
  const convocados = week ? getPlayersByIds(week.convocados).slice(0, 5) : [];
  const meta = week && day ? `${week.map ?? 'Mapa por definir'} · ${formatDate(day.date)} · ${day.windowStart}-${day.windowEnd}` : state.detail;
  const countdown = day ? formatWindowCountdown(day) : 'A atualizar';

  return (
    <section id="top" className="hero-stage home-identity-stage relative overflow-hidden px-5 pb-8 pt-24">
      <div className="absolute inset-0 serpent-texture" aria-hidden="true" />
      <div className="hero-vignette" aria-hidden="true" />
      <div className="serpent-trail trail-one" aria-hidden="true" />
      <div className="serpent-trail trail-two" aria-hidden="true" />
      <TacticalGrid className="hero-tactical-grid" />
      <UltrawideClampLines />

      <motion.p
        aria-hidden="true"
        className="ghost-word"
        initial={reduceMotion ? false : { opacity: 0, scale: 0.92, y: 26 }}
        animate={reduceMotion ? undefined : { opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
      >
        SHUSH
      </motion.p>

      <div className="hero-shell is-identity">
        <motion.div
          className="hero-copy identity"
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <span className="section-kicker">SHUSH</span>
          <h1>SHUSH</h1>
          <MotionRail className="hero-title-rail" />
          <p>Gaming, Premier e creators no mesmo sítio. Sem barulho. Só rounds.</p>

          <div className="hero-status-strip" aria-label="Estado atual SHUSH">
            <StatusBadge pulse>
              <Radio aria-hidden="true" className="h-4 w-4" />
              {state.title}
            </StatusBadge>
            <strong>{meta}</strong>
            {week?.map ? <MapPing label={`Mapa ${week.map}`} /> : null}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button href="/esports/valorant/premier">Acompanhar Premier</Button>
            <Button href="/esports/valorant/roster" variant="secondary">
              Ver roster
            </Button>
          </div>
        </motion.div>

        <motion.div
          className="hero-mini-card"
          variants={reduceMotion ? undefined : motionPresets.panel}
          initial={reduceMotion ? false : 'hidden'}
          animate={reduceMotion ? undefined : 'visible'}
        >
          <SnakeLine className="hero-mini-snake" />
          <span>
            <Users aria-hidden="true" className="h-4 w-4" />
            Now panel
          </span>
          <strong>{state.title}</strong>
          <p>{meta}</p>
          <div className="now-panel-meta">
            <small>{countdown}</small>
            <small>{convocados.length > 0 ? `${convocados.length} convocados` : 'Convocados a atualizar'}</small>
          </div>
          {convocados.length > 0 ? (
            <div className="now-panel-lineup" aria-label="Convocados">
              {convocados.map((player) => (
                <span key={player.id}>
                  {player.displayName}
                  <small>{player.roles[0]}</small>
                </span>
              ))}
            </div>
          ) : null}
          <a href="#match-day">Ver estado vivo</a>
        </motion.div>

        <motion.div
          className="hero-product is-secondary"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.84, y: 42, rotateX: 8 }}
          animate={reduceMotion ? undefined : { opacity: 1, scale: 1, y: [0, -10, 0], rotateX: 0 }}
          transition={
            reduceMotion
              ? undefined
              : {
                  opacity: { duration: 0.55 },
                  scale: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
                  rotateX: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
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
                initial={reduceMotion ? false : motionPresets.jerseySwap.initial}
                animate={reduceMotion ? undefined : motionPresets.jerseySwap.animate}
                exit={reduceMotion ? undefined : motionPresets.jerseySwap.exit}
              />
            </AnimatePresence>
            <div className="pedestal" aria-hidden="true" />
          </div>
        </motion.div>

        <motion.div
          className="hero-switcher"
          initial={reduceMotion ? false : { opacity: 0, y: 22 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.48 }}
        >
          <span>Jersey / Clothing</span>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(jerseyViews) as JerseyView[]).map((key) => (
              <button key={key} type="button" aria-pressed={view === key} onClick={() => setView(key)} className={`hero-view-button ${view === key ? 'is-active' : ''}`}>
                {jerseyViews[key].label}
              </button>
            ))}
          </div>
          <AppLink href="/products/jersey" className="hero-product-link">
            Pedido manual
          </AppLink>
        </motion.div>
      </div>
    </section>
  );
}
