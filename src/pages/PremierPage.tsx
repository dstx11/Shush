import { Button } from '../components/ui/Button';
import { Reveal } from '../components/ui/Reveal';
import { activePremierSeason } from '../data/season';
import {
  calculatePremierScore,
  calculatePublicMatchDayState,
  calculateSeasonStatus,
  formatDate,
  formatResultLine,
  formatSeasonStatus,
} from '../lib/premier';

const trackerTeamUrl = 'https://tracker.gg/valorant/premier/teams/a5552155-90d0-4559-b879-f08e5f9f05b8';

export function PremierPage() {
  const score = calculatePremierScore(activePremierSeason);
  const status = calculateSeasonStatus(activePremierSeason);
  const state = calculatePublicMatchDayState(activePremierSeason);
  const completedResults = activePremierSeason.results.filter((result) => result.outcome === 'win' || result.outcome === 'loss');
  const played = completedResults.length;
  const wins = completedResults.filter((result) => result.outcome === 'win').length;
  const losses = completedResults.filter((result) => result.outcome === 'loss').length;

  return (
    <div className="audit-premier-page">
      <section className="audit-premier-hero px-5 pb-14 pt-36" aria-labelledby="premier-title">
        <div className="audit-page-shell">
          <Reveal className="audit-premier-intro">
            <span className="section-kicker">Valorant / Premier</span>
            <h1 id="premier-title">Match Center.</h1>
            <p>Acompanha o estado competitivo da SHUSH num único sítio: pontuação, calendário e resultados publicados.</p>

            <div className="audit-premier-state">
              <div>
                <span>Estado atual</span>
                <strong>{state.title}</strong>
                <p>{state.detail}</p>
              </div>
              <Button href={trackerTeamUrl} target="_blank" rel="noreferrer" variant="secondary">
                Tracker da equipa
              </Button>
            </div>
          </Reveal>

          <Reveal className="audit-score-card" delay={0.06}>
            <span>Pontuação Premier</span>
            <div>
              <strong>{score}</strong>
              <small>/ {activePremierSeason.qualificationPoints}</small>
            </div>
            <p>{formatSeasonStatus(status)}</p>
          </Reveal>
        </div>
      </section>

      <section className="audit-premier-body px-5 pb-24">
        <div className="audit-page-shell">
          <div className="audit-premier-stats">
            <Reveal>
              <span>Jogos publicados</span>
              <strong>{played}</strong>
            </Reveal>
            <Reveal delay={0.04}>
              <span>Vitórias</span>
              <strong>{wins}</strong>
            </Reveal>
            <Reveal delay={0.08}>
              <span>Derrotas</span>
              <strong>{losses}</strong>
            </Reveal>
            <Reveal delay={0.12}>
              <span>Qualificação</span>
              <strong>{activePremierSeason.qualificationPoints}</strong>
            </Reveal>
          </div>

          <div className="audit-premier-columns">
            <Reveal className="audit-premier-section">
              <div className="audit-section-heading">
                <div>
                  <span className="section-kicker">Calendário</span>
                  <h2>Fase publicada</h2>
                  <small className="audit-timezone-note">Horários em Lisboa · Europe/Lisbon</small>
                </div>
                <span className="audit-section-mark" aria-hidden="true">P</span>
              </div>

              <div className="audit-week-list">
                {activePremierSeason.weeks.map((week) => (
                  <article key={week.id} className="audit-week-row">
                    <span>{String(week.weekNumber).padStart(2, '0')}</span>
                    <div>
                      <strong>{week.map ?? 'Mapa por definir'}</strong>
                      {week.selectedDays.length > 0 ? (
                        week.selectedDays.map((day) => (
                          <small key={day.id}>{formatDate(day.date)} · {day.windowStart}-{day.windowEnd}</small>
                        ))
                      ) : (
                        <small>Sem dia publicado</small>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </Reveal>

            <Reveal id="results" className="audit-premier-section scroll-mt-28" delay={0.06}>
              <div className="audit-section-heading">
                <div>
                  <span className="section-kicker">Resultados</span>
                  <h2>Jogos confirmados</h2>
                </div>
                <a href={trackerTeamUrl} target="_blank" rel="noreferrer" aria-label="Abrir Tracker">
                  <span aria-hidden="true">↗</span>
                </a>
              </div>

              <div className="audit-result-list">
                {completedResults.length > 0 ? (
                  completedResults.map((result) => (
                    <article key={result.id} className={`audit-result-row is-${result.outcome}`}>
                      <div>
                        <span>{formatDate(result.date)}</span>
                        <small>{result.map ?? 'Mapa por definir'}</small>
                      </div>
                      <strong>{formatResultLine(result)}</strong>
                    </article>
                  ))
                ) : (
                  <p className="audit-empty-copy">Ainda não existem resultados publicados.</p>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
