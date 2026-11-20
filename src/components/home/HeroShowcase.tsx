import { ArrowIcon } from '../ui/ArrowIcon';
import { AppLink } from '../ui/AppLink';
import { Button } from '../ui/Button';
import { getHomePlayers } from '../../lib/home-selection';
import { ChristmasTree } from './ChristmasTree';
import { PlayerPortrait } from '../ui/PlayerPortrait';

export function HeroShowcase() {
  const featured = getHomePlayers();
  return <>
    <section id="top" className="solstice-hero" aria-labelledby="hero-title"><div className="shell">
      <div className="solstice-heading"><span className="section-kicker">SHUSH / WINTER EDITION</span><h1 id="hero-title">O lobby ainda<br /><em>tem lugar.</em></h1></div>
      <div className="solstice-grid"><div className="solstice-story"><span className="solstice-index">DEZEMBRO / SHUSH</span><p>Lá fora faz frio. Aqui há sempre alguém a perguntar se dá para mais uma.</p><p>Até a árvore ganhou lugar para os sete jogadores.</p><div className="action-row"><Button href="/esports/valorant/roster">Conhecer a equipa</Button></div><a className="editorial-link" href="#winter-lobby-title">Escolher um ornamento <ArrowIcon /></a><span className="solstice-note">UMA EQUIPA. A NOSSA MANEIRA.</span></div><div className="solstice-window"><ChristmasTree /></div></div>
    </div></section>
    <section className="solstice-people shell" aria-label="Jogadores em destaque"><div className="solstice-section-heading"><div><span className="section-kicker">O NOSSO LOBBY</span><h2>Sete nicks.<br /><em>Uma árvore.</em></h2></div><AppLink className="editorial-link" href="/esports/valorant/roster">Conhecer os sete jogadores <ArrowIcon /></AppLink></div><div data-home-roster className="solstice-portraits" aria-label="Jogadores da SHUSH">{featured.map(player => <AppLink key={player.id} data-home-player data-player={player.id} href={`/esports/valorant/roster?player=${player.id}`} aria-label={`Conhecer ${player.displayName}`}><PlayerPortrait player={player} decorative sizes="(max-width: 767px) 220px, max(320px, 30vw)" /><span><small>#{player.number}</small><strong>{player.displayName}</strong><ArrowIcon /></span></AppLink>)}</div></section>
  </>;
}
