// Riot IDs confirmed by the owner. One destination policy for every surface.
export type CompetitiveProfile = {
  playerId: string;
  riotId: string;
  trackerUrl: string;
  playlist: 'competitive';
};

const accounts = [['dstx', 'Nivox#zero'], ['more', 'moreNO#less'], ['th0maz7', 'Th0maz7#愛してる彼'], ['lyel', 'xyz#off'], ['tz', 'tz one more time#1757'], ['catty', 'catty#111'], ['levi', 'the creator#weed']];
export const competitiveProfiles: CompetitiveProfile[] = accounts.map(([playerId, riotId]) => ({
  playerId, riotId, playlist: 'competitive',
  trackerUrl: `https://tracker.gg/valorant/profile/riot/${encodeURIComponent(riotId)}/matches?platform=pc&playlist=competitive`,
}));

export function getCompetitiveProfile(playerId: string) {
  return competitiveProfiles.find((profile) => profile.playerId === playerId);
}
