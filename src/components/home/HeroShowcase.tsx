import { useState } from 'react';
import { activePremierSeason } from '../../data/season';
import { calculatePublicMatchDayState } from '../../lib/premier';
import { AccentRail, StatusBadge } from '../ui/VisualPrimitives';
import { AppLink } from '../ui/AppLink';
import { Button } from '../ui/Button';

const jerseyViews = {
  front: { label: 'Frente', src: '/assets/jersey/frontjersey.webp', alt: 'Jersey SHUSH vista de frente' },
  back: { label: 'Verso', src: '/assets/jersey/backjersey.webp', alt: 'Jersey SHUSH vista de costas' },
} as const;

type JerseyView = keyof typeof jerseyViews;

export function HeroShowcase() {
  const [view, setView] = useState<JerseyView>('front');
  const active = jerseyViews[view];
  const state = calculatePublicMatchDayState(activePremierSeason);

  return (
    <section id="top" className="hero-stage home-identity-stage audit-hero relative overflow-hidden px-5 pt-24" aria-labelledby="hero-title">
      <div className="audit-hero-glow" aria-hidden="true" />

      <div className="hero-shell is-identity audit-hero-shell">
        <div className="hero-copy identity audit-hero-copy hero-copy-enter">
          <span className="section-kicker">SHUSH / Valorant + Creators</span>
          <h1 id="hero-title">
            Sem barulho.
            <span>Só rounds.</span>
          </h1>
          <AccentRail className="hero-title-rail" />
          <p>Valorant, creators e identidade própria. Um espaço para acompanhar a equipa, conhecer o roster e descobrir o Drop 01.</p>

          <div className="audit-hero-status">
            <StatusBadge pulse={state.kind === 'match_day_live' || state.kind === 'playoffs_live'}>{state.title}</StatusBadge>
            <span>{state.detail}</span>
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button href="/esports/valorant/premier">Premier</Button>
            <Button href="/esports/valorant/roster" variant="secondary">Ver roster</Button>
          </div>
        </div>

        <div className="audit-hero-product hero-product-enter">
          <span className="audit-product-index">DROP 01</span>
          <div className="audit-product-frame">
            <img
              key={view}
              src={active.src}
              alt={active.alt}
              width="1280"
              height="1280"
              fetchPriority="high"
              decoding="async"
              className="product-swap"
            />
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
        </div>
      </div>
    </section>
  );
}
