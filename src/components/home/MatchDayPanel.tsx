import { Radio, Trophy } from 'lucide-react';
import { activePremierSeason, getPlayersByIds } from '../../data/season';
import { calculatePremierScore, calculatePublicMatchDayState, formatResultLine } from '../../lib/premier';

export function MatchDayPanel() {
  const state = calculatePublicMatchDayState(activePremierSeason);
  const score = calculatePremierScore(activePremierSeason);
  const week = 'week' in state ? state.week : null;
  const convocados = week ? getPlayersByIds(week.convocados) : [];

  return (
    <section className="live-section px-5 py-24" aria-labelledby="match-day-title">
      <div className="live-shell">
        <div className="live-copy">
          <span className="section-kicker">Match Day / Next Premier Window</span>
          <h2 id="match-day-title">{state.title}</h2>
          <p>{state.detail}</p>
        </div>

        <div className="live-panel" data-state={state.kind}>
          <div className="live-panel-top">
            <span>{activePremierSeason.name}</span>
            <strong>
              {score} / {activePremierSeason.qualificationPoints}
            </strong>
          </div>

          {state.kind === 'upcoming' || state.kind === 'match_day_live' || state.kind === 'result_pending' ? (
            <div className="live-stack">
              <p>
                Week {state.week.weekNumber} · {state.week.map ?? 'Mapa por definir'}
              </p>
              <p>
                {state.day.date} · {state.day.windowStart}-{state.day.windowEnd}
              </p>
              {convocados.length > 0 ? (
                <div className="called-block">
                  <span>Convocados</span>
                  <div className="called-list">
                    {convocados.map((player) => (
                      <span key={player.id}>
                        {player.displayName} · {player.roles[0]}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
              {state.kind === 'match_day_live' && state.showStreams ? (
                <span className="live-badge">
                  <Radio aria-hidden="true" className="h-4 w-4" />
                  Streams manuais disponiveis
                </span>
              ) : null}
            </div>
          ) : null}

          {state.kind === 'last_result' || state.kind === 'champions' ? (
            <div className="live-stack">
              <p>{state.result?.map ?? 'Mapa por definir'}</p>
              {state.result ? <strong>{formatResultLine(state.result)}</strong> : null}
              {state.kind === 'champions' ? (
                <span className="live-badge">
                  <Trophy aria-hidden="true" className="h-4 w-4" />
                  Premier Champions
                </span>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
