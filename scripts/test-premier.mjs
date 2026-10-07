import { execFileSync } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = await mkdtemp(join(tmpdir(), 'shush-premier-'));
const originalTimezone = process.env.TZ;
const tsc = join(
  root,
  'node_modules',
  'typescript',
  'bin',
  'tsc',
);

try {
  execFileSync(
    process.execPath,
    [
      tsc,
      '--ignoreConfig',
      'src/lib/premier.ts',
      'src/data/season.ts',
      'src/lib/validate-data.ts',
      '--module',
      'commonjs',
      '--moduleResolution',
      'bundler',
      '--target',
      'ES2020',
      '--lib',
      'ES2020,DOM',
      '--skipLibCheck',
      '--esModuleInterop',
      '--outDir',
      output,
      '--rootDir',
      'src',
    ],
    { cwd: root, stdio: 'inherit' },
  );

  const require = createRequire(import.meta.url);
  const premier = require(join(output, 'lib', 'premier.js'));
  const { activePremierSeason } = require(join(output, 'data', 'season.js'));
  const { players } = require(join(output, 'data', 'players.js'));
  const { validateStaticData } = require(join(output, 'lib', 'validate-data.js'));
  assert.doesNotThrow(() => validateStaticData(players, activePremierSeason));
  const invalidSeasonCases = [
    { ...activePremierSeason, qualificationPoints: NaN },
    { ...activePremierSeason, winPoints: -1 },
    { ...activePremierSeason, playoffsWindowStart: '25:00' },
    { ...activePremierSeason, timezone: 'Unknown/Timezone' },
    { ...activePremierSeason, results: [{ ...activePremierSeason.results[0], shushScore: 1, opponentScore: 13 }] },
    { ...activePremierSeason, results: [{ ...activePremierSeason.results[0], opponentScore: undefined }] },
    { ...activePremierSeason, results: [{ ...activePremierSeason.results[0], date: '2026-02-30' }] },
    { ...activePremierSeason, weeks: [activePremierSeason.weeks[0], activePremierSeason.weeks[0]] },
    { ...activePremierSeason, weeks: [{ ...activePremierSeason.weeks[0], convocados: ['unknown-player'] }] },
  ];
  for (const season of invalidSeasonCases) assert.throws(() => validateStaticData(players, season), /static data validation failed/);
  assert.throws(() => validateStaticData([], activePremierSeason), /roster cannot be empty/);
  assert.throws(() => validateStaticData([...players, players[0]], activePremierSeason), /duplicate player/);
  assert.throws(() => validateStaticData([{ ...players[0], isCreator: true }], { ...activePremierSeason, weeks: [] }), /missing creatorType/);

  assert.equal(
    premier.calculatePremierScore(activePremierSeason),
    125,
    'published Premier score should be 125 points',
  );

  const beforeWindow = new Date('2026-06-12T16:30:00Z');
  assert.equal(
    premier.calculatePublicMatchDayState(activePremierSeason, beforeWindow).kind,
    'upcoming',
    '17:30 in Lisbon should still be before the 18:00 window',
  );

  const liveInstant = new Date('2026-06-12T17:30:00Z');

  for (const timezone of ['UTC', 'America/Sao_Paulo', 'Asia/Tokyo']) {
    process.env.TZ = timezone;
    const state = premier.calculatePublicMatchDayState(activePremierSeason, liveInstant);
    assert.equal(
      state.kind,
      'match_day_live',
      `18:30 Lisbon should be live even when the runtime timezone is ${timezone}`,
    );
    assert.equal(state.week.weekNumber, 1);
  }

  const afterSeason = new Date('2026-08-01T12:00:00Z');
  assert.equal(
    premier.calculateSeasonStatus(activePremierSeason, afterSeason),
    'Closed',
    'partial published results cannot prove elimination',
  );
  assert.equal(
    premier.calculatePublicMatchDayState(activePremierSeason, afterSeason).kind,
    'season_closed',
    'an ended season must not fall back to a stale pending result',
  );

  assert.equal(
    premier.formatResultLine(activePremierSeason.results[0]),
    'SHUSH 13-8 · adversário não publicado',
    'known score should remain visible without inventing an opponent',
  );

  const qualifiedSeason = {
    ...activePremierSeason,
    results: Array.from({ length: 6 }, (_, index) => ({
      id: `test-win-${index + 1}`,
      date: `2026-06-${String(index + 1).padStart(2, '0')}`,
      tournamentName: 'Premier',
      phase: 'regular',
      map: 'Haven',
      outcome: 'win',
      shushScore: 13,
      opponentScore: 8,
    })),
  };

  assert.equal(
    premier.calculateSeasonStatus(qualifiedSeason, new Date('2026-07-20T12:00:00Z')),
    'Qualified',
    '600 points after regular windows should qualify the team',
  );

  assert.equal(premier.calculateSeasonStatus(qualifiedSeason, afterSeason), 'Closed',
    'an ended playoff window must not remain live indefinitely');
  assert.equal(premier.calculatePublicMatchDayState(qualifiedSeason, afterSeason).kind, 'season_closed');

  const emptySeason = { ...activePremierSeason, weeks: [], results: [] };
  assert.equal(premier.calculateSeasonStatus(emptySeason, beforeWindow), 'Regular Season',
    'an unpublished calendar cannot prove the regular phase ended');

  // Check exact window edges and both Lisbon DST transitions in every runtime timezone.
  const windows = [
    ['2026-03-28', '2026-03-28T18:00:00Z'],
    ['2026-03-29', '2026-03-29T17:00:00Z'],
    ['2026-10-24', '2026-10-24T17:00:00Z'],
    ['2026-10-25', '2026-10-25T18:00:00Z'],
  ];
  for (const timezone of ['UTC', 'America/Sao_Paulo', 'Asia/Tokyo']) {
    process.env.TZ = timezone;
    for (const [date, instant] of windows) {
      const season = {
        ...emptySeason,
        playoffsDate: '2027-07-26',
        weeks: [{ ...activePremierSeason.weeks[0], selectedDays: [
          { id: 'test-window', date, windowStart: '18:00', windowEnd: '19:00' },
        ] }],
      };
      const start = Date.parse(instant);
      assert.equal(premier.calculatePublicMatchDayState(season, new Date(start - 1)).kind, 'upcoming');
      assert.equal(premier.calculatePublicMatchDayState(season, new Date(start)).kind, 'match_day_live');
      assert.equal(premier.calculatePublicMatchDayState(season, new Date(start + 100 * 60_000)).kind, 'match_day_live');
      assert.equal(premier.calculatePublicMatchDayState(season, new Date(start + 100 * 60_000 + 1)).kind, 'season_closed');
    }
  }

  const playoffWins = [1, 2, 3].map((round) => ({
    ...qualifiedSeason.results[0], id: `test-playoff-${round}`,
    date: '2026-07-26', phase: 'playoffs', playoffRound: round,
  }));
  const champions = { ...qualifiedSeason, playoffResults: playoffWins };
  assert.equal(premier.calculatePublicMatchDayState(champions, new Date('2026-10-07T12:00:00Z')).kind, 'champions',
    'a published championship must not disappear after 21 days');
  const eliminated = { ...qualifiedSeason, playoffResults: [{ ...playoffWins[0], outcome: 'loss' }] };
  assert.equal(premier.calculatePublicMatchDayState(eliminated, new Date('2026-07-26T18:00:00Z')).kind, 'eliminated',
    'a published playoff loss takes priority over the live window');
  assert.equal(premier.calculatePlayoffPlacement([{ ...playoffWins[0], outcome: 'cancelled' }]), null,
    'a cancelled round cannot advance the team');
  assert.equal(premier.calculatePlayoffPlacement([playoffWins[0], { ...playoffWins[1], outcome: 'cancelled' }, playoffWins[2]]).status,
    'playoffs_active', 'a cancelled semifinal cannot create a championship');

  console.log('Premier logic tests passed.');
} finally {
  if (originalTimezone === undefined) delete process.env.TZ;
  else process.env.TZ = originalTimezone;
  await rm(output, { recursive: true, force: true });
}
