import '../../styles/luxury-discovery.css';
import { ArrowIcon } from '../ui/ArrowIcon';
import { AppLink } from '../ui/AppLink';
import { PlayerPortrait } from '../ui/PlayerPortrait';
import { creators, players } from '../../data/players';
import { verifiedMatches, verifiedMatchHref } from '../../data/verified-matches';
import { formatDate } from '../../lib/premier';
const lastChecked = formatDate(verifiedMatches[0].verifiedAt);

export function HomeHub() {
  return <div className="lux-discover shell" id="discover">
    <section aria-labelledby="discover-title" className="lux-roster-gallery">
      <div className="lux-chapter"><b>01</b> AS PESSOAS</div><div className="lux-roster-heading"><h2 id="discover-title">Sete identidades.<br /><em>A mesma tag.</em></h2><AppLink className="editorial-link" href="/esports/valorant/roster">Conhecer jogadores <ArrowIcon /></AppLink></div>
      <div className="lux-lineup">{players.map(player => <AppLink key={player.id} href={`/esports/valorant/roster?player=${player.id}`} aria-label={`Conhecer ${player.displayName}`}><div><PlayerPortrait player={player} decorative sizes="(max-width: 767px) 40vw, 14vw" /><span className="mono">#{player.number}</span></div><strong>{player.displayName}</strong><small>{player.roles[0]}</small></AppLink>)}</div>
    </section>
    <section className="lux-records" aria-labelledby="lux-records-title"><div className="lux-chapter"><b>02</b> O ARQUIVO COMPETITIVO</div><div className="lux-ledger">
      <div className="lux-ledger-intro"><span className="section-kicker">Premier / abril–junho 2026</span><h2 id="lux-records-title">O resultado<br /> fica.</h2><p>Partidas documentadas. Última verificação: {lastChecked}.</p><AppLink className="editorial-link" href="/esports/valorant/premier#verified-results">Ver todas as partidas <ArrowIcon /></AppLink></div>
      <div className="lux-ledger-list">{verifiedMatches.slice(0,3).map(match => <AppLink key={match.id} className="lux-score" href={verifiedMatchHref(match)} aria-label={`SHUSH ${match.shushScore}, ${match.opponent} ${match.opponentScore}; ${formatDate(match.date)}`}><span className="lux-score-meta"><time dateTime={match.date}>{formatDate(match.date)}</time><span>{match.map}</span></span><span className="lux-score-teams"><strong>SHUSH <span>vs {match.opponent}</span></strong><b>{match.shushScore}<small>:</small>{match.opponentScore}</b></span></AppLink>)}</div></div>
    </section>
    <section className="lux-people" aria-labelledby="home-creators-title"><div><span className="section-kicker">Creators</span><h2 id="home-creators-title">Nem tudo fica<br /> no Discord.</h2><AppLink className="editorial-link" href="/content">Conhecer os canais <ArrowIcon /></AppLink></div><div className="lux-creator-links">{creators.map(player => <AppLink key={player.id} href={player.creatorUrl!} target="_blank" rel="noopener noreferrer"><PlayerPortrait player={player} decorative thumbnail sizes="80px" /><span><strong>{player.displayName}</strong><small>{player.creatorType === 'twitch' ? 'Twitch' : 'YouTube'}</small></span><span aria-hidden="true"><ArrowIcon /></span></AppLink>)}</div></section>
    <div className="lux-closing"><AppLink href="/company"><span className="section-kicker">Sobre a SHUSH</span><strong>Começámos com<br />uma piada.</strong><span>Ler a nossa história <ArrowIcon /></span></AppLink><AppLink href="/products/jersey"><span className="section-kicker">Drop 01</span><strong>A nossa camisola.<br />O teu nick.</strong><span>Personalizar <ArrowIcon /></span></AppLink></div>
  </div>;
}
