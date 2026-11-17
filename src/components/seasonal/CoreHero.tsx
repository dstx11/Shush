import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { AppLink } from '../ui/AppLink';
import { Button } from '../ui/Button';
import { ArrowIcon } from '../ui/ArrowIcon';
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
  const atmosphere = useRef<HTMLElement>(null);
  useEffect(() => {
    const node = atmosphere.current;
    if (!node || !('IntersectionObserver' in window)) return;
    let visible = false;
    const sync = () => { node.dataset.sceneVisible = String(visible && !document.hidden); };
    const observer = new IntersectionObserver(entries => { visible = entries[0]?.isIntersecting ?? false; sync(); });
    observer.observe(node);
    document.addEventListener('visibilitychange', sync);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', sync); };
  }, []);
  return <section ref={atmosphere} data-scene-visible="false" id="top" className="lux-hero" aria-labelledby="hero-title">
    <div className="campaign-stage">
      <div className="campaign-masthead" aria-hidden="true">SHUSH</div>
      <div className="campaign-sitter" key={cover.id} style={{ '--silhouette': `url("/assets/campaign/${cover.id}-mask.svg")` } as CSSProperties} aria-hidden="true">
        <PlayerPortrait player={cover} eager decorative sizes="768px" />
      </div>
      <div className="campaign-caption shell">
        <div className="campaign-title">
          <p className="section-kicker">{id === 'base' ? 'VALORANT  /  PORTUGAL' : theme.label}</p>
          <h1 id="hero-title">{id === 'base' ? <>Sem barulho.<br /><em>Só rounds.</em></> : <>{theme.title[0]}<br /><em>{theme.title[1]}</em></>}</h1>
          {id !== 'base' && <p className="campaign-lead">{theme.lead}</p>}
          <Button href="/esports/valorant/roster">Conhecer o roster</Button>
        </div>
        <AppLink href={`/esports/valorant/roster?player=${cover.id}`} className="campaign-credit" aria-label={`Abrir perfil de ${cover.displayName}`}>
          <span>CAMISOLA {cover.number}</span><strong>{cover.displayName} <ArrowIcon /></strong>
          <small>{cover.roles.join(' / ')}</small>
        </AppLink>
      </div>
    </div>
    <div className="campaign-index shell">
      <a className="campaign-discover" href="#discover">Dentro da SHUSH <span aria-hidden="true">↓</span></a>
      <nav className="campaign-frames" data-home-roster aria-label="Jogadores em destaque">
        {featured.map((player,index) => <AppLink className="campaign-frame" key={player.id} data-home-player data-player={player.id} data-featured={active === index}
          href={`/esports/valorant/roster?player=${player.id}`} onMouseEnter={() => setActive(index)} onFocus={() => setActive(index)}
          aria-label={`Conhecer ${player.displayName}`}>
          <PlayerPortrait player={player} decorative thumbnail sizes="64px" />
          <span><small>#{player.number}</small><strong>{player.displayName}</strong></span><ArrowIcon />
        </AppLink>)}
      </nav>
    </div>
  </section>;
}
