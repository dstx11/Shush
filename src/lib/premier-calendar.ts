import type { PremierSeason } from '../data/season';
import { makeDateTime } from './premier';

const escapeText = (text: string) => text.replace(/\\/g, '\\\\').replace(/\r\n|\r|\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
const utc = (date: Date) => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

/** RFC 5545 folding counts UTF-8 octets without splitting Unicode code points. */
function foldLine(line: string) {
  const encoder = new TextEncoder();
  let result = '';
  let width = 0;
  for (const character of line) {
    const size = encoder.encode(character).length;
    if (width + size > 75) { result += '\r\n '; width = 1; }
    result += character;
    width += size;
  }
  return result;
}

/** Published windows only, never invented fixtures or confirmed participation. */
export function buildPremierCalendar(season: PremierSeason, stamp = new Date(), weekId?: string) {
  const windows = season.weeks.filter((week) => !weekId || week.id === weekId).flatMap((week) => week.selectedDays.map((day) => ({
    id: day.id, date: day.date, start: day.windowStart, end: day.windowEnd,
    label: 'Jornada ' + week.weekNumber + ' / ' + (week.map ?? 'Mapa por definir'),
  })));
  if (!weekId) windows.push({
    id: 'playoffs', date: season.playoffsDate, start: season.playoffsWindowStart, end: season.playoffsWindowEnd,
    label: 'Play-offs / participação por confirmar',
  });
  if (!windows.length) throw new Error('No published windows');
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//SHUSH//Premier windows//PT', 'CALSCALE:GREGORIAN'];
  for (const window of windows) {
    lines.push('BEGIN:VEVENT',
      'UID:' + escapeText(season.id + '-' + window.id + '@shush.pt'),
      'DTSTAMP:' + utc(stamp),
      'DTSTART:' + utc(makeDateTime(window.date, window.start, season.timezone)),
      'DTEND:' + utc(makeDateTime(window.date, window.end, season.timezone)),
      'SUMMARY:' + escapeText('SHUSH / Janela publicada / ' + window.label),
      'DESCRIPTION:' + escapeText(season.name + '. Horários em Lisboa (' + season.timezone + '). Janela publicada pela equipa; não confirma jogo nem participação. Consulta o Match Center para resultados e alterações.'),
      'URL:https://shush.pt/esports/valorant/premier',
      'STATUS:TENTATIVE', 'TRANSP:TRANSPARENT', 'END:VEVENT');
  }
  lines.push('END:VCALENDAR');
  return lines.map(foldLine).join('\r\n') + '\r\n';
}
