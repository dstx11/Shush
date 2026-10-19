import { AppLink } from '../ui/AppLink';
import { PlayerPortrait } from '../ui/PlayerPortrait';
import { creators, players } from '../../data/players';
import { verifiedMatches } from '../../data/verified-matches';
import { formatDate } from '../../lib/premier';

export function HomeHub() {
  return <div className="home-discover shell" id="discover">
    <section aria-labelledby="discover-title" className="home-roster-gallery">
      <div className="section-index"><h2 id="discover-title">Quem está no lobby.</h2><AppLink className="editorial-link" href="/esports/valorant/roster">Escolher jogador ↗</AppLink></div>
      <div className="home-lineup">{players.map(player => <AppLink key={player.id} href={`/esports/valorant/roster?player=${player.id}`} aria-label={`Conhecer ${player.displayName}`}><div><PlayerPortrait player={player} decorative sizes="(max-width: 767px) 40vw, 14vw" /><span className="mono">#{player.number}</span></div><strong>{player.displayName}</strong><small>{player.roles[0]}</small></AppLink>)}</div>
    </section>
    <section className="home-records" aria-labelledby="home-records-title">
      <div className="home-records-heading"><span className="section-kicker">Premier / abril–junho 2026</span><h2 id="home-records-title">Dentro do<br /> servidor.</h2><p>Partidas do nosso registo. Verificação manual de 10 de outubro de 2026.</p><AppLink className="editorial-link" href="/esports/valorant/premier#verified-results">Ver todas as partidas ↗</AppLink></div>
      <div className="home-score-list">{verifiedMatches.slice(0,3).map(match => <AppLink key={match.id} className="home-score" href="/esports/valorant/premier#verified-results" aria-label={`SHUSH ${match.shushScore}, ${match.opponent} ${match.opponentScore}; ${formatDate(match.date)}`}><span className="home-score-meta"><time dateTime={match.date}>{formatDate(match.date)}</time><span>{match.map}</span></span><span className="home-score-teams"><strong>SHUSH <span>vs {match.opponent}</span></strong><b>{match.shushScore}<small>:</small>{match.opponentScore}</b></span></AppLink>)}</div>
    </section>
    <section className="home-people" aria-labelledby="home-creators-title"><div><span className="section-kicker">Creators</span><h2 id="home-creators-title">Do outro lado<br /> do ecrã.</h2><AppLink className="editorial-link" href="/content">Conhecer os canais ↗</AppLink></div><div className="home-creator-links">{creators.map(player => <AppLink key={player.id} href={player.creatorUrl!} target="_blank" rel="noopener noreferrer"><PlayerPortrait player={player} decorative thumbnail sizes="80px" /><span><strong>{player.displayName}</strong><small>{player.creatorType === 'twitch' ? 'Twitch' : 'YouTube'}</small></span><span aria-hidden="true">↗</span></AppLink>)}</div></section>
    <div className="home-closing"><AppLink href="/company"><span className="section-kicker">Sobre a SHUSH</span><strong>Antes da equipa,<br />a amizade.</strong><span>Conhecer a história ↗</span></AppLink><AppLink href="/products/jersey"><span className="section-kicker">Drop 01</span><strong>O teu nick.<br />A nossa camisola.</strong><span>Personalizar ↗</span></AppLink></div>
  </div>;
}
