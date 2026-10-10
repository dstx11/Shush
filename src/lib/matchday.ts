import type { PremierSeason } from '../data/season';
import { makeDateTime } from './premier';

/** Automatic matchday uses the published Lisbon calendar; an explicit ID opens an archive. */
export function resolveMatchday(season: PremierSeason, now: Date, requested?: string | null) {
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: season.timezone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
  const days = season.weeks.flatMap(week => week.selectedDays.map(day => ({ week, day })));
  const selected = requested ? days.find(item => item.day.id === requested) : days.find(item => item.day.date === today);
  if (!selected) return null;
  const { week, day } = selected;
  const start = makeDateTime(day.date, day.windowStart, season.timezone).getTime();
  const end = makeDateTime(day.date, day.windowEnd, season.timezone).getTime();
  const result = season.results.find(item => item.date === day.date && (!week.map || item.map === week.map) && (item.outcome === 'cancelled' || day.date < today || now.getTime() >= end));
  const phase = result?.outcome === 'cancelled' ? 'cancelled' : result ? 'result' : now.getTime() < start ? 'upcoming' : now.getTime() <= end ? 'window' : 'pending';
  const minutes = Math.max(0, Math.ceil((start - now.getTime()) / 60000));
  return { week, day, result, phase, archive: day.date < today, countdown: `${Math.floor(minutes / 60)}h ${String(minutes % 60).padStart(2, '0')}m` };
}
