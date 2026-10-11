import { creators, players } from '../../data/players';
import { VerifiedMatches } from '../matches/VerifiedMatches';
import { Button } from '../ui/Button';
import { AppLink } from '../ui/AppLink';
import { HomePlayerRail } from './HomePlayerRail';

export function HomeHub() {
  return (
    <div className="home-editorial">
      <section className="home-roster" aria-labelledby="home-roster-title">
        <div className="shell">
          <div className="section-index"><span className="section-kicker">01 / A equipa</span><span className="mono">Valorant · {players.length} jogadores</span></div>
          <div className="section-heading"><div><h2 id="home-roster-title">O roster.</h2></div><AppLink className="editorial-link" href="/esports/valorant/roster">Conhecer o roster <span aria-hidden="true">↗</span></AppLink></div>
          <HomePlayerRail />
        </div>
      </section>
      <section id="match-day" className="home-competition" aria-labelledby="home-premier-title"><div className="shell"><div className="section-index"><span className="section-kicker">02 / Premier</span><span className="mono">Registo verificado · atualização manual</span></div><div className="section-heading"><div><h2 id="home-premier-title">Últimos rounds.</h2><p className="body-copy">As últimas partidas disponíveis no Tracker.gg, verificadas em 10 de outubro de 2026.</p></div><AppLink className="editorial-link" href="/esports/valorant/premier">Abrir Match Center ↗</AppLink></div><VerifiedMatches limit={3} /></div></section>
      <section id="creator-pulse" className="home-creators" aria-labelledby="home-creators-title">
        <div className="shell">
          <div className="section-index"><span className="section-kicker">03 / Creators</span><span className="mono">Twitch + YouTube</span></div>
          <div className="section-heading"><h2 id="home-creators-title">Fora do servidor.</h2><AppLink className="editorial-link" href="/content">Ver creators <span aria-hidden="true">↗</span></AppLink></div>
          <div className="home-channel-list">{creators.map((creator) => <a key={creator.id} href={creator.creatorUrl} target="_blank" rel="noopener noreferrer" className={`home-channel is-${creator.creatorType}`}><div className="home-channel-art" aria-hidden="true">{creator.avatar ? <img src={creator.avatar} alt="" width="768" height="768" loading="lazy" decoding="async" /> : <span>{creator.initials}</span>}</div><div className="home-channel-copy"><span className="platform-name">{creator.creatorType === 'twitch' ? 'Twitch' : 'YouTube'}</span><strong>{creator.displayName}</strong><span className="channel-destination">Abrir canal <span aria-hidden="true">↗</span></span></div></a>)}</div>
        </div>
      </section>
      <section className="home-story"><div className="shell"><span className="section-kicker">04 / A nossa história</span><h2>Antes do nome,<br /><span>já havia um grupo.</span></h2><p className="body-copy">Começámos por ficar para mais uma partida. O nome veio depois.</p><AppLink className="editorial-link" href="/company">Conhecer a SHUSH ↗</AppLink></div></section>
      <section className="home-drop" aria-labelledby="home-drop-title"><div className="shell home-drop-inline"><div><span className="section-kicker">05 / Drop 01</span><h2 id="home-drop-title">Drop 01.</h2></div><p className="body-copy">O teu nick. O teu número.</p><Button href="/products/jersey" variant="secondary">Explorar Drop 01</Button></div></section>
    </div>
  );
}
