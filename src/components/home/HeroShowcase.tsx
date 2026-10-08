import { useState } from 'react';
import { AppLink } from '../ui/AppLink';
import { Button } from '../ui/Button';
import { players } from '../../data/players';

const views = {
  front: { label: 'Frente', src: '/assets/jersey/frontjersey.webp', alt: 'Jersey SHUSH vista de frente' },
  back: { label: 'Verso', src: '/assets/jersey/backjersey.webp', alt: 'Jersey SHUSH vista de costas' },
} as const;

export function HeroShowcase() {
  const [view, setView] = useState<keyof typeof views>('front');
  return (
    <section id="top" className="opening" aria-labelledby="hero-title">
      <div className="shell opening-grid">
        <div className="opening-label"><span className="section-kicker">SHUSH / Valorant + Creators</span><span className="mono">Dentro e fora do servidor</span></div>
        <div className="opening-copy">
          <h1 id="hero-title" className="hero-copy-enter"><span>Sem<br />barulho.</span> <span className="opening-accent">Só rounds.</span></h1>
          <p>Valorant. Creators. Uma camisola.<br />Sete jogadores com a mesma assinatura.</p>
          <div className="action-row">
            <Button href="/esports/valorant/roster">Conhecer o roster</Button>
            <Button href="/esports/valorant/premier" variant="secondary">Match Center</Button>
          </div>
          <AppLink className="opening-team" href="/esports/valorant/roster" aria-label="Conhecer os sete jogadores da SHUSH">
            <span className="opening-faces" aria-hidden="true">{players.filter((player) => player.avatar).slice(0, 4).map((player) => <img key={player.id} src={player.avatar} alt="" width="768" height="768" decoding="async" />)}</span>
            <span><strong>7 jogadores. Uma equipa.</strong><small>Conhece quem entra no lobby ↗</small></span>
          </AppLink>
        </div>
        <div className="opening-product hero-product-enter">
          <span className="opening-wordmark" aria-hidden="true">SHUSH</span>
          <div className="opening-product-label"><span className="product-edition">Drop 01</span><span className="mono">A camisola da equipa</span></div>
          <div className="opening-jersey"><img key={view} className="product-swap" src={views[view].src} alt={views[view].alt} width="1254" height="1254" fetchPriority="high" decoding="async" /></div>
          <div className="opening-controls">
            <div className="view-control" role="group" aria-label="Vista da jersey">{(Object.keys(views) as (keyof typeof views)[]).map((key) => <button key={key} type="button" aria-pressed={view === key} onClick={() => setView(key)}>{views[key].label}</button>)}</div>
            <AppLink className="editorial-link" href="/products/jersey">Personalizar <span aria-hidden="true">↗</span></AppLink>
          </div>
        </div>
        <div className="opening-foot"><span className="mono">Sem barulho. Dentro e fora do servidor.</span><a className="editorial-link" href="#home-roster-title">Explorar a SHUSH <span aria-hidden="true">↓</span></a></div>
      </div>
    </section>
  );
}
