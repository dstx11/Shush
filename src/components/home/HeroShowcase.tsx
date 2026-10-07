import { useState } from 'react';
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

  return (
    <section id="top" className="hero-stage audit-hero px-5" aria-labelledby="hero-title">
      <div className="hero-shell audit-hero-shell">
        <div className="hero-masthead">
          <span className="section-kicker">SHUSH / Valorant + Creators</span>
          <span aria-hidden="true">Menos ruído. Mais jogo.</span>
        </div>
        <h1 id="hero-title" className="hero-headline hero-copy-enter">
          Sem barulho.<span>Só rounds.</span>
        </h1>
        <div className="hero-introduction">
          <p>Uma equipa no servidor.<br />A mesma identidade fora dele.</p>
          <div className="hero-actions">
            <Button href="/esports/valorant/premier">Match Center</Button>
            <AppLink className="editorial-link" href="/esports/valorant/roster">Conhecer o roster <span aria-hidden="true">↗</span></AppLink>
          </div>
        </div>

        <div className="audit-hero-product hero-product-enter">
          <div className="audit-product-frame">
            <img
              key={view}
              src={active.src}
              alt={active.alt}
              width="1254"
              height="1254"
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
            <AppLink href="/products/jersey">Drop 01 ↗</AppLink>
          </div>
        </div>
      </div>
    </section>
  );
}
