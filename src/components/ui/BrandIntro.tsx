import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useSeason } from '../../seasonal/SeasonProvider';
import { lisbonDate, type SeasonId } from '../../seasonal/calendar.mjs';
import { SeasonArtwork } from '../seasonal/SeasonArtwork';

const INTRO_SEEN = (id: SeasonId) => 'shush:intro:' + id + ':' + lisbonDate().year;
const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  || document.documentElement.dataset.motion === 'reduce' || (() => { try { return localStorage.getItem('shush:motion:v1') === 'reduce'; } catch { return false; } })();
function shouldPlay(id: SeasonId) {
  if (typeof window === 'undefined' || reduceMotion()) return false;
  try { return sessionStorage.getItem(INTRO_SEEN(id)) !== '1' && localStorage.getItem(INTRO_SEEN(id)) !== '1'; }
  catch { return false; } // A restricted browser must never be trapped behind an overlay.
}
export function BrandIntro({ onComplete }: { onComplete: () => void }) {
  const { id, theme } = useSeason();
  const [visible, setVisible] = useState(() => shouldPlay(id));
  const [leaving, setLeaving] = useState(false);
  const [phase, setPhase] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const didOpen = useRef(false);

  // Use a static HTML stage before React mounts: no glimpse of the page before
  // the actual dialog has entered the browser's top layer.
  useLayoutEffect(() => {
    const boot = document.getElementById('shush-boot-stage');
    if (!visible) {
      boot?.remove();
      onComplete();
      if (didOpen.current) document.getElementById('main-content')?.focus({ preventScroll: true });
      return;
    }
    const element = dialog.current;
    if (!element) return;
    if (!element.open) element.showModal();
    didOpen.current = true;
    boot?.remove();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    try { sessionStorage.setItem(INTRO_SEEN(id), '1'); localStorage.setItem(INTRO_SEEN(id), '1'); } catch { /* optional storage */ }
    return () => {
      document.body.style.overflow = previousOverflow;
      if (element.open) element.close();
    };
  }, [visible, id, onComplete]);

  // No minimum duration: cached resources can reveal the page immediately.
  // The exit is visual continuity, not a second simulated loading task.
  useEffect(() => {
    if (!visible) return;
    let active = true;
    let finishing = false;
    const timeouts: number[] = [];
    const later = (fn: () => void, milliseconds: number) => {
      timeouts.push(window.setTimeout(() => { if (active) fn(); }, milliseconds));
    };
    const finish = () => {
      if (finishing || !active) return;
      finishing = true;
      timeouts.forEach(timer => window.clearTimeout(timer));
      setPhase(3);
      setLeaving(true);
      later(() => setVisible(false), 320);
    };
    later(() => setPhase(1), 500);
    later(() => setPhase(2), 1200);
    later(finish, 3000);
    const images = Array.from(document.querySelectorAll<HTMLImageElement>('.route-frame img:not([loading="lazy"])')).slice(0, 7);
    Promise.allSettled([document.fonts.ready, ...images.map(image => image.decode())]).then(finish);
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => { if (reduceMotion()) setVisible(false); };
    media.addEventListener('change', onChange);
    document.addEventListener('shush:reduce-motion', onChange);
    return () => {
      active = false;
      timeouts.forEach(timer => window.clearTimeout(timer));
      media.removeEventListener('change', onChange);
      document.removeEventListener('shush:reduce-motion', onChange);
    };
  }, [visible]);

  if (!visible) return null;
  return <dialog ref={dialog} className={'brand-intro shush-season-intro shush-intro-v3' + (leaving ? ' is-leaving' : '')}
      aria-label="Entrada SHUSH" aria-describedby="intro-description"
      onCancel={event => { event.preventDefault(); setVisible(false); }}>
    <div className="shush-intro-v3-grid" aria-hidden="true" />
    <div className="shush-intro-v3-top"><span aria-hidden="true">SHUSH / VALORANT</span><button className="intro-skip" type="button" onClick={() => setVisible(false)}>Saltar apresentação <span aria-hidden="true">↗</span></button></div>
    <div className="shush-intro-v3-stage">
      <div className="shush-intro-v3-emblem" aria-hidden="true">
        <span className="shush-intro-v3-ring shush-intro-v3-ring-a" />
        <span className="shush-intro-v3-ring shush-intro-v3-ring-b" />
        <SeasonArtwork id={id} />
        <img src="/assets/brand/shush-logo-small.webp" width="1167" height="647" alt="" />
      </div>
      <span className="shush-intro-v3-overline">SEM BARULHO. SÓ ROUNDS.</span>
      <strong className="shush-intro-v3-title">SHUSH<span>.</span></strong>
      <p id="intro-description">{theme.introSub}</p>
    </div>
    <div className="shush-intro-v3-bottom">
      <div className="shush-intro-v3-progress-head">
        <span aria-live="off">{phase === 0 ? 'A compor a experiência' : phase === 1 ? 'A revelar a identidade' : phase === 2 ? 'A preparar o próximo round' : 'Pronto'}</span>
        <span aria-hidden="true">{String(Math.min(phase + 1, 3)).padStart(2, '0')} / 03</span>
      </div>
      <div className={'shush-intro-v3-track phase-' + phase} aria-hidden="true"><span /></div>
      <span className="shush-intro-v3-caption" role="status">{phase === 3 ? 'SHUSH pronta.' : 'A preparar SHUSH…'}</span>
    </div>
  </dialog>;
}
