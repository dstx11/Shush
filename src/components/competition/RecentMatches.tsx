import { recentTrackerMatches, trackerTeamUrl, trackerVerifiedAt } from '../../data/tracker-matches';

export function RecentMatches({ compact = false }: { compact?: boolean }) {
  return (
    <section className={`shush-recent-matches${compact ? ' is-compact' : ''}`} aria-labelledby="recent-tracker-title">
      <div className="shush-recent-heading">
        <div><span className="section-kicker">TRACKER.GG / HISTÓRICO DA EQUIPA</span><h2 id="recent-tracker-title">Últimas partidas <span>registadas.</span></h2></div>
        <a className="editorial-link" href={trackerTeamUrl} target="_blank" rel="noopener noreferrer">Ver histórico no Tracker.gg <span aria-hidden="true">↗</span></a>
      </div>
      <div className="shush-recent-grid">
        {recentTrackerMatches.slice(0, compact ? 3 : 5).map((match, index) => <article className="shush-recent-card" key={match.id}>
          <div className="shush-recent-meta"><span className="mono">{String(index + 1).padStart(2, '0')} / {match.map}</span><time dateTime={match.date}>{new Intl.DateTimeFormat('pt-PT', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(match.date + 'T12:00:00Z'))}</time></div>
          <div className="shush-recent-score"><span>SHUSH</span><strong aria-label={`SHUSH ${match.shushScore}, ${match.opponent} ${match.opponentScore}`}><span>{match.shushScore}</span><small>:</small><span>{match.opponentScore}</span></strong><span className="opponent">{match.opponent}</span></div>
          <div className="shush-recent-bottom"><span className={match.shushScore > match.opponentScore ? 'is-win' : 'is-loss'}>{match.shushScore > match.opponentScore ? 'VITÓRIA' : 'DERROTA'}</span><span className="mono">Premier / Tracker</span></div>
        </article>)}
      </div>
      <p className="shush-recent-disclaimer">Registo público consultado em <time dateTime={trackerVerifiedAt}>10/10/2026</time>. Não é atualização em direto; partidas posteriores podem existir no Tracker.gg. O arquivo interno Premier abaixo é um registo separado.</p>
    </section>
  );
}
