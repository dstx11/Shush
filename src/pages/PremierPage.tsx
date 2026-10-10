import { useState } from 'react';
import { Button } from '../components/ui/Button';
import { AppLink } from '../components/ui/AppLink';
import { players } from '../data/players';
import { activePremierSeason as season, type MatchResult, type PremierWeek } from '../data/season';
import { downloadText } from '../lib/browser-transfer';
import { buildPremierCalendar } from '../lib/premier-calendar';
import { VerifiedMatches } from '../components/matches/VerifiedMatches';
import { formatDate, formatResultLine } from '../lib/premier';

const trackerTeamUrl = 'https://tracker.gg/valorant/premier/teams/a5552155-90d0-4559-b879-f08e5f9f05b8/matches';
const filters = [{ id: 'all', label: 'Todas' }, { id: 'results', label: 'Com resultado' }, { id: 'windows', label: 'Janelas publicadas' }] as const;
type Filter = typeof filters[number]['id'];

function weekResults(week: PremierWeek) {
  return season.results.filter((result) => week.selectedDays.some((day) => day.date === result.date) && (!week.map || result.map === week.map));
}

function ResultRow({ result }: { result: MatchResult }) {
  return <article className={`match-result is-${result.outcome}`}>
    <div className="result-meta"><span className="result-mark">{result.outcome === 'win' ? 'Vitória' : result.outcome === 'loss' ? 'Derrota' : 'Publicado'}</span><time dateTime={result.date}>{formatDate(result.date)}</time></div>
    <div className="result-teams"><strong>SHUSH</strong><span>{result.opponent ?? 'Adversário não publicado'}</span></div>
    <div className="result-score">{result.shushScore !== undefined && result.opponentScore !== undefined ? <strong aria-label={formatResultLine(result)}>{result.shushScore}<span>:</span>{result.opponentScore}</strong> : <span>{formatResultLine(result)}</span>}<small>{result.map ?? 'Mapa por definir'}</small></div>
  </article>;
}

