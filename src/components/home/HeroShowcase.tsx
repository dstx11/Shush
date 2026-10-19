import { AppLink } from '../ui/AppLink';
import { Button } from '../ui/Button';
import { getHomePlayers } from '../../lib/home-selection';


export function HeroShowcase() {
  const coverPlayers = getHomePlayers();
  return <section id="top" className="opening team-opening" aria-labelledby="hero-title">
    <div className="shell opening-grid">
      <div className="opening-label"><span className="section-kicker">SHUSH / VALORANT + CREATORS</span></div>
      <div className="opening-copy">
        <span className="hero-wordmark" aria-hidden="true">SHUSH</span>
        <h1 id="hero-title" className="hero-copy-enter"><span>Sem barulho.</span> <span className="opening-accent">Só rounds.</span></h1>

        <div className="action-row"><Button href="/esports/valorant/roster">Conhecer o roster</Button><Button href="/esports/valorant/premier" variant="secondary">Match Center</Button></div>

      </div>
      <div className="team-cover" onPointerMove={(event) => {
        if (event.pointerType !== 'mouse' || !window.matchMedia('(hover: hover) and (prefers-reduced-motion: no-preference)').matches) return;
        const box = event.currentTarget.getBoundingClientRect();
        event.currentTarget.style.setProperty('--cover-x', `${(event.clientX - box.left - box.width / 2) / box.width * 6}px`);
        event.currentTarget.style.setProperty('--cover-y', `${(event.clientY - box.top - box.height / 2) / box.height * 6}px`);
      }} onPointerLeave={event => { event.currentTarget.style.setProperty('--cover-x', '0px'); event.currentTarget.style.setProperty('--cover-y', '0px'); }} aria-label="Jogadores da SHUSH">
        {coverPlayers.map((player, index) => <AppLink className={`team-cover-player cover-${index}`} key={player.id} data-player={player.id} href={`/esports/valorant/roster?player=${player.id}`} aria-label={`Conhecer ${player.displayName}`}><img style={{ objectPosition: player.portraitPosition }} src={player.avatar} srcSet={player.avatar ? `${player.avatar.replace('.webp', '-384.webp')} 384w, ${player.avatar} 768w` : undefined} sizes="(max-width: 767px) 40vw, (max-width: 1050px) 32vw, 23vw" alt="" width="768" height="768" fetchPriority={index === 1 ? 'high' : 'auto'} decoding="async" /><span><small>#{player.number} / {player.roles[0]}</small><strong>{player.displayName}</strong><i aria-hidden="true">↗</i></span></AppLink>)}

      </div>
      <div className="opening-foot"><span className="mono">VALORANT · EQUIPA · COMUNIDADE</span><a className="editorial-link" href="#discover">Explorar a SHUSH <span aria-hidden="true">↓</span></a></div>
    </div>
  </section>;
}
