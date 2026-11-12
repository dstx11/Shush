import { ArrowIcon } from '../ui/ArrowIcon';
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
            <div className="winter-eyebrow"><span className="winter-live-dot" /> SHUSH / WINTER LOBBY <span className="winter-eyebrow-line" /></div>
            <span className="winter-oversized" aria-hidden="true">o lobby aqueceu.</span>
            <h1 id="hero-title">O lobby ainda<br /><em>tem lugar.</em></h1>
          </div>
          <ChristmasTree />
          <div className="winter-hero-story">
            <p>Lá fora faz frio. Aqui há sempre alguém a perguntar se dá para mais uma. Até a árvore ganhou lugar para os sete jogadores.</p>
            <div className="action-row winter-actions">
              <Button href="/esports/valorant/roster">Conhecer a equipa</Button>
              <Button href="/products/jersey" variant="secondary">Explorar Drop 01</Button>
            </div>
            <div className="winter-hero-note"><span aria-hidden="true">✦</span><span>UMA EQUIPA. A NOSSA MANEIRA.</span></div>
          </div>
          <div className="winter-hero-bottom"><span className="mono">SHUSH / VALORANT · WINTER EDITION</span><a className="editorial-link" href="#discover">Descobrir a SHUSH <span aria-hidden="true">↓</span></a></div>
        </div>
      </section>
      <section className="winter-team-section shell" aria-label="Jogadores em destaque">
        <div className="winter-section-heading"><div><span className="section-kicker">O nosso lobby / 2026</span><h2>Sete nicks.<br /><em>Uma árvore.</em></h2></div><p>Os nomes no roster também estão nos ornamentos. Escolhe um e descobre quem anda por este lobby.</p></div>
        <div className="team-cover" aria-label="Jogadores da SHUSH">
          {coverPlayers.map((player, index) => <AppLink className={`team-cover-player cover-${index}`} key={player.id} data-player={player.id} href={`/esports/valorant/roster?player=${player.id}`} aria-label={`Conhecer ${player.displayName}`}><img style={{ objectPosition: player.portraitPosition }} src={player.avatar} srcSet={player.avatar ? `${player.avatar.replace('.webp', '-384.webp')} 384w, ${player.avatar} 768w` : undefined} sizes="(max-width: 767px) 40vw, (max-width: 1050px) 32vw, 23vw" alt="" width="768" height="768" loading="lazy" decoding="async" /><span><small>#{player.number} / {player.roles[0]}</small><strong>{player.displayName}</strong><i aria-hidden="true"><ArrowIcon /></i></span></AppLink>)}
        </div>
        <div className="winter-team-footer"><span className="mono">SHUSH / VALORANT · PEOPLE FIRST</span><AppLink className="editorial-link" href="/esports/valorant/roster">Conhecer os sete jogadores <ArrowIcon /></AppLink></div>
      </section>
    </>
  );
}
