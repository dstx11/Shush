/** Manually verified public Tracker.gg team match snapshot (10 October 2026).
 * NOT a live feed or API. Keep source and as-of label visible with these records.
 * Never silently mix these matches with the local Premier 2026 manual schedule.
 */
export type VerifiedTeamMatch = {
  id: string;
  date: string;
  map: string;
  opponent: string;
  shushScore: number;
  opponentScore: number;
};
export const trackerTeamUrl = 'https://tracker.gg/valorant/premier/teams/a5552155-90d0-4559-b879-f08e5f9f05b8/matches';
export const trackerVerifiedAt = '2026-10-10';
export const recentTrackerMatches: readonly VerifiedTeamMatch[] = [
  { id: 'tracker-20260606-enlitro', date: '2026-06-06', map: 'Haven', opponent: 'EnLitro', shushScore: 9, opponentScore: 13 },
  { id: 'tracker-20260516-vallhalla', date: '2026-05-16', map: 'Lotus', opponent: 'VallhallaWolves', shushScore: 10, opponentScore: 13 },
  { id: 'tracker-20260510-prime', date: '2026-05-10', map: 'Ascent', opponent: 'Prime Esports', shushScore: 13, opponentScore: 10 },
  { id: 'tracker-20260510-rabooz', date: '2026-05-10', map: 'Ascent', opponent: 'RABOOZ', shushScore: 13, opponentScore: 4 },
  { id: 'tracker-20260426-nox', date: '2026-04-26', map: 'Breeze', opponent: 'Nox Lykos', shushScore: 6, opponentScore: 13 },
];
