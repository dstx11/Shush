import type { VerifiedMatch } from '../data/verified-matches';
export type Outcome = 'all' | 'win' | 'loss';
export const matchWon = (match: VerifiedMatch) => match.shushScore > match.opponentScore;
export function filterMatches(matches: VerifiedMatch[], outcome: Outcome, map: string) {
  return matches.filter(match => (outcome === 'all' || matchWon(match) === (outcome === 'win')) && (map === 'all' || match.map === map));
}
export function mapPerformance(matches: VerifiedMatch[]) {
  return [...new Set(matches.map(match => match.map))].map(map => {
    const played = matches.filter(match => match.map === map);
    const wins = played.filter(matchWon).length;
    return { map, played: played.length, wins, losses: played.length - wins, rate: Math.round(wins / played.length * 100) };
  });
}
