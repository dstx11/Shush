import type { Player } from './players';
import { players } from './players';

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

export type TournamentResult = {
  id: string;
  seasonId: string;
  tournamentName: string;
  finalStatus: 'champions' | '2nd' | '3rd-4th' | '5th-8th' | 'eliminated_before_playoffs';
  finalScore?: number;
  qualificationPoints?: number;
  createdAt: string;
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

const baseSeason = {
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
};

export const activePremierSeason: PremierSeason = {
  id: 'premier-stage-2026-local',
  name: 'Premier Stage 2026',
  ...baseSeason,
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

const scenarioWeeks: PremierWeek[] = activePremierSeason.weeks.map((week) => ({ ...week, selectedDays: [...week.selectedDays] }));

export const premierScenarioSeasons: Record<string, PremierSeason> = {
  resultPending: {
    ...activePremierSeason,
    id: 'scenario-result-pending',
    name: 'Scenario Result Pending',
    weeks: [
      {
        id: 'pending-week',
        weekNumber: 1,
        map: 'Bind',
        selectedDays: [{ id: 'pending-day', date: '2026-06-24', windowStart: '18:00', windowEnd: '19:00' }],
        convocados: mainFive,
        streams: creatorStreams,
      },
    ],
    results: [],
    playoffResults: [],
  },
  qualified: {
    ...activePremierSeason,
    id: 'scenario-qualified',
    name: 'Scenario Qualified',
    weeks: scenarioWeeks,
    results: Array.from({ length: 6 }, (_, index) => ({
      id: `qualified-win-${index + 1}`,
      date: `2026-06-${String(1 + index).padStart(2, '0')}`,
      tournamentName: 'Premier',
      phase: 'regular' as const,
      map: 'Haven',
      outcome: 'win' as const,
      shushScore: 13,
      opponentScore: 9,
    })),
    playoffResults: [],
  },
  eliminatedBeforePlayoffs: {
    ...activePremierSeason,
    id: 'scenario-eliminated-before-playoffs',
    name: 'Scenario Eliminated Before Play-offs',
    playoffsDate: '2026-06-25',
    weeks: scenarioWeeks,
    results: Array.from({ length: 7 }, (_, index) => ({
      id: `eliminated-loss-${index + 1}`,
      date: `2026-06-${String(1 + index).padStart(2, '0')}`,
      tournamentName: 'Premier',
      phase: 'regular' as const,
      map: 'Lotus',
      outcome: 'loss' as const,
      shushScore: 8,
      opponentScore: 13,
    })),
    playoffResults: [],
  },
  playoffEliminated: {
    ...activePremierSeason,
    id: 'scenario-playoff-eliminated',
    name: 'Scenario Play-off Eliminated',
    results: Array.from({ length: 6 }, (_, index) => ({
      id: `playoff-regular-win-${index + 1}`,
      date: `2026-06-${String(1 + index).padStart(2, '0')}`,
      tournamentName: 'Premier',
      phase: 'regular' as const,
      map: 'Split',
      outcome: 'win' as const,
      shushScore: 13,
      opponentScore: 7,
    })),
    playoffResults: [
      {
        id: 'playoff-game-1-loss',
        date: '2026-07-26',
        tournamentName: 'Premier',
        phase: 'playoffs',
        playoffRound: 1,
        map: 'Bind',
        outcome: 'loss',
        shushScore: 9,
        opponentScore: 13,
      },
    ],
  },
  champions: {
    ...activePremierSeason,
    id: 'scenario-champions',
    name: 'Scenario Champions',
    results: Array.from({ length: 6 }, (_, index) => ({
      id: `champion-regular-win-${index + 1}`,
      date: `2026-06-${String(1 + index).padStart(2, '0')}`,
      tournamentName: 'Premier',
      phase: 'regular' as const,
      map: 'Ascent',
      outcome: 'win' as const,
      shushScore: 13,
      opponentScore: 8,
    })),
    playoffResults: [
      {
        id: 'champions-game-1',
        date: '2026-07-26',
        tournamentName: 'Premier',
        phase: 'playoffs',
        playoffRound: 1,
        map: 'Bind',
        outcome: 'win',
        shushScore: 13,
        opponentScore: 10,
      },
      {
        id: 'champions-game-2',
        date: '2026-07-26',
        tournamentName: 'Premier',
        phase: 'playoffs',
        playoffRound: 2,
        map: 'Haven',
        outcome: 'win',
        shushScore: 13,
        opponentScore: 11,
      },
      {
        id: 'champions-final',
        date: '2026-07-26',
        tournamentName: 'Premier',
        phase: 'playoffs',
        playoffRound: 3,
        map: 'Lotus',
        outcome: 'win',
        shushScore: 13,
        opponentScore: 9,
      },
    ],
  },
};

export const tournamentResults: TournamentResult[] = [
  {
    id: 'result-sample-champions',
    seasonId: 'scenario-champions',
    tournamentName: 'Premier Stage 2026',
    finalStatus: 'champions',
    finalScore: 600,
    qualificationPoints: 600,
    createdAt: '2026-07-26',
  },
  {
    id: 'result-sample-playoff-eliminated',
    seasonId: 'scenario-playoff-eliminated',
    tournamentName: 'Premier Stage 2026',
    finalStatus: '5th-8th',
    finalScore: 600,
    qualificationPoints: 600,
    createdAt: '2026-07-26',
  },
  {
    id: 'result-sample-eliminated',
    seasonId: 'scenario-eliminated-before-playoffs',
    tournamentName: 'Premier Stage 2026',
    finalStatus: 'eliminated_before_playoffs',
    finalScore: 175,
    qualificationPoints: 600,
    createdAt: '2026-06-25',
  },
];

export function getPlayersByIds(ids: string[]): Player[] {
  return ids.map((id) => players.find((player) => player.id === id)).filter((player): player is Player => Boolean(player));
}
