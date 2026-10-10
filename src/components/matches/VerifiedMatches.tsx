import { verifiedMatches } from '../../data/verified-matches';
import { formatDate } from '../../lib/premier';

export function VerifiedMatches({ limit }: { limit?: number }) {
  return <div className="verified-match-list">{verifiedMatches.slice(0, limit).map((match, index) => {
    const win = match.shushScore > match.opponentScore;
    return <article key={match.id} className={`verified-match ${win ? 'is-win' : 'is-loss'}${index === 0 ? ' is-latest' : ''}`}>
      <div className="verified-match-meta"><span className="result-mark">{win ? 'Vitória' : 'Derrota'}</span><time dateTime={match.date}>{formatDate(match.date)}</time><span>{match.map}</span></div>
      <div className="verified-match-score"><strong>SHUSH</strong><span aria-label={`SHUSH ${match.shushScore}, ${match.opponent} ${match.opponentScore}`}>{match.shushScore}<small>:</small>{match.opponentScore}</span><strong>{match.opponent}</strong></div>
      <div className="verified-match-source"><span>Verificado em <time dateTime={match.verifiedAt}>{formatDate(match.verifiedAt)}</time></span><a href={match.source} target="_blank" rel="noopener noreferrer" aria-label={`Ver SHUSH vs ${match.opponent} no Tracker.gg (nova janela)`}>Fonte · Tracker.gg <span aria-hidden="true">↗</span></a></div>
    </article>;
  })}</div>;
}
