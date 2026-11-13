import {test,expect} from '@playwright/test';
import {verifiedMatches,matchSource} from '../../src/data/verified-matches';

test('Published results are sourced, chronological, unique and never prospective',()=>{
 expect(verifiedMatches).toHaveLength(10);
 expect(new Set(verifiedMatches.map(match=>match.id)).size).toBe(verifiedMatches.length);
 expect(verifiedMatches.map(match=>match.date)).toEqual([...verifiedMatches.map(match=>match.date)].sort().reverse());
 for(const match of verifiedMatches){
  expect(match.source).toBe(matchSource);
  expect(match.shushScore).toBeGreaterThanOrEqual(0);
  expect(match.opponentScore).toBeGreaterThanOrEqual(0);
  expect(match.date).toMatch(/^2026-/);
  expect(match.verifiedAt).toBe('2026-11-13');
 }
 expect(verifiedMatches.filter(m=>m.shushScore>m.opponentScore)).toHaveLength(5);
});
