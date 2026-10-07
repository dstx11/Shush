import type { MatchResult, PlayoffResult, PremierPlayDay, PremierSeason, PremierWeek } from '../data/season';

export type SeasonStatus = 'Regular Season' | 'Qualified' | 'Play-offs' | 'Champions' | 'Closed' | 'Finished';

export type PlayoffPlacement =
  | { status: 'eliminated'; placement: '5th-8th' | '3rd-4th' | '2nd' }
  | { status: 'playoffs_active'; placement: null }
  | { status: 'champions'; placement: 'Premier Champions' }
  | null;

export type PublicMatchDayState =
  | { kind: 'champions'; title: 'CAMPEÕES PREMIER'; detail: string; result?: MatchResult }
  | { kind: 'playoffs_live'; title: 'PLAY-OFFS EM DIRETO'; detail: string }
  | { kind: 'match_day_live'; title: 'MATCH DAY EM DIRETO'; week: PremierWeek; day: PremierPlayDay; detail: string; showStreams: boolean }
  | { kind: 'upcoming'; title: 'PRÓXIMA JANELA PREMIER'; week: PremierWeek; day: PremierPlayDay; detail: string }
  | { kind: 'result_pending'; title: 'RESULTADO POR CONFIRMAR'; week: PremierWeek; day: PremierPlayDay; detail: string }
  | { kind: 'last_result'; title: 'ÚLTIMO RESULTADO'; detail: string; result: MatchResult }
  | { kind: 'qualified'; title: 'QUALIFICADOS PARA OS PLAY-OFFS'; detail: string }
  | { kind: 'eliminated'; title: 'PERCURSO PREMIER TERMINADO'; detail: string }
  | { kind: 'season_closed'; title: 'FASE PUBLICADA ENCERRADA'; detail: string }
  | { kind: 'season_active'; title: 'PREMIER ATIVO'; detail: 'Próxima janela por definir' };

export function pointsForResult(result: MatchResult, season: Pick<PremierSeason, 'winPoints' | 'lossPoints'>) {
  if (result.outcome === 'win') return season.winPoints;
  if (result.outcome === 'loss') return season.lossPoints;
  return 0;
}

export function calculatePremierScore(season: PremierSeason) {
  return season.results
    .filter((result) => result.phase === 'regular')
    .reduce((total, result) => total + pointsForResult(result, season), 0);
}

export function calculatePlayoffPlacement(playoffResults: PlayoffResult[]): PlayoffPlacement {
  const game1 = playoffResults.find((game) => game.playoffRound === 1);
  const game2 = playoffResults.find((game) => game.playoffRound === 2);
  const final = playoffResults.find((game) => game.playoffRound === 3);

  if (!game1 || game1.outcome === 'cancelled') return null;

  if (game1.outcome === 'loss') {
    return { status: 'eliminated', placement: '5th-8th' };
  }

  if (!game2 || game2.outcome === 'cancelled') return { status: 'playoffs_active', placement: null };

  if (game2.outcome === 'loss') {
    return { status: 'eliminated', placement: '3rd-4th' };
  }

  if (!final || final.outcome === 'cancelled') return { status: 'playoffs_active', placement: null };

  if (final.outcome === 'loss') {
    return { status: 'eliminated', placement: '2nd' };
  }

  if (final.outcome === 'win' || final.outcome === 'bye') {
    return { status: 'champions', placement: 'Premier Champions' };
  }

  return null;
}

export function calculateSeasonStatus(season: PremierSeason, now = new Date()): SeasonStatus {
  const placement = calculatePlayoffPlacement(season.playoffResults);

  if (placement?.status === 'champions') return 'Champions';
  if (placement?.status === 'eliminated') return 'Finished';

  const score = calculatePremierScore(season);
  const playoffsStart = makeDateTime(season.playoffsDate, season.playoffsWindowStart, season.timezone);
  const playoffsEnd = addMinutes(makeDateTime(season.playoffsDate, season.playoffsWindowEnd, season.timezone), 40);
  const playDays = getAllPlayDays(season);
  const regularWindowEnded = playDays.length > 0 && playDays.every(({ day }) => addMinutes(makeDateTime(day.date, day.windowEnd, season.timezone), 40) < now);

  if (now > playoffsEnd) return 'Closed';
  if (placement?.status === 'playoffs_active') return 'Play-offs';
  if (now >= playoffsStart && score >= season.qualificationPoints) return 'Play-offs';
  if (regularWindowEnded && score >= season.qualificationPoints) return 'Qualified';
  // Missing results do not prove elimination or a final score.
  if (regularWindowEnded) return 'Closed';
  return 'Regular Season';
}

