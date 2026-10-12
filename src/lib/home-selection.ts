import { players } from '../data/players';

export const homeRotationKey = 'shush:home:rotation:v1';
/** Three successive positions on a seven-member ring. Every seven visits give
 * each member three appearances and exactly one central position. */
export function selectHomePlayers(cursor: number) {
  const start = ((Math.trunc(cursor) % players.length) + players.length) % players.length;
  return { ids: [0, 1, 2].map(offset => players[(start + offset) % players.length].id), next: (start + 3) % players.length };
}
let visit: ReturnType<typeof selectHomePlayers> | undefined;
export function getHomePlayers() {
  if (!visit) {
    let cursor = Math.floor(Math.random() * players.length);
    try {
      const stored = localStorage.getItem(homeRotationKey);
      if (stored !== null && /^[0-6]$/.test(stored)) cursor = Number(stored);
    } catch { /* No storage: keep this visit stable in module memory. */ }
    visit = selectHomePlayers(cursor);
    try { localStorage.setItem(homeRotationKey, String(visit.next)); } catch { /* Optional persistence. */ }
  }
  return visit.ids.map(id => players.find(player => player.id === id)!);
}
