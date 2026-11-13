import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useSeason } from '../../seasonal/SeasonProvider';
import { lisbonDate, type SeasonId } from '../../seasonal/calendar.mjs';
import { SeasonArtwork } from '../seasonal/SeasonArtwork';

const INTRO_SEEN = (id: SeasonId) => 'shush:intro:' + id + ':' + lisbonDate().year;
const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  || document.documentElement.dataset.motion === 'reduce' || (() => { try { return localStorage.getItem('shush:motion:v1') === 'reduce'; } catch { return false; } })();
function shouldPlay(id: SeasonId) {
  if (typeof window === 'undefined' || reduceMotion()) return false;
  try { return sessionStorage.getItem(INTRO_SEEN(id)) !== '1'; }
  catch { return false; } // A restricted browser must never be trapped behind an overlay.
}
export function BrandIntro() {
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
    try { sessionStorage.setItem(INTRO_SEEN(id), '1'); } catch { /* optional storage */ }
    return () => {
      document.body.style.overflow = previousOverflow;
      if (element.open) element.close();
    };
  }, [visible, id]);

  // Resources can finish early; the sequence still gets time to breathe.
  // On slow or failed assets we exit within 4.9 s, not an endless loading screen.
  useEffect(() => {
    if (!visible) return;
    let active = true;
    let ready = false;
    let minimumElapsed = false;
    let finishing = false;
    const timeouts: number[] = [];
    const later = (fn: () => void, milliseconds: number) => {
      const timer = window.setTimeout(() => { if (active) fn(); }, milliseconds);
      timeouts.push(timer);
    };
    const finish = () => {
      if (finishing) return;
      finishing = true;
      setPhase(3);
      setLeaving(true);
      later(() => setVisible(false), 380);
    };
    const maybeFinish = () => { if (ready && minimumElapsed) finish(); };
    const markReady = () => { ready = true; maybeFinish(); };
    later(() => setPhase(1), 1050);
    later(() => setPhase(2), 2380);
    later(() => { minimumElapsed = true; maybeFinish(); }, 3450);
    later(finish, 5100);
    window.addEventListener('shush:ready', markReady, { once: true });
    const images = Array.from(document.querySelectorAll<HTMLImageElement>('.route-frame img:not([loading="lazy"])')).slice(0, 7);
    Promise.allSettled([document.fonts.ready, ...images.map(image => image.decode())]).then(() => { if (active) markReady(); });
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => { if (reduceMotion()) finish(); };
    media.addEventListener('change', onChange);
    return () => {
      active = false;
      timeouts.forEach(timer => window.clearTimeout(timer));
      window.removeEventListener('shush:ready', markReady);
      media.removeEventListener('change', onChange);
    };
  }, [visible]);

  if (!visible) return null;
  return <dialog ref={dialog} className={'brand-intro shush-season-intro shush-intro-v3' + (leaving ? ' is-leaving' : '')}
      data-phase={phase} aria-label="Entrada SHUSH" aria-describedby="intro-description"
      onCancel={event => { event.preventDefault(); setVisible(false); }}>
    <div className="shush-intro-v3-grid" aria-hidden="true" /><div className="shush-intro-v3-rays" aria-hidden="true"><span/><span/><span/><span/><span/></div>
    <div className="shush-intro-v3-top" aria-hidden="true"><span>SHUSH / VALORANT</span><span>{theme.chapter}</span></div>
    <div className="shush-intro-v3-stage">
      <div className="shush-intro-v3-emblem" aria-hidden="true">
        <span className="shush-intro-v3-ring shush-intro-v3-ring-a" />
        <span className="shush-intro-v3-ring shush-intro-v3-ring-b" />
        <SeasonArtwork id={id} />
        <img src="/assets/brand/shush-logo-small.webp" width="1167" height="647" alt="" />
      </div>
      <span className="shush-intro-v3-overline">IDENTIDADE EM MOVIMENTO / 001</span>
      <strong className="shush-intro-v3-title">{Array.from('SHUSH').map((letter,index)=><span key={index}>{letter}</span>)}<span className="intro-period">.</span></strong><div className="shush-intro-v3-cutline" aria-hidden="true"><span>O SILÊNCIO ANTES DO ROUND</span><span>UMA EQUIPA. UM SINAL.</span><span>SHUSH / VALORANT</span></div>
      <p id="intro-description">{theme.introSub}</p>
    </div>
    <div className="shush-intro-v3-bottom">
      <div className="shush-intro-v3-progress-head">
        <span aria-live="off">{phase === 0 ? 'A iniciar transmissão' : phase === 1 ? 'Sinal SHUSH detetado' : phase === 2 ? 'A entrar no lobby' : 'Pronto'}</span>
        <span aria-hidden="true">{String(Math.min(phase + 1, 3)).padStart(2, '0')} / 03</span>
      </div>
      <div className={'shush-intro-v3-track phase-' + phase} aria-hidden="true"><span /></div>
      <span className="shush-intro-v3-caption" role="status">{phase === 3 ? 'SHUSH pronta.' : 'A preparar SHUSH…'}</span>
    </div>
  </dialog>;
}