export function formatSeasonStatus(status: SeasonStatus) {
  switch (status) {
    case 'Regular Season':
      return 'Fase regular';
    case 'Qualified':
      return 'Qualificados';
    case 'Play-offs':
      return 'Play-offs';
    case 'Champions':
      return 'Campeões';
    case 'Closed':
      return 'Fase publicada encerrada';
    case 'Finished':
      return 'Terminado';
  }
}

export function calculatePublicMatchDayState(season: PremierSeason, now = new Date()): PublicMatchDayState {
  const score = calculatePremierScore(season);
  const placement = calculatePlayoffPlacement(season.playoffResults);
  const latestPlayoffResult = getLatestResult(season.playoffResults, now, season.timezone);

  if (placement?.status === 'champions' && latestPlayoffResult) {
    return { kind: 'champions', title: 'CAMPEÕES PREMIER', detail: 'Resultado final publicado pela equipa.', result: latestPlayoffResult };
  }

  if (placement?.status === 'eliminated') {
    return {
      kind: 'eliminated',
      title: 'PERCURSO PREMIER TERMINADO',
      detail: `Classificação publicada: ${placement.placement} · Pontuação publicada: ${score}`,
    };
  }

  const playoffsStart = makeDateTime(season.playoffsDate, season.playoffsWindowStart, season.timezone);
  const playoffsEnd = addMinutes(makeDateTime(season.playoffsDate, season.playoffsWindowEnd, season.timezone), 40);
  if (score >= season.qualificationPoints && now >= playoffsStart && now <= playoffsEnd && placement?.status !== 'champions') {
    return { kind: 'playoffs_live', title: 'PLAY-OFFS EM DIRETO', detail: `${formatDate(season.playoffsDate)} · ${season.playoffsWindowStart}-${season.playoffsWindowEnd}` };
  }

  const liveRegular = getAllPlayDays(season).find(({ day }) => {
    const start = makeDateTime(day.date, day.windowStart, season.timezone);
    const embedEnd = addMinutes(makeDateTime(day.date, day.windowEnd, season.timezone), 40);
    return now >= start && now <= embedEnd;
  });

  if (liveRegular) {
    return {
      kind: 'match_day_live',
      title: 'MATCH DAY EM DIRETO',
      week: liveRegular.week,
      day: liveRegular.day,
      detail: `Premier · ${liveRegular.week.map ?? 'Mapa por definir'}`,
      showStreams: liveRegular.week.streams.some((stream) => stream.enabled),
    };
  }

  const upcoming = getAllPlayDays(season)
    .filter(({ day }) => makeDateTime(day.date, day.windowStart, season.timezone) > now)
    .sort((a, b) => makeDateTime(a.day.date, a.day.windowStart, season.timezone).getTime() - makeDateTime(b.day.date, b.day.windowStart, season.timezone).getTime())[0];

  if (upcoming) {
    return {
      kind: 'upcoming',
      title: 'PRÓXIMA JANELA PREMIER',
      week: upcoming.week,
      day: upcoming.day,
      detail: `${upcoming.week.map ?? 'Mapa por definir'} · ${formatDate(upcoming.day.date)} · ${upcoming.day.windowStart}-${upcoming.day.windowEnd}`,
    };
  }

  const seasonStatus = calculateSeasonStatus(season, now);
  if (seasonStatus === 'Qualified') {
    return {
      kind: 'qualified',
      title: 'QUALIFICADOS PARA OS PLAY-OFFS',
      detail: `${formatDate(season.playoffsDate)} · ${season.playoffsWindowStart}-${season.playoffsWindowEnd}`,
    };
  }

  if (seasonStatus === 'Closed') {
    return {
      kind: 'season_closed',
      title: 'FASE PUBLICADA ENCERRADA',
      detail: `Pontuação publicada: ${score} / ${season.qualificationPoints} · Desfecho por confirmar`,
    };
  }

  const pending = getAllPlayDays(season)
    .filter(({ week, day }) => addMinutes(makeDateTime(day.date, day.windowEnd, season.timezone), 40) < now && !hasResultForPlayDay(season, week, day))
    .sort((a, b) => makeDateTime(b.day.date, b.day.windowEnd, season.timezone).getTime() - makeDateTime(a.day.date, a.day.windowEnd, season.timezone).getTime())[0];

  if (pending) {
    return {
      kind: 'result_pending',
      title: 'RESULTADO POR CONFIRMAR',
      week: pending.week,
      day: pending.day,
      detail: `Premier · ${pending.week.map ?? 'Mapa por definir'}`,
    };
  }

  const latestResult = getLatestResult(season.results, now, season.timezone);
  if (latestResult) {
    return {
      kind: 'last_result',
      title: 'ÚLTIMO RESULTADO',
      detail: `${formatDate(latestResult.date)} · ${latestResult.tournamentName} · ${latestResult.map ?? 'Mapa por definir'}`,
      result: latestResult,
    };
  }

  return { kind: 'season_active', title: 'PREMIER ATIVO', detail: 'Próxima janela por definir' };
}

