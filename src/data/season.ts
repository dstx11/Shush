export type MatchOutcome = 'win' | 'loss' | 'bye' | 'cancelled';
export type Platform = 'twitch' | 'youtube' | 'other';

export type StreamConfig = {
  playerId: string;
  platform: Platform;
  url: string;
  enabled: boolean;
};

export type PremierPlayDay = {
  id: string;
  date: string;
  windowStart: string;
  windowEnd: string;
};

export type PremierWeek = {
  id: string;
  weekNumber: number;
  map?: string;
  selectedDays: PremierPlayDay[];
  convocados: string[];
  streams: StreamConfig[];
};

export type MatchResult = {
  id: string;
  date: string;
  tournamentName: string;
  phase: 'regular' | 'playoffs';
  playoffRound?: 1 | 2 | 3;
  map?: string;
  opponent?: string;
  outcome: MatchOutcome;
  shushScore?: number;
  opponentScore?: number;
  highlightUrl?: string;
};

export type PlayoffResult = MatchResult & {
  phase: 'playoffs';
  playoffRound: 1 | 2 | 3;
};

export type PremierSeason = {
  id: string;
  name: string;
  tournamentName: string;
  timezone: string;
  winPoints: number;
  lossPoints: number;
  qualificationPoints: number;
  defaultWindowStart: string;
  defaultWindowEnd: string;
  playoffsDate: string;
  playoffsWindowStart: string;
  playoffsWindowEnd: string;
  weeks: PremierWeek[];
  results: MatchResult[];
  playoffResults: PlayoffResult[];
};

const mainFive = ['dstx', 'more', 'th0maz7', 'lyel', 'tz'];

const creatorStreams: StreamConfig[] = [
  {
    playerId: 'more',
    platform: 'twitch',
    url: 'https://www.twitch.tv/kandimba13',
    enabled: true,
  },
  {
    playerId: 'th0maz7',
    platform: 'youtube',
    url: 'https://www.youtube.com/@Th0maaz_7',
    enabled: true,
  },
];

export const activePremierSeason: PremierSeason = {
  id: 'premier-stage-2026-local',
  name: 'Premier Stage 2026',
  tournamentName: 'Premier',
  timezone: 'Europe/Lisbon',
  winPoints: 100,
  lossPoints: 25,
  qualificationPoints: 600,
  defaultWindowStart: '18:00',
  defaultWindowEnd: '19:00',
  playoffsDate: '2026-07-26',
  playoffsWindowStart: '18:00',
  playoffsWindowEnd: '21:00',
  weeks: [
    {
      id: 'week-1',
      weekNumber: 1,
      map: 'Haven',
      selectedDays: [{ id: 'week-1-day-1', date: '2026-06-12', windowStart: '18:00', windowEnd: '19:00' }],
      convocados: mainFive,
      streams: creatorStreams,
    },
    {
      id: 'week-2',
      weekNumber: 2,
      map: 'Lotus',
      selectedDays: [
        { id: 'week-2-day-1', date: '2026-06-19', windowStart: '18:00', windowEnd: '19:00' },
        { id: 'week-2-day-2', date: '2026-06-20', windowStart: '18:00', windowEnd: '19:00' },
      ],
      convocados: ['dstx', 'more', 'th0maz7', 'catty', 'levi'],
      streams: creatorStreams,
    },
    {
      id: 'week-3',
      weekNumber: 3,
      map: 'Split',
      selectedDays: [],
      convocados: [],
      streams: [],
    },
    {
      id: 'week-4',
      weekNumber: 4,
      map: 'Bind',
      selectedDays: [{ id: 'week-4-day-1', date: '2026-06-30', windowStart: '18:00', windowEnd: '19:00' }],
      convocados: mainFive,
      streams: creatorStreams,
    },
    {
      id: 'week-5',
      weekNumber: 5,
      map: 'Ascent',
      selectedDays: [
        { id: 'week-5-day-1', date: '2026-07-05', windowStart: '18:00', windowEnd: '19:00' },
        { id: 'week-5-day-2', date: '2026-07-06', windowStart: '18:00', windowEnd: '19:00' },
      ],
      convocados: ['dstx', 'lyel', 'tz', 'catty', 'levi'],
      streams: [],
    },
    {
      id: 'week-6',
      weekNumber: 6,
      selectedDays: [],
      convocados: [],
      streams: [],
    },
    {
      id: 'week-7',
      weekNumber: 7,
      map: 'Sunset',
      selectedDays: [{ id: 'week-7-day-1', date: '2026-07-18', windowStart: '18:00', windowEnd: '19:00' }],
      convocados: mainFive,
      streams: creatorStreams,
    },
  ],
  results: [
    {
      id: 'result-week-1',
      date: '2026-06-12',
      tournamentName: 'Premier',
      phase: 'regular',
      map: 'Haven',
      outcome: 'win',
      shushScore: 13,
      opponentScore: 8,
    },
    {
      id: 'result-week-2',
      date: '2026-06-19',
      tournamentName: 'Premier',
      phase: 'regular',
      map: 'Lotus',
      outcome: 'loss',
      shushScore: 10,
      opponentScore: 13,
    },
  ],
  playoffResults: [],
};
