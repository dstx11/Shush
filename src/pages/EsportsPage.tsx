import { RosterSection } from '../components/roster/RosterSection';
import { activePremierSeason, tournamentResults } from '../data/season';
import { calculatePlayoffPlacement, calculatePremierScore, calculateSeasonStatus, formatDate, formatResultLine } from '../lib/premier';

export function EsportsPage() {
  const score = calculatePremierScore(activePremierSeason);
  const status = calculateSeasonStatus(activePremierSeason);
  const playoffPlacement = calculatePlayoffPlacement(activePremierSeason.playoffResults);
  const latestMatches = [...activePremierSeason.results].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4);

  return (
    <>
      <section className="page-hero px-5 pb-16 pt-36">
        <div className="page-shell">
          <span className="section-kicker">Valorant</span>
          <h1>A primeira divisao competitiva da SHUSH.</h1>
          <p>Premier, roster e resultados num unico sitio. Sem tabela inventada, sem API externa nesta fase.</p>
        </div>
      </section>

      <section className="esports-section px-5 py-20" aria-labelledby="season-title">
        <div className="page-shell">
          <div className="section-heading">
            <span className="section-kicker">Premier Season Overview</span>
            <h2 id="season-title">Premier Stage</h2>
          </div>
          <div className="metric-grid">
            <Metric label="Status" value={status} />
            <Metric label="Premier Score" value={`${score} / ${activePremierSeason.qualificationPoints}`} />
            <Metric label="Qualification threshold" value={String(activePremierSeason.qualificationPoints)} />
            <Metric label="Next state" value={playoffPlacement?.placement ?? status} />
          </div>
        </div>
      </section>

      <section className="calendar-section px-5 py-20" aria-labelledby="calendar-title">
        <div className="page-shell">
          <div className="section-heading">
            <span className="section-kicker">Premier Calendar</span>
            <h2 id="calendar-title">Semanas Premier</h2>
          </div>
          <div className="calendar-grid">
            {activePremierSeason.weeks.map((week) => (
              <article key={week.id} className="calendar-card">
                <span>Week {week.weekNumber}</span>
                <h3>{week.map ?? 'Mapa por definir'}</h3>
                {week.selectedDays.length > 0 ? (
                  week.selectedDays.map((day) => (
                    <p key={day.id}>
                      {formatDate(day.date)} · {day.windowStart}-{day.windowEnd}
                    </p>
                  ))
                ) : (
                  <p>Dia a confirmar</p>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <RosterSection />

      <section className="matches-section px-5 py-20" aria-labelledby="matches-title">
        <div className="page-shell">
          <div className="section-heading">
            <span className="section-kicker">Latest Matches</span>
            <h2 id="matches-title">Resultados recentes</h2>
          </div>
          <div className="match-list">
            {latestMatches.map((match) => (
              <article key={match.id} className="match-row">
                <span>
                  {formatDate(match.date)} · {match.tournamentName} · {match.map ?? 'Mapa por definir'}
                </span>
                <strong>{formatResultLine(match)}</strong>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="results-section px-5 py-20" aria-labelledby="results-title">
        <div className="page-shell">
          <div className="section-heading">
            <span className="section-kicker">Tournament Results</span>
            <h2 id="results-title">Estados mockados da Fase 1</h2>
          </div>
          <div className="result-grid">
            {tournamentResults.map((result) => (
              <article key={result.id} className="result-card">
                <span>{result.tournamentName}</span>
                <h3>{formatFinalStatus(result.finalStatus)}</h3>
                {result.finalScore !== undefined ? <p>Score: {result.finalScore} / {result.qualificationPoints}</p> : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <article className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function formatFinalStatus(status: string) {
  if (status === 'eliminated_before_playoffs') return 'Eliminated before play-offs';
  return status.replace('-', '-');
}