export function formatResultLine(result: MatchResult) {
  const confirmedRival = result.opponent || null;

  if (result.shushScore !== undefined && result.opponentScore !== undefined) {
    return confirmedRival
      ? `SHUSH ${result.shushScore}-${result.opponentScore} ${confirmedRival}`
      : `SHUSH ${result.shushScore}-${result.opponentScore} · adversário não publicado`;
  }

  if (result.outcome === 'win') return 'Vitória publicada';
  if (result.outcome === 'loss') return 'Derrota publicada';
  return 'Resultado sem score publicado';
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(`${date}T12:00:00`));
}

function getAllPlayDays(season: PremierSeason) {
  return season.weeks.flatMap((week) => week.selectedDays.map((day) => ({ week, day })));
}

function hasResultForPlayDay(season: PremierSeason, week: PremierWeek, day: PremierPlayDay) {
  return season.results.some((result) => result.phase === 'regular' && result.date === day.date && (!week.map || result.map === week.map));
}

function getLatestResult<T extends MatchResult>(results: T[], now: Date, timezone = 'Europe/Lisbon') {
  return [...results]
    .filter((result) => makeDateTime(result.date, '12:00', timezone) <= now)
    .sort(
      (a, b) =>
        makeDateTime(b.date, '12:00', timezone).getTime() -
        makeDateTime(a.date, '12:00', timezone).getTime(),
    )[0];
}

function makeDateTime(date: string, time: string, timezone = 'Europe/Lisbon') {
  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute] = time.split(':').map(Number);
  const utcGuess = Date.UTC(year, month - 1, day, hour, minute, 0);

  // Convert a wall-clock time in the season timezone into an absolute instant.
  // Recalculate once so DST boundaries resolve correctly without depending on
  // the visitor's local browser timezone.
  let instant = utcGuess - timezoneOffsetMs(utcGuess, timezone);
  instant = utcGuess - timezoneOffsetMs(instant, timezone);

  return new Date(instant);
}

const timezoneFormatters = new Map<string, Intl.DateTimeFormat>();

function timezoneOffsetMs(timestamp: number, timezone: string) {
  let formatter = timezoneFormatters.get(timezone);

  if (!formatter) {
    formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: timezone,
      hourCycle: 'h23',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    timezoneFormatters.set(timezone, formatter);
  }

  const parts = Object.fromEntries(
    formatter
      .formatToParts(new Date(timestamp))
      .filter((part) => part.type !== 'literal')
      .map((part) => [part.type, part.value]),
  );

  const representedAsUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second),
  );

  return representedAsUtc - Math.floor(timestamp / 1000) * 1000;
}

function addMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60_000);
}
