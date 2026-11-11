import { AppLink } from '../ui/AppLink';
import { Button } from '../ui/Button';
import { getHomePlayers } from '../../lib/home-selection';
import { ChristmasTree } from './ChristmasTree';

export function HeroShowcase() {
  const coverPlayers = getHomePlayers();
  return (
    <>
      <section id="top" className="opening winter-opening" aria-labelledby="hero-title">
        <div className="shell winter-hero-grid">
          <div className="winter-hero-copy">
            <div className="winter-eyebrow"><span className="winter-live-dot" /> NATAL SHUSH / 2026 <span className="winter-eyebrow-line" /></div>
            <span className="winter-oversized" aria-hidden="true">SHUSH.</span>
            <h1 id="hero-title">Sem barulho.<br /><em>Só magia<br />de Natal.</em></h1>
            <p>Luzes acesas. O lobby cheio. Uma época para celebrar quem joga connosco, quem nos acompanha e as histórias que fazem a SHUSH ser muito mais do que um resultado.</p>
            <div className="action-row winter-actions">
              <Button href="/esports/valorant/roster">Conhecer a equipa</Button>
              <Button href="/products/jersey" variant="secondary">Explorar Drop 01</Button>
            </div>
            <div className="winter-hero-note"><span>01 / 03</span><span>BOAS FESTAS. DO NOSSO LOBBY PARA O TEU.</span></div>
          </div>
          <ChristmasTree />
          <div className="winter-hero-bottom"><span className="mono">UMA EQUIPA. MUITAS HISTÓRIAS.</span><a className="editorial-link" href="#discover">Descobrir a SHUSH <span aria-hidden="true">↓</span></a></div>
        </div>
      </section>
      <section className="winter-team-section shell" aria-label="Jogadores em destaque">
        <div className="winter-section-heading"><div><span className="section-kicker">O nosso lobby / 2026</span><h2>O melhor do Natal?<br /><em>Ter equipa.</em></h2></div><p>Há pessoas por trás de cada nick. Conhece quem faz a SHUSH acontecer, round após round.</p></div>
        <div className="team-cover" aria-label="Jogadores da SHUSH">
          {coverPlayers.map((player, index) => <AppLink className={`team-cover-player cover-${index}`} key={player.id} data-player={player.id} href={`/esports/valorant/roster?player=${player.id}`} aria-label={`Conhecer ${player.displayName}`}><img style={{ objectPosition: player.portraitPosition }} src={player.avatar} srcSet={player.avatar ? `${player.avatar.replace('.webp', '-384.webp')} 384w, ${player.avatar} 768w` : undefined} sizes="(max-width: 767px) 40vw, (max-width: 1050px) 32vw, 23vw" alt="" width="768" height="768" fetchPriority={index === 1 ? 'high' : 'auto'} decoding="async" /><span><small>#{player.number} / {player.roles[0]}</small><strong>{player.displayName}</strong><i aria-hidden="true">↗</i></span></AppLink>)}
        </div>
        <div className="winter-team-footer"><span className="mono">SHUSH / VALORANT · PEOPLE FIRST</span><AppLink className="editorial-link" href="/esports/valorant/roster">Conhecer os sete jogadores ↗</AppLink></div>
      </section>
    </>
  );
}
