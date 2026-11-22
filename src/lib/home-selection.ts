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
  if (typeof window === 'undefined') return players.slice(0, 3);
  if (!visit) {
    // A fresh device shows the same trio as the static HTML; subsequent visits rotate.
    let cursor = 0;
    try {
      const stored = localStorage.getItem(homeRotationKey);
      if (stored !== null && /^[0-6]$/.test(stored)) cursor = Number(stored);
    } catch { /* The static selection also works without storage. */ }
    visit = selectHomePlayers(cursor);
    try { localStorage.setItem(homeRotationKey, String(visit.next)); } catch { /* Optional persistence. */ }
  }
  return visit.ids.map(id => players.find(player => player.id === id)!);
}
