import { SceneLight } from '../motion/SceneLight';
import { useState, type CSSProperties } from 'react';
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
  const [active, setActive] = useState(1);
  const cover = featured[active];
  return <section id="top" className="lux-hero" aria-labelledby="hero-title">
    <div className="campaign-stage">
      <SceneLight material="silk" />
      <div className="campaign-masthead" style={{'--name-scale': 108 / (cover.displayName.length + 1)} as CSSProperties} aria-hidden="true">{cover.displayName}</div>
      <div className="campaign-sitter" key={cover.id} style={{ '--silhouette': `url("/assets/campaign/${cover.id}-mask.svg")` } as CSSProperties} aria-hidden="true">
        <PlayerPortrait player={cover} eager decorative sizes="(max-width: 767px) min(100vw, 46svh), min(70vw, 57svh)" />
      </div>
      <AppLink href={`/esports/valorant/roster?player=${cover.id}`} className="campaign-credit" aria-label={`Abrir perfil de ${cover.displayName}`}>
        <span>#{cover.number}</span><strong>{cover.displayName}</strong>
        <small>{cover.roles.join(' / ')}</small>
      </AppLink>
    </div>
    <div className="campaign-caption shell">
      <div className="campaign-title">
        <p className="section-kicker">{id === 'base' ? 'VALORANT  /  PORTUGAL' : theme.label}</p>
        <h1 id="hero-title">{id === 'base' ? <>Sem barulho.{' '}<em>Só rounds.</em></> : <>{theme.title[0]}{' '}<em>{theme.title[1]}</em></>}</h1>
        {id !== 'base' && <p className="campaign-lead">{theme.lead}</p>}
        <Button href="/esports/valorant/roster">Conhecer o roster</Button>
      </div>
    </div>
    <div className="campaign-index shell">
      <a className="campaign-discover" href="#discover">Dentro da SHUSH <span aria-hidden="true">↓</span></a>
      <nav className="campaign-frames" data-home-roster aria-label="Jogadores em destaque">
        {featured.map((player,index) => <AppLink className="campaign-frame" key={player.id} data-home-player data-player={player.id} data-featured={active === index}
          href={`/esports/valorant/roster?player=${player.id}`} onMouseEnter={() => setActive(index)} onFocus={() => setActive(index)}
          aria-label={`Conhecer ${player.displayName}`}>
          <PlayerPortrait player={player} decorative thumbnail sizes="64px" />
          <span><small>#{player.number}</small><strong>{player.displayName}</strong></span>
        </AppLink>)}
      </nav>
    </div>
  </section>;
}
