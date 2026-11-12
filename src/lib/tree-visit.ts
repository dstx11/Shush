export const treeVariants = ['christmas', 'ice', 'shush'] as const;
export type TreeVariant = typeof treeVariants[number];
export const treeVisitKey = 'shush:winter:tree:v2';

/** Select from the other two scenes, never from arbitrary unvalidated values. */
export function chooseTreeVariant(previous: string | null, random: number): TreeVariant {
  const candidates = treeVariants.filter(variant => variant !== previous);
  const value = Number.isFinite(random) ? Math.max(0, Math.min(.999999, random)) : 0;
  return candidates[Math.floor(value * candidates.length)];
}

let visit: { variant: TreeVariant; returning: boolean } | undefined;
export function getTreeVisit() {
  if (typeof window === 'undefined') return { variant: 'christmas' as const, returning: false };
  if (!visit) {
    let previous: string | null = null;
    let returning = false;
    try { previous = window.localStorage.getItem(treeVisitKey); } catch { /* Optional persistence. */ }
    try { returning = window.sessionStorage.getItem('shush:intro-seen') === '1'; } catch { /* First-visit timing is safe too. */ }
    const variant = chooseTreeVariant(previous, Math.random());
    visit = { variant, returning };
    try { window.localStorage.setItem(treeVisitKey, variant); } catch { /* The module still keeps this document stable. */ }
  }
  return visit;
}