export function PremierPage() {
  const [filter, setFilter] = useState<Filter>('all');
  const [feedback, setFeedback] = useState('');
  const visibleWeeks = season.weeks.filter((week) => filter === 'all' || (filter === 'results' ? weekResults(week).length > 0 : week.selectedDays.length > 0));
  const exportCalendar = (weekId?: string) => {
    try {
      downloadText(buildPremierCalendar(season, new Date(), weekId), weekId ? `shush-premier-${weekId}.ics` : 'shush-premier-2026.ics', 'text/calendar;charset=utf-8');
      setFeedback('Calendário preparado. As datas são janelas publicadas, não confirmações de jogo.');
    } catch { setFeedback('Não foi possível preparar o calendário. Consulta as datas publicadas abaixo.'); }
  };
  return (
    <div className="match-page">
      <section className="shell match-opening" aria-labelledby="premier-title">
        <div className="match-heading"><div><span className="section-kicker">SHUSH / VALORANT PREMIER</span><h1 id="premier-title">O jogo acaba.<br /><span>O registo fica.</span></h1><p className="body-copy">Adversários, mapas e rounds. As últimas partidas da SHUSH disponíveis no Tracker.gg.</p><div className="action-row"><a href="#verified-results" className="editorial-link">Ver partidas ↓</a><Button href={trackerTeamUrl} target="_blank" rel="noopener noreferrer" variant="secondary">Tracker da equipa</Button></div></div><div className="match-editor-note"><span className="section-kicker">MATCH CENTER</span><p>Vitórias para guardar.<br />Derrotas para aprender.<br /><strong>Sempre, o próximo round.</strong></p></div></div>
        <section id="verified-results" aria-labelledby="verified-title"><div className="section-index"><h2 id="verified-title">Últimas partidas</h2><span className="mono">Verificação manual · 10 out. 2026</span></div><VerifiedMatches /><p className="match-provenance">Registo manual das partidas disponíveis na fonte na data indicada. Não é uma transmissão de dados em tempo real.</p></section>
      </section>
      <details className="shell legacy-archive"><summary>Arquivo interno <span>Jun — Jul 2026</span><span aria-hidden="true">+</span></summary><p className="body-copy">Calendário e registos anteriores da equipa. Não foi confirmada a correspondência com as partidas do Tracker.gg apresentadas acima.</p><AppLink className="editorial-link" href="/?matchday=week-2-day-1#top">Rever Matchday do arquivo · Lotus ↗</AppLink>
      <div className="match-body">
        <section id="calendar" className="match-calendar" aria-labelledby="calendar-title">
          <div className="section-index"><span className="section-kicker">01 / Jornadas</span><span className="mono">Horários em Lisboa · Europe/Lisbon</span></div>
          <div className="calendar-heading"><h2 id="calendar-title">Fase publicada.</h2><button type="button" className="utility-button" onClick={() => exportCalendar()}>Descarregar calendário (.ics) <span aria-hidden="true">↓</span></button></div>
          <div className="calendar-filters" role="group" aria-label="Filtrar jornadas">{filters.map((item) => <button key={item.id} type="button" aria-pressed={filter === item.id} onClick={() => setFilter(item.id)}>{item.label}</button>)}</div>
          <p className="sr-only" role="status">{visibleWeeks.length} jornadas apresentadas.</p><p className="action-feedback" role="status">{feedback}</p>
          <div className="match-week-list">
            {visibleWeeks.map((week) => {
              const results = weekResults(week);
              return <details key={week.id} className="match-week"><summary><span className="week-index">{String(week.weekNumber).padStart(2, '0')}</span><span className="week-map">{week.map ?? 'Mapa por definir'}</span><span className="week-state">{results.length ? `${results.length} resultado publicado` : week.selectedDays.length ? 'Janela sem resultado' : 'Sem dia publicado'}</span><span className="week-expand" aria-hidden="true">+</span></summary>
                <div className="week-detail">
                  <div className="week-windows"><span className="mono">Janelas publicadas</span>{week.selectedDays.length ? week.selectedDays.map((day) => <p key={day.id}><time dateTime={day.date}>{formatDate(day.date)}</time><strong>{day.windowStart}–{day.windowEnd}</strong></p>) : <p>Não existe uma data publicada para esta jornada.</p>}{week.selectedDays.length ? <button className="utility-button" type="button" onClick={() => exportCalendar(week.id)}>Exportar esta jornada <span aria-hidden="true">↓</span></button> : null}</div>
                  <div className="week-callups"><span className="mono">Convocados</span>{week.convocados.length ? <div className="callup-list">{week.convocados.map((id) => { const player = players.find((item) => item.id === id)!; return <AppLink key={id} href={`/esports/valorant/roster?player=${id}`}>{player.avatar ? <img src={player.avatar} alt="" width="768" height="768" loading="lazy" decoding="async" /> : <span className="callup-initials" aria-hidden="true">{player.initials}</span>}<span>{player.displayName}</span><span aria-hidden="true">↗</span></AppLink>; })}</div> : <p>Convocatória não publicada.</p>}</div>
                  {week.streams.some((stream) => stream.enabled) ? <div className="week-streams"><span className="mono">Canais associados</span>{week.streams.filter((stream) => stream.enabled).map((stream) => <a key={stream.playerId} className="editorial-link" href={stream.url} target="_blank" rel="noopener noreferrer">{players.find((player) => player.id === stream.playerId)!.displayName} / {stream.platform === 'twitch' ? 'Twitch' : stream.platform === 'youtube' ? 'YouTube' : 'Canal'} <span aria-hidden="true">↗</span></a>)}<small>As ligações abrem os canais; não indicam uma transmissão em direto.</small></div> : null}
                  {results.length ? <div className="week-results">{results.map((result) => <ResultRow key={result.id} result={result} />)}</div> : <p className="week-result-note">Sem resultado publicado. A ausência de um score não determina o desfecho.</p>}
                </div>
              </details>;
            })}
          </div>
        </section>
        <section id="results" className="match-results" aria-labelledby="results-title"><div className="section-index"><span className="section-kicker">02 / Resultados</span><span className="mono">Dados publicados</span></div><h2 id="results-title">Rounds registados.</h2><div className="result-list">{season.results.length ? season.results.map((result) => <ResultRow key={result.id} result={result} />) : <p className="body-copy">Ainda não existem resultados publicados.</p>}</div><div className="playoff-record"><span className="mono">Play-offs / <time dateTime={season.playoffsDate}>{formatDate(season.playoffsDate)}</time></span><h3>Desfecho por confirmar.</h3>{season.playoffResults.length ? season.playoffResults.map((result) => <ResultRow key={result.id} result={result} />) : <p>Não existe um resultado de play-offs publicado. O calendário encerrado não confirma qualificação, eliminação ou classificação final.</p>}</div></section>
      </div>
      </details>
    </div>
  );
}
