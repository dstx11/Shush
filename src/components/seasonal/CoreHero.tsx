import { useEffect, useRef } from 'react';
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
    <div className="lux-hero-top shell"><span>SHUSH / VALORANT + CREATORS</span><span>{id === 'base' ? 'SILENCE BEFORE IMPACT' : theme.label}</span></div>
    <div className="lux-hero-layout shell">
      <div className="lux-hero-copy">
        <p className="lux-eyebrow"><span aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" focusable="false"><path d="M6 3v13h12m-5-5 5 5-5 5" /></svg></span> Uma equipa. A nossa maneira.</p>
        <h1 id="hero-title">{id === 'base' ? <>Sem barulho.<br /><em>Só rounds.</em></> : <>{theme.title[0]}<br /><em>{theme.title[1]}</em></>}</h1>
        <p className="lux-hero-lead">{id === 'base' ? 'Sete pessoas. Uma tag. A mesma vontade de voltar ao servidor.' : theme.lead}</p>
        <div className="lux-hero-actions"><Button href="/esports/valorant/roster">Conhecer o roster</Button><AppLink href="/company" className="lux-text-link">A nossa história <ArrowIcon /></AppLink></div>
        <div className="lux-hero-note"><span className="lux-rule" aria-hidden="true" /><p>O silêncio é nosso.<br /><strong>O próximo round também.</strong></p></div>
      </div>
      <div data-home-roster className="lux-hero-gallery" aria-label="Jogadores da SHUSH">
        <span className="lux-hero-orbit" aria-hidden="true" />
        <div className="lux-hero-gallery-label"><span>AS PESSOAS POR TRÁS DA TAG</span><span>01 — 07</span></div>
        {featured.map((player,index) => <AppLink className={`lux-portrait lux-portrait-${index}`} key={player.id} data-home-player data-player={player.id} href={`/esports/valorant/roster?player=${player.id}`} aria-label={`Conhecer ${player.displayName}`}><PlayerPortrait player={player} decorative eager sizes={index === 1 ? '(max-width: 767px) 280px, (max-width: 1000px) 350px, 420px' : '(max-width: 767px) 225px, (max-width: 1000px) 270px, 320px'} /><span><small>#{player.number} / SHUSH</small><strong>{player.displayName}</strong><i aria-hidden="true"><ArrowIcon /></i></span></AppLink>)}
        <span className="lux-gallery-footer">SILENCE BEFORE IMPACT</span>
      </div>
    </div>
    <div className="lux-hero-bottom shell"><span>VALORANT / ROSTER / CREATORS / DROP 01</span><a href="#discover">Dentro da SHUSH <svg aria-hidden="true" focusable="false" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 3v18m-6-6 6 6 6-6" /></svg></a></div>
  </section>;
}
