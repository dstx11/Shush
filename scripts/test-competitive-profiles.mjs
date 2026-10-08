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
    'src/lib/validate-profiles.ts', 'src/data/competitive-profiles.ts', 'src/data/players.ts',
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
  assert.equal(getCompetitiveProfile('dstx').seasonId, '8102cd81-43a0-d0d7-bd59-47b8fe9bed1b');
  assert.equal(getCompetitiveProfile('dstx').playlist, 'competitive');
  assert.ok(competitiveProfiles.filter((profile) => profile.playerId !== 'dstx').every((profile) => profile.playlist === 'premier' && !profile.seasonId));

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
    { ...valid, seasonId: '8102cd81-43a0-d0d7-bd59-47b8fe9bed1b' },
    { ...valid, playlist: 'competitive' },
  ];
  for (const profile of invalid) assert.throws(() => validateCompetitiveProfiles([profile], players), /profile validation failed/);
  assert.throws(() => validateCompetitiveProfiles([valid, valid], players), /duplicate player/);
  assert.throws(() => validateCompetitiveProfiles([valid, { ...valid, playerId: 'levi' }], players), /duplicate Riot account/);
  console.log('Competitive profiles passed: seven mappings, Unicode, spaces, fragments, host, playlist and season integrity.');
} finally {
  await rm(output, { recursive: true, force: true });
}
