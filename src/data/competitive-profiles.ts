// Confirmed by the project owner. Public names remain in players.ts;
// Riot IDs identify accounts, not a player's public nickname.
export type CompetitiveProfile = {
  playerId: string;
  riotId: string;
  trackerUrl: string;
  playlist: 'competitive' | 'competitive';
  seasonId?: string;
};

export const competitiveProfiles: CompetitiveProfile[] = [
  {
    playerId: 'dstx',
    riotId: 'Nivox#zero',
    trackerUrl: 'https://tracker.gg/valorant/profile/riot/Nivox%23zero/matches?platform=pc&playlist=competitive',
    playlist: 'competitive',
  },
  {
    playerId: 'catty',
    riotId: 'catty#111',
    trackerUrl: 'https://tracker.gg/valorant/profile/riot/catty%23111/matches?platform=pc&playlist=competitive',
    playlist: 'competitive',
  },
  {
    playerId: 'more',
    riotId: 'moreNO#less',
    trackerUrl: 'https://tracker.gg/valorant/profile/riot/moreNO%23less/matches?platform=pc&playlist=competitive',
    playlist: 'competitive',
  },
  {
    playerId: 'th0maz7',
    riotId: 'Th0maz7#愛してる彼',
    trackerUrl: 'https://tracker.gg/valorant/profile/riot/Th0maz7%23%E6%84%9B%E3%81%97%E3%81%A6%E3%82%8B%E5%BD%BC/matches?platform=pc&playlist=competitive',
    playlist: 'competitive',
  },
  {
    playerId: 'tz',
    riotId: 'tz one more time#1757',
    trackerUrl: 'https://tracker.gg/valorant/profile/riot/tz%20one%20more%20time%231757/matches?platform=pc&playlist=competitive',
    playlist: 'competitive',
  },
  {
    playerId: 'lyel',
    riotId: 'xyz#off',
    trackerUrl: 'https://tracker.gg/valorant/profile/riot/xyz%23off/matches?platform=pc&playlist=competitive',
    playlist: 'competitive',
  },
  {
    playerId: 'levi',
    riotId: 'the creator#weed',
    trackerUrl: 'https://tracker.gg/valorant/profile/riot/the%20creator%23weed/matches?platform=pc&playlist=competitive',
    playlist: 'competitive',
  },
];

export function getCompetitiveProfile(playerId: string) {
  return competitiveProfiles.find((profile) => profile.playerId === playerId);
}
