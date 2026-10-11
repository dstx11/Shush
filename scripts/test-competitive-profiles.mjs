import { execFileSync } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = await mkdtemp(join(tmpdir(), 'shush-profiles-'));

try {
  execFileSync(process.execPath, [
    join(root, 'node_modules/typescript/bin/tsc'), '--ignoreConfig',
    'src/lib/validate-profiles.ts', 'src/data/competitive-profiles.ts', 'src/data/players.ts', 'src/data/verified-matches.ts',
    '--module', 'commonjs', '--moduleResolution', 'bundler', '--target', 'ES2020',
    '--lib', 'ES2020,DOM', '--skipLibCheck', '--outDir', output, '--rootDir', 'src',
  ], { cwd: root, stdio: 'inherit' });
  const require = createRequire(import.meta.url);
  const { competitiveProfiles, getCompetitiveProfile } = require(join(output, 'data/competitive-profiles.js'));
  const { players } = require(join(output, 'data/players.js'));
  const { validateCompetitiveProfiles } = require(join(output, 'lib/validate-profiles.js'));

  assert.doesNotThrow(() => validateCompetitiveProfiles(competitiveProfiles, players));
  const confirmed = {
    dstx: 'Nivox#zero', catty: 'catty#111', more: 'moreNO#less',
    th0maz7: 'Th0maz7#愛してる彼', tz: 'tz one more time#1757',
    lyel: 'xyz#off', levi: 'the creator#weed',
  };
  assert.equal(competitiveProfiles.length, Object.keys(confirmed).length);
  for (const [id, riotId] of Object.entries(confirmed)) {
    const profile = getCompetitiveProfile(id);
    assert.equal(profile.riotId, riotId, `${id} must retain its confirmed account`);
    assert.equal(decodeURIComponent(new URL(profile.trackerUrl).pathname.split('/')[4]), riotId);
  }
  assert.equal(getCompetitiveProfile('unknown-player'), undefined);
  for (const profile of competitiveProfiles) {
    const url = new URL(profile.trackerUrl);
    assert.ok(url.pathname.endsWith('/matches'));
    assert.equal(url.search, '?platform=pc&playlist=competitive');
    assert.equal(profile.playlist, 'competitive');
  }

  const valid = getCompetitiveProfile('catty');
  const invalid = [
    { ...valid, playerId: 'unknown' },
    { ...valid, riotId: 'other#111' },
    { ...valid, riotId: 'catty' },
    { ...valid, trackerUrl: valid.trackerUrl.replace('https:', 'http:') },
    { ...valid, trackerUrl: valid.trackerUrl.replace('tracker.gg', 'tracker.gg.evil.example') },
    { ...valid, trackerUrl: valid.trackerUrl.replace('tracker.gg', 'user:password@tracker.gg') },
    { ...valid, trackerUrl: valid.trackerUrl.replace('%23', '#') },
    { ...valid, trackerUrl: valid.trackerUrl.replace('%23', '%ZZ') },
    { ...valid, trackerUrl: valid.trackerUrl.replace('%23', '%2523') },
    { ...valid, trackerUrl: `${valid.trackerUrl}&playlist=competitive` },
    { ...valid, trackerUrl: `${valid.trackerUrl}&season=unverified` },
    { ...valid, trackerUrl: valid.trackerUrl.replace('/matches', '/overview') },
    { ...valid, playlist: 'premier' },
  ];
  for (const profile of invalid) assert.throws(() => validateCompetitiveProfiles(competitiveProfiles.map(item => item.playerId === valid.playerId ? profile : item), players), /profile validation failed/);
  assert.throws(() => validateCompetitiveProfiles([valid, valid], players), /duplicate player/);
  assert.throws(() => validateCompetitiveProfiles([valid, { ...valid, playerId: 'levi' }], players), /duplicate Riot account/);
  const { verifiedMatches, matchSource } = require(join(output, 'data/verified-matches.js'));
  assert.equal(verifiedMatches.length, 5);
  assert.equal(new Set(verifiedMatches.map(match => match.id)).size, 5);
  for (const [index, match] of verifiedMatches.entries()) {
    assert.equal(match.source, matchSource);
    assert.equal(match.verifiedAt, '2026-10-10');
    assert.ok(/^2026-\d{2}-\d{2}$/.test(match.date));
    assert.ok(match.date <= match.verifiedAt);
    assert.ok(match.opponent && match.map);
    assert.ok(Number.isInteger(match.shushScore) && match.shushScore >= 0);
    assert.ok(Number.isInteger(match.opponentScore) && match.opponentScore >= 0);
    assert.notEqual(match.shushScore, match.opponentScore);
    if (index) assert.ok(verifiedMatches[index - 1].date >= match.date);
  }
  assert.deepEqual(verifiedMatches.map(({ date, map, opponent, shushScore, opponentScore }) =>
    [date, map, opponent, shushScore, opponentScore]), [
    ['2026-06-06', 'Haven', 'EnLitro', 9, 13],
    ['2026-05-16', 'Lotus', 'VallhallaWolves', 10, 13],
    ['2026-05-10', 'Ascent', 'Prime Esports', 13, 10],
    ['2026-05-10', 'Ascent', 'RABOOZ', 13, 4],
    ['2026-04-26', 'Breeze', 'Nox Lykos', 6, 13],
  ]);
  console.log('Competitive profiles passed: seven mappings, Unicode, spaces, fragments, host, playlist and season integrity.');
} finally {
  await rm(output, { recursive: true, force: true });
}
