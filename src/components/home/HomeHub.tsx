import { useState, type CSSProperties } from 'react';
import '../../styles/luxury-discovery.css';
import { ArrowIcon } from '../ui/ArrowIcon';
import { AppLink } from '../ui/AppLink';
import { ChannelPortrait } from '../ui/ChannelPortrait';
import { PlayerPortrait } from '../ui/PlayerPortrait';
import { creators, players } from '../../data/players';
import { verifiedMatches, verifiedMatchHref } from '../../data/verified-matches';
import { formatDate } from '../../lib/premier';
const lastChecked = formatDate(verifiedMatches[0].verifiedAt);

const rosterRoles = [...new Set(players.flatMap(player => player.roles))].sort((a, b) => a.localeCompare(b, 'pt'));

function TeamSheet() {
  const [role, setRole] = useState('');
  const lineup = role ? players.filter(player => player.roles.includes(role)) : players;

  return (
    <section id="plantel" className="lux-roster-gallery" aria-labelledby="discover-title">
      <header className="lux-roster-heading">
        <div>
          <span className="sheet-edition">SHUSH / VALORANT</span>
          <h2 id="discover-title">O <i>plantel.</i></h2>
        </div>
        <label className="sheet-filter">
          Filtrar por função
          <select value={role} onChange={event => setRole(event.target.value)}>
            <option value="">Todas as funções</option>
            {rosterRoles.map(name => <option key={name}>{name}</option>)}
          </select>
        </label>
      </header>
      <div className="lux-lineup">
        {lineup.map(player => (
          <AppLink key={player.id} href={`/esports/valorant/roster?player=${player.id}`}
            aria-label={`Conhecer ${player.displayName}, número ${player.number}, ${player.roles.join(' e ')}`}>
            <span className="sheet-portrait" style={{ '--cutout': `url("/assets/campaign/${player.id}-mask.svg")` } as CSSProperties}>
              <PlayerPortrait player={player} decorative sizes="(max-width: 700px) 25vw, 190px" />
            </span>
            <span className="sheet-number" aria-hidden="true">#{player.number}</span>
            <strong>{player.displayName}</strong>
            <small>{role || player.roles[0]}</small>
          </AppLink>
        ))}
      </div>
      <footer className="sheet-footer">
        <span role="status">{role ? `${lineup.length} de ${players.length} jogadores` : `${players.length} jogadores`}</span>
        <AppLink href="/esports/valorant/roster">Explorar o plantel <ArrowIcon /></AppLink>
      </footer>
    </section>
  );
}

export function HomeHub() {
  return <div className="lux-discover shell" id="discover">
    <nav className="discovery-nav" aria-label="Nesta página"><a href="#arquivo">Partidas</a><a href="#plantel">Plantel</a><a href="#canais">Canais</a></nav>
    <section id="arquivo" className="lux-records" aria-labelledby="lux-records-title"><div className="lux-chapter">Premier / Arquivo</div><div className="lux-ledger">
      <div className="lux-ledger-intro"><span className="section-kicker">Premier / abril–junho 2026</span><h2 id="lux-records-title">Últimas<br />partidas.</h2><p>Partidas documentadas. Última verificação: {lastChecked}.</p><AppLink className="editorial-link" href="/esports/valorant/premier#verified-results">Ver todas as partidas <ArrowIcon /></AppLink></div>
      <div className="lux-ledger-list">{verifiedMatches.slice(0,3).map(match => <AppLink key={match.id} className="lux-score" href={verifiedMatchHref(match)} aria-label={`SHUSH ${match.shushScore}, ${match.opponent} ${match.opponentScore}; ${formatDate(match.date)}`}><span className="lux-score-meta"><time dateTime={match.date}>{formatDate(match.date)}</time><span>{match.map}</span></span><span className="lux-score-teams"><strong>SHUSH <span>vs {match.opponent}</span></strong><b>{match.shushScore}<small>:</small>{match.opponentScore}</b></span></AppLink>)}</div></div>
    </section>
    <TeamSheet />
    <section id="canais" className="lux-people" aria-labelledby="home-creators-title">
      <header className="channels-heading">
        <h2 id="home-creators-title">Do outro lado <em>do microfone.</em></h2>
        <AppLink className="editorial-link" href="/content">Conhecer os canais <ArrowIcon /></AppLink>
      </header>
      <div className="lux-creator-links">
        {creators.map(player => {
          const platform = player.creatorType === 'twitch' ? 'Twitch' : 'YouTube';
          return (
            <AppLink key={player.id} data-channel={player.creatorType} href={player.creatorUrl!}
              target="_blank" aria-label={`${platform} de ${player.displayName}, ${player.creatorHandle}`}>
              <span className="channel-caption">
                <small>{platform}</small>
                <strong>{player.displayName}</strong>
                <span>{player.creatorHandle} <ArrowIcon /></span>
              </span>
              <ChannelPortrait player={player} sizes="(max-width: 700px) 46vw, 25vw" />
            </AppLink>
          );
        })}
      </div>
    </section>
    <div className="lux-closing"><AppLink href="/company"><span className="section-kicker">Sobre a SHUSH</span><strong>Começámos com<br />uma piada.</strong><span>Ler a nossa história <ArrowIcon /></span></AppLink></div>
  </div>;
}
