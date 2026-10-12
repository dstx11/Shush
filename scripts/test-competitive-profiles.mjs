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
    'src/lib/validate-profiles.ts', 'src/data/competitive-profiles.ts', 'src/data/players.ts', 'src/data/verified-matches.ts', 'src/lib/home-selection.ts', 'src/lib/match-explorer.ts',
    '--module', 'commonjs', '--moduleResolution', 'bundler', '--target', 'ES2020',
    '--lib', 'ES2020,DOM', '--skipLibCheck', '--outDir', output, '--rootDir', 'src',
  ], { cwd: root, stdio: 'inherit' });
  const require = createRequire(import.meta.url);
  const { competitiveProfiles, getCompetitiveProfile } = require(join(output, 'data/competitive-profiles.js'));
  const { players, rosterIndex, playerDropUrl } = require(join(output, 'data/players.js'));
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

  const official = [['dstx', '11', 'M'], ['more', '13', 'M'], ['th0maz7', '07', 'M'], ['lyel', '16', 'XXL'], ['tz', '10', 'M'], ['levi', '09', 'M'], ['catty', '20', 'M']];
  assert.deepEqual(players.map(p => [p.id, p.number, p.size]), official);
  for (const [index, player] of players.entries()) {
    assert.equal(rosterIndex(player.id), String(index + 1).padStart(2, '0'));
    const url = new URL(playerDropUrl(player), 'https://shush.pt');
    assert.equal(url.searchParams.get('number'), player.number);
    assert.equal(url.searchParams.get('size'), player.size);
    assert.equal(url.searchParams.get('nick'), player.displayName);
  }
  const { selectHomePlayers } = require(join(output, 'lib/home-selection.js'));
  for (let start = 0; start < 7; start++) {
    let cursor = start; let previous = []; const seen = new Map(); const centres = new Set();
    for (let visit = 0; visit < 70; visit++) {
      const selected = selectHomePlayers(cursor);
      assert.equal(new Set(selected.ids).size, 3);
      assert.notDeepEqual([...previous].sort(), [...selected.ids].sort());
      selected.ids.forEach(id => seen.set(id, (seen.get(id) ?? 0) + 1));
      centres.add(selected.ids[1]); cursor = selected.next; previous = selected.ids;
      const appearances = players.map(p => seen.get(p.id) ?? 0);
      assert.ok(Math.max(...appearances) - Math.min(...appearances) <= 1);
    }
    assert.equal(centres.size, 7);
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
  const { filterMatches, mapPerformance } = require(join(output, 'lib/match-explorer.js'));
  assert.equal(filterMatches(verifiedMatches, 'win', 'all').length, 2);
  assert.equal(filterMatches(verifiedMatches, 'loss', 'all').length, 3);
  assert.equal(filterMatches(verifiedMatches, 'loss', 'Ascent').length, 0);
  assert.deepEqual(mapPerformance(verifiedMatches), [
    { map: 'Haven', played: 1, wins: 0, losses: 1, rate: 0 },
    { map: 'Lotus', played: 1, wins: 0, losses: 1, rate: 0 },
    { map: 'Ascent', played: 2, wins: 2, losses: 0, rate: 100 },
    { map: 'Breeze', played: 1, wins: 0, losses: 1, rate: 0 },
  ]);
  console.log('Competitive profiles passed: seven mappings, Unicode, spaces, fragments, host, playlist and season integrity.');
} finally {
  await rm(output, { recursive: true, force: true });
}
