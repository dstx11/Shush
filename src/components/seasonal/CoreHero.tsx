import { AppLink } from '../ui/AppLink';
import { Button } from '../ui/Button';
import { getHomePlayers } from '../../lib/home-selection';
import { PlayerPortrait } from '../ui/PlayerPortrait';
import { useSeason } from '../../seasonal/SeasonProvider';
import '../../styles/luxury-home.css';

/** The first frame is complete without an entrance animation or a canvas. */
export function CoreHero() {
  const { id, theme } = useSeason();
  const featured = getHomePlayers();
  return <section id="top" className="lux-hero" aria-labelledby="hero-title">
    <div className="lux-hero-top shell"><span>SHUSH / VALORANT + CREATORS</span><span>{id === 'base' ? 'SILENCE BEFORE IMPACT' : theme.label}</span></div>
    <div className="lux-hero-layout shell">
      <div className="lux-hero-copy">
        <p className="lux-eyebrow"><span aria-hidden="true">↳</span> Uma equipa. A nossa maneira.</p>
        <h1 id="hero-title">{id === 'base' ? <>Sem barulho.<br /><em>Só rounds.</em></> : <>{theme.title[0]}<br /><em>{theme.title[1]}</em></>}</h1>
        <p className="lux-hero-lead">{id === 'base' ? 'Sete pessoas. Uma tag. A mesma vontade de voltar ao servidor.' : theme.lead}</p>
        <div className="lux-hero-actions"><Button href="/esports/valorant/roster">Conhecer o roster</Button><AppLink href="/company" className="lux-text-link">A nossa história <span aria-hidden="true">↗</span></AppLink></div>
        <div className="lux-hero-note"><span className="lux-rule" aria-hidden="true" /><p>O silêncio é nosso.<br /><strong>O próximo round também.</strong></p></div>
      </div>
      <div data-home-roster className="lux-hero-gallery" aria-label="Jogadores da SHUSH">
        <span className="lux-hero-orbit" aria-hidden="true" />
        <div className="lux-hero-gallery-label"><span>THE PEOPLE BEHIND THE TAG</span><span>01 — 07</span></div>
        {featured.map((player,index) => <AppLink className={`lux-portrait lux-portrait-${index}`} key={player.id} data-home-player data-player={player.id} href={`/esports/valorant/roster?player=${player.id}`} aria-label={`Conhecer ${player.displayName}`}><PlayerPortrait player={player} decorative eager sizes="(max-width: 767px) 40vw, 23vw" /><span><small>#{player.number} / SHUSH</small><strong>{player.displayName}</strong><i aria-hidden="true">↗</i></span></AppLink>)}
        <span className="lux-gallery-footer">NO NOISE. ALL GAME.</span>
      </div>
    </div>
    <div className="lux-hero-bottom shell"><span>VALORANT / ROSTER / CREATORS / DROP 01</span><a href="#discover">Dentro da SHUSH <span aria-hidden="true">↓</span></a></div>
  </section>;
}
