import { useEffect, useState } from 'react';

const STORAGE_KEY = 'shush:motion:v1';
const PREFERENCE_EVENT = 'shush:motion-preference';
const readPreference = () => {
  try { return localStorage.getItem(STORAGE_KEY) === 'reduce'; } catch { return false; }
};

export function MotionControl({ compact = false }: { compact?: boolean }) {
  const [manual, setManual] = useState(readPreference);
  const [system, setSystem] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncSystem = () => setSystem(query.matches);
    const syncManual = () => setManual(document.documentElement.dataset.motion === 'reduce');
    const syncStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY && event.key !== null) return;
      const next = readPreference();
      document.documentElement.dataset.motion = next ? 'reduce' : 'system';
      setManual(next);
      if (next) document.dispatchEvent(new Event('shush:reduce-motion'));
    };
    query.addEventListener('change', syncSystem);
    window.addEventListener(PREFERENCE_EVENT, syncManual);
    window.addEventListener('storage', syncStorage);
    return () => {
      query.removeEventListener('change', syncSystem);
      window.removeEventListener(PREFERENCE_EVENT, syncManual);
      window.removeEventListener('storage', syncStorage);
    };
  }, []);
  useEffect(() => { document.documentElement.dataset.motion = manual ? 'reduce' : 'system'; }, [manual]);
  const change = () => {
    const next = !manual;
    try { localStorage.setItem(STORAGE_KEY, next ? 'reduce' : 'system'); } catch { /* Optional persistence. */ }
    document.documentElement.dataset.motion = next ? 'reduce' : 'system';
    window.dispatchEvent(new Event(PREFERENCE_EVENT));
    if (next) document.dispatchEvent(new Event('shush:reduce-motion'));
  };
  return <button className={'shush-motion-toggle' + (compact ? ' motion-compact' : '')} type="button"
    aria-pressed={manual || system} disabled={system}
    aria-label={compact ? 'Animações da página' : system ? 'Movimento reduzido pelo sistema' : 'Reduzir animações'}
    title={system ? 'Movimento reduzido pelo sistema' : 'Reduzir animações'} onClick={change}>
    <span className="motion-toggle-indicator" aria-hidden="true"><span /></span>
    <span>{compact ? 'Movimento' : system ? 'Movimento reduzido pelo sistema' : manual ? 'Animações reduzidas' : 'Reduzir animações'}</span>
  </button>;
}
