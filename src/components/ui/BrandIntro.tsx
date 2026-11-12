import { ArrowIcon } from './ArrowIcon';
import { useEffect, useRef, useState } from 'react';

const sessionKey = 'shush:intro-seen';
function shouldShowIntro() {
  if (typeof window === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  try { return sessionStorage.getItem(sessionKey) !== '1'; } catch { return false; }
}

/** Resource-driven entrance. No minimum hold; Escape and Enter always skip. */
export function BrandIntro() {
  const [visible, setVisible] = useState(shouldShowIntro);
  const [leaving, setLeaving] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!visible || !dialog) return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    let exit: ReturnType<typeof setTimeout> | undefined;
    let contentReady = false;
    let closing = false;
    const close = () => { dialog.close(); setVisible(false); };
    const leave = () => {
      if (closing) return;
      closing = true;
      setLeaving(true);
      exit = setTimeout(close, 360);
    };
    const ready = () => {
      contentReady = true;
      const tree = document.querySelector<HTMLCanvasElement>('.winter-tree-canvas');
      if (!tree || tree.dataset.ready === 'true') leave();
    };
    const treeReady = () => { if (contentReady) leave(); };
    const reduce = () => { if (media.matches) close(); };
    dialog.showModal();
    try { sessionStorage.setItem(sessionKey, '1'); } catch { close(); }
    window.addEventListener('shush:ready', ready, { once: true });
    window.addEventListener('shush:tree-ready', treeReady);
    media.addEventListener('change', reduce);
    // A failed resource must never keep the site behind the introduction.
    const limit = setTimeout(close, 1600);
    return () => {
      clearTimeout(exit); clearTimeout(limit); dialog.close();
      window.removeEventListener('shush:ready', ready);
      window.removeEventListener('shush:tree-ready', treeReady);
      media.removeEventListener('change', reduce);
    };
  }, [visible]);
  if (!visible) return null;
  return <dialog ref={dialogRef} className={`brand-intro${leaving ? ' is-leaving' : ''}`} aria-label="Entrada SHUSH" onCancel={() => setVisible(false)}>
    <div className="intro-constellation" aria-hidden="true"><i /><i /><i /><i /><i /><span>✦</span></div>
    <span className="intro-kicker">UMA NOITE. O NOSSO LOBBY.</span>
    <strong>Há luz<br /><em>no silêncio.</em></strong>
    <p>Entra. Está-se bem por aqui.</p>
    <button type="button" className="intro-skip" onClick={() => { dialogRef.current?.close(); setVisible(false); }}>Entrar <span aria-hidden="true"><ArrowIcon /></span></button>
    <span className="intro-signature" aria-hidden="true">SHUSH · NATAL 2026</span>
  </dialog>;
}
