import type { Player } from '../data/players';
import type { PremierSeason } from '../data/season';

export function validateStaticData(players: Player[], season: PremierSeason) {
  const errors: string[] = [];
  const playerIds = new Set<string>();
  const playerNumbers = new Set<string>();

  if (!players.length) errors.push('roster cannot be empty');

  for (const player of players) {
    if (playerIds.has(player.id)) errors.push(`duplicate player id: ${player.id}`);
    playerIds.add(player.id);

    if (playerNumbers.has(player.number)) errors.push(`duplicate player number: ${player.number}`);
    playerNumbers.add(player.number);
    if (!/^\d{2}$/.test(player.number)) errors.push(`invalid player number: ${player.number}`);
    if (!player.displayName.trim() || !player.initials.trim() || !player.roles.length) {
      errors.push(`player ${player.id} is missing public identity or roles`);
    }

    if (player.isCreator && (!player.creatorType || !player.creatorUrl)) {
      errors.push(`creator ${player.id} is missing creatorType or creatorUrl`);
    }

    if (player.creatorUrl && !isHttpsUrl(player.creatorUrl)) {
      errors.push(`creator ${player.id} has a non-HTTPS URL`);
    }
    if (player.trackerUrl && !isHttpsUrl(player.trackerUrl)) errors.push(`player ${player.id} has a non-HTTPS tracker URL`);
  }

  const weekIds = new Set<string>();
  const weekNumbers = new Set<number>();
  const dayIds = new Set<string>();
  const resultIds = new Set<string>();

  for (const week of season.weeks) {
    if (weekIds.has(week.id)) errors.push(`duplicate Premier week id: ${week.id}`);
    weekIds.add(week.id);
    if (!Number.isInteger(week.weekNumber) || week.weekNumber < 1 || weekNumbers.has(week.weekNumber)) {
      errors.push(`invalid or duplicate week number: ${week.weekNumber}`);
    }
    weekNumbers.add(week.weekNumber);

    for (const playerId of week.convocados) {
      if (!playerIds.has(playerId)) errors.push(`week ${week.id} references unknown player: ${playerId}`);
    }

    for (const stream of week.streams) {
      if (!playerIds.has(stream.playerId)) errors.push(`week ${week.id} stream references unknown player: ${stream.playerId}`);
      if (!isHttpsUrl(stream.url)) errors.push(`week ${week.id} has a non-HTTPS stream URL`);
    }

    for (const day of week.selectedDays) {
      if (dayIds.has(day.id)) errors.push(`duplicate Premier day id: ${day.id}`);
      dayIds.add(day.id);

      if (!isDate(day.date)) errors.push(`invalid Premier date: ${day.date}`);
      if (!isTime(day.windowStart) || !isTime(day.windowEnd) || day.windowStart >= day.windowEnd) {
        errors.push(`invalid Premier time window in ${day.id}`);
      }
    }
  }

  for (const result of [...season.results, ...season.playoffResults]) {
    if (resultIds.has(result.id)) errors.push(`duplicate result id: ${result.id}`);
    resultIds.add(result.id);
    if (!isDate(result.date)) errors.push(`invalid result date: ${result.date}`);
    if (!['win', 'loss', 'bye', 'cancelled'].includes(result.outcome)) errors.push(`invalid outcome in ${result.id}`);
    if (!['regular', 'playoffs'].includes(result.phase)) errors.push(`invalid phase in ${result.id}`);
    const hasScore = result.shushScore !== undefined || result.opponentScore !== undefined;
    if (hasScore) {
      if (![result.shushScore, result.opponentScore].every((score) => Number.isInteger(score) && Number(score) >= 0)) {
        errors.push(`invalid or incomplete score in ${result.id}`);
      } else if (
        (result.outcome === 'win' && result.shushScore! <= result.opponentScore!) ||
        (result.outcome === 'loss' && result.shushScore! >= result.opponentScore!) ||
        result.outcome === 'bye' || result.outcome === 'cancelled'
      ) {
        errors.push(`score contradicts outcome in ${result.id}`);
      }
    }
    if (result.highlightUrl && !isHttpsUrl(result.highlightUrl)) errors.push(`non-HTTPS highlight URL in ${result.id}`);
  }

  const playoffRounds = new Set<number>();
  for (const result of season.playoffResults) {
    if (result.phase !== 'playoffs' || ![1, 2, 3].includes(result.playoffRound) || playoffRounds.has(result.playoffRound)) {
      errors.push(`invalid or duplicate playoff round in ${result.id}`);
    }
    playoffRounds.add(result.playoffRound);
  }
  if (season.results.some((result) => result.phase !== 'regular')) errors.push('regular results must have regular phase');

  if (!Number.isInteger(season.qualificationPoints) || season.qualificationPoints <= 0) errors.push('qualificationPoints must be a positive integer');
  if (![season.winPoints, season.lossPoints].every((points) => Number.isInteger(points) && points >= 0)) {
    errors.push('Premier result points cannot be negative');
  }

  if (!isDate(season.playoffsDate)) errors.push('invalid playoffsDate');
  if (!isTime(season.playoffsWindowStart) || !isTime(season.playoffsWindowEnd) || season.playoffsWindowStart >= season.playoffsWindowEnd) {
    errors.push('invalid playoffs time window');
  }

  try {
    new Intl.DateTimeFormat('en', { timeZone: season.timezone }).format();
  } catch {
    errors.push(`invalid Premier timezone: ${season.timezone}`);
  }

  if (errors.length) {
    throw new Error(`SHUSH static data validation failed:\n- ${errors.join('\n- ')}`);
  }
}

function isHttpsUrl(value: string) {
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
}

function isDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function isTime(value: string) {
  if (!/^\d{2}:\d{2}$/.test(value)) return false;
  const [hours, minutes] = value.split(':').map(Number);
  return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
}

