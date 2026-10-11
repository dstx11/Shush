import { useState } from 'react';
import { verifiedMatches, type VerifiedMatch } from '../../data/verified-matches';
import { formatDate } from '../../lib/premier';
import { filterMatches, mapPerformance, type Outcome } from '../../lib/match-explorer';
import { MatchPoster } from './MatchPoster';

export function VerifiedMatches() {
  const [outcome, setOutcome] = useState<Outcome>('all');
  const [map, setMap] = useState('all');
  const [poster, setPoster] = useState<VerifiedMatch | null>(null);
  const matches = filterMatches(verifiedMatches, outcome, map);
  const maps = [...new Set(filterMatches(verifiedMatches, outcome, 'all').map(match => match.map))];
  return <>
    <div className="match-explorer-filters"><div className="calendar-filters" role="group" aria-label="Filtrar resultados">{(['all', 'win', 'loss'] as const).map(value => <button key={value} type="button" aria-pressed={outcome === value} onClick={() => { setOutcome(value); setMap('all'); }}>{value === 'all' ? 'Todas' : value === 'win' ? 'Vitórias' : 'Derrotas'}</button>)}</div><label>Mapa<select value={map} onChange={event => setMap(event.target.value)}><option value="all">Todos os mapas</option>{maps.map(value => <option key={value}>{value}</option>)}</select></label><p className="mono" role="status">{matches.length} de {verifiedMatches.length} partidas</p></div>
    <div className="verified-match-list">{matches.map(match => <article key={match.id} className={`verified-match ${match.shushScore > match.opponentScore ? 'is-win' : 'is-loss'}`}>
      <div className="verified-match-meta"><span className="result-mark">{match.shushScore > match.opponentScore ? 'Vitória' : 'Derrota'}</span><time dateTime={match.date}>{formatDate(match.date)}</time><span>{match.map}</span></div>
      <div className="verified-match-score"><strong>SHUSH</strong><span aria-label={`SHUSH ${match.shushScore}, ${match.opponent} ${match.opponentScore}`}>{match.shushScore}<small>:</small>{match.opponentScore}</span><strong>{match.opponent}</strong></div>
      <details className="match-detail"><summary>Detalhes da partida <span aria-hidden="true">+</span></summary><div className="verified-match-source"><span>Verificado em <time dateTime={match.verifiedAt}>{formatDate(match.verifiedAt)}</time></span><a href={match.source} target="_blank" rel="noopener noreferrer" aria-label={`Ver SHUSH vs ${match.opponent} no Tracker.gg (nova janela)`}>Fonte · Tracker.gg ↗</a></div><button className="utility-button" type="button" onClick={event => { event.currentTarget.focus(); setPoster(match); }}>Criar cartaz ↗</button></details>
    </article>)}</div>
    <section className="map-performance" aria-labelledby="maps-title"><div><h3 id="maps-title">Mapa a mapa.</h3><p>5 partidas verificadas. Uma amostra, não uma classificação.</p></div><div className="map-performance-list">{mapPerformance(verifiedMatches).map(item => <div className="map-performance-row" key={item.map}><strong>{item.map}</strong><span>{item.played} {item.played === 1 ? 'partida' : 'partidas'} · {item.wins} V / {item.losses} D</span><meter min={0} max={100} value={item.rate} aria-label={`Taxa de vitória em ${item.map}`}>{item.rate}%</meter><b>{item.rate}%</b></div>)}</div></section>
    {poster && <MatchPoster match={poster} onClose={() => setPoster(null)} />}
  </>;
}
