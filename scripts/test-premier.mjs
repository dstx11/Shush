import { execFileSync } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = await mkdtemp(join(tmpdir(), 'shush-premier-'));
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
    'Eliminated before play-offs',
    'the published season should be closed after its final windows',
  );
  assert.equal(
    premier.calculatePublicMatchDayState(activePremierSeason, afterSeason).kind,
    'eliminated',
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

  console.log('Premier logic tests passed.');
} finally {
  await rm(output, { recursive: true, force: true });
}
