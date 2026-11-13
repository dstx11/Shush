// Manual transcription of the public Tracker team Matches table, reviewed against the public Tracker team page 2026-11-13; ten most recent visible results.
// This snapshot is deliberately independent of the older internal Premier calendar.
export const matchSource = 'https://tracker.gg/valorant/premier/teams/a5552155-90d0-4559-b879-f08e5f9f05b8/matches';
export type VerifiedMatch = {
  id: string; date: string; map: string; opponent: string;
  shushScore: number; opponentScore: number; source: string; verifiedAt: string;
};
export const verifiedMatches: VerifiedMatch[] = [
  { id: '2026-06-06-enlitro', date: '2026-06-06', map: 'Haven', opponent: 'EnLitro', shushScore: 9, opponentScore: 13 },
  { id: '2026-05-16-vallhalla', date: '2026-05-16', map: 'Lotus', opponent: 'VallhallaWolves', shushScore: 10, opponentScore: 13 },
  { id: '2026-05-10-prime', date: '2026-05-10', map: 'Ascent', opponent: 'Prime Esports', shushScore: 13, opponentScore: 10 },
  { id: '2026-05-10-rabooz', date: '2026-05-10', map: 'Ascent', opponent: 'RABOOZ', shushScore: 13, opponentScore: 4 },
  { id: '2026-04-26-nox', date: '2026-04-26', map: 'Breeze', opponent: 'Nox Lykos', shushScore: 6, opponentScore: 13 },
  { id: '2026-04-26-storm', date: '2026-04-26', map: 'Haven', opponent: 'Storm breakers', shushScore: 13, opponentScore: 4 },
  { id: '2026-04-25-los-nenes', date: '2026-04-25', map: 'Breeze', opponent: 'LOS NENES', shushScore: 13, opponentScore: 5 },
  { id: '2026-04-25-nomori', date: '2026-04-25', map: 'Breeze', opponent: 'NoMoriNoParty', shushScore: 13, opponentScore: 6 },
  { id: '2026-04-19-demons', date: '2026-04-19', map: 'Bind', opponent: 'Demons 2', shushScore: 5, opponentScore: 13 },
  { id: '2026-04-11-ilpsni', date: '2026-04-11', map: 'Split', opponent: 'ILPSNI', shushScore: 5, opponentScore: 13 },
].map(match => ({ ...match, source: matchSource, verifiedAt: '2026-11-13' }));
