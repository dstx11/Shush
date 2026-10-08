import type { CompetitiveProfile } from '../data/competitive-profiles';
import type { Player } from '../data/players';

export function validateCompetitiveProfiles(profiles: CompetitiveProfile[], players: Player[]) {
  const errors: string[] = [];
  const playerIds = new Set(players.map((player) => player.id));
  const seenPlayers = new Set<string>();
  const seenAccounts = new Set<string>();

  for (const profile of profiles) {
    const label = `competitive profile ${profile.playerId}`;
    if (!playerIds.has(profile.playerId)) errors.push(`${label}: unknown player`);
    if (seenPlayers.has(profile.playerId)) errors.push(`${label}: duplicate player`);
    seenPlayers.add(profile.playerId);
    if (!/^[^#\s][^#]*#[^#\s]+$/u.test(profile.riotId) || profile.riotId !== profile.riotId.trim()) {
      errors.push(`${label}: invalid Riot ID`);
    }
    const account = profile.riotId.toLocaleLowerCase('en');
    if (seenAccounts.has(account)) errors.push(`${label}: duplicate Riot account`);
    seenAccounts.add(account);

    try {
      const url = new URL(profile.trackerUrl);
      if (url.protocol !== 'https:' || url.hostname !== 'tracker.gg' || url.port || url.username || url.password || url.hash) {
        errors.push(`${label}: URL must be an HTTPS Tracker.gg profile without credentials or fragment`);
      }
      const match = url.pathname.match(/^\/valorant\/profile\/riot\/([^/]+)(?:\/(?:overview|matches))?$/);
      if (!match || decodeURIComponent(match[1]) !== profile.riotId) {
        errors.push(`${label}: URL account does not match Riot ID`);
      }
      if (!['premier', 'competitive'].includes(profile.playlist) ||
          url.searchParams.getAll('playlist').length !== 1 || url.searchParams.get('playlist') !== profile.playlist) {
        errors.push(`${label}: playlist mismatch`);
      }
      if (url.searchParams.getAll('season').length > 1 ||
          (url.searchParams.get('season') ?? undefined) !== profile.seasonId ||
          (profile.seasonId !== undefined && !/^[\da-f]{8}(?:-[\da-f]{4}){3}-[\da-f]{12}$/i.test(profile.seasonId))) {
        errors.push(`${label}: season mismatch`);
      }
    } catch {
      errors.push(`${label}: malformed profile URL or encoding`);
    }
  }

  if (errors.length) throw new Error(`SHUSH competitive profile validation failed:\n- ${errors.join('\n- ')}`);
}
