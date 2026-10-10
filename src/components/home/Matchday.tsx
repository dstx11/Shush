import { players } from '../../data/players';
import { activePremierSeason as season } from '../../data/season';
import { formatDate } from '../../lib/premier';
import type { resolveMatchday } from '../../lib/matchday';
import { AppLink } from '../ui/AppLink';

type Day = NonNullable<ReturnType<typeof resolveMatchday>>;
export function Matchday({ match }: { match: Day }) {
  const { day, week, phase, result, archive } = match;
  const lineup = week.convocados.map(id => players.find(player => player.id === id)).filter(player => !!player);
  return <section id="top" className="matchday opening" aria-labelledby="matchday-title">
    <div className="shell">
      <div className="matchday-top"><span className="section-kicker">SHUSH MATCHDAY / {archive ? 'Arquivo' : 'Jornada'}</span><AppLink href="/?view=home#home-roster-title" className="editorial-link">Explorar a Home ↗</AppLink></div>
      <div className="matchday-stage">
        <div className="matchday-copy"><p className="mono">{season.tournamentName} / Jornada {week.weekNumber} / {formatDate(day.date)}</p><h1 id="matchday-title">{phase === 'cancelled' ? 'Jornada cancelada.' : result ? 'O round fica.' : 'É dia de SHUSH.'}</h1><div className="matchday-versus"><strong>SHUSH</strong><span>{result?.shushScore !== undefined ? `${result.shushScore} : ${result.opponentScore}` : 'VS'}</span><strong>{result?.opponent || 'Adversário por confirmar'}</strong></div><p className="matchday-state">{phase === 'cancelled' ? 'Cancelamento publicado pela equipa' : phase === 'result' ? 'Resultado publicado' : phase === 'upcoming' ? `A janela abre em ${match.countdown}` : phase === 'window' ? 'Janela Premier aberta · início da partida por confirmar' : 'Resultado por confirmar'}</p><div className="action-row"><AppLink className="site-button button-primary" href="/esports/valorant/premier">Abrir Match Center →</AppLink>{result?.highlightUrl ? <a className="editorial-link" href={result.highlightUrl} target="_blank" rel="noopener noreferrer">Ver highlights ↗</a> : null}</div></div>
        <div className="matchday-map"><span className="mono">Território do round</span><strong>{week.map || 'Mapa por definir'}</strong><div className="matchday-crosshair" aria-hidden="true"><span>SHS</span></div><p className="mono">{day.windowStart}–{day.windowEnd}<br />Hora de Lisboa · janela de inscrição</p></div>
      </div>
      <div className="matchday-lineup"><div><span className="section-kicker">Convocados publicados</span><p>{lineup.length ? `${lineup.length} jogadores / Jornada ${week.weekNumber}` : 'Convocatória por publicar'}</p></div><div className="matchday-players">{lineup.map(player => <AppLink key={player.id} href={`/esports/valorant/roster?player=${player.id}`} aria-label={`Conhecer ${player.displayName}`}>{player.avatar ? <img src={player.avatar} alt="" width="768" height="768" /> : <span className="matchday-initials">{player.initials}</span>}<strong>{player.displayName}</strong><small>{player.roles[0]}</small></AppLink>)}</div></div>
      {phase === 'window' && week.streams.some(stream => stream.enabled) ? <div className="matchday-channels"><span>Canais da equipa · direto não confirmado</span>{week.streams.filter(stream => stream.enabled).map(stream => <a key={stream.playerId} href={stream.url} target="_blank" rel="noopener noreferrer">{players.find(player => player.id === stream.playerId)?.displayName} ↗</a>)}</div> : null}
    </div>
  </section>;
}
