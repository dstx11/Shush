import { useEffect, useRef, useState } from 'react';

const sessionKey = 'shush:intro-seen';
function shouldShowIntro() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  try { return sessionStorage.getItem(sessionKey) !== '1'; } catch { return false; }
}

/** A short, skippable first-visit reveal. Native dialog prevents hidden-page clicks. */
export function BrandIntro() {
  const [visible, setVisible] = useState(shouldShowIntro);
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!visible || !dialog) return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    let exit: ReturnType<typeof setTimeout>;
    const close = () => { dialog.close(); setVisible(false); };
    const ready = () => { exit = setTimeout(close, Math.max(0, 700 - performance.now())); };
    const reduce = () => { if (media.matches) close(); };
    dialog.showModal();
    try { sessionStorage.setItem(sessionKey, '1'); } catch { close(); }
    window.addEventListener('shush:ready', ready, { once: true });
    media.addEventListener('change', reduce);
    const limit = setTimeout(close, 1400);
    return () => { clearTimeout(exit); clearTimeout(limit); dialog.close(); window.removeEventListener('shush:ready', ready); media.removeEventListener('change', reduce); };
  }, [visible]);
  if (!visible) return null;
  return <dialog ref={dialogRef} className="brand-intro" aria-label="Entrada SHUSH" onCancel={() => setVisible(false)}>
    <div className="loading-emblem" aria-hidden="true"><span className="loading-orbit" /><img src="/assets/brand/shush-logo-small.webp" width="1167" height="647" alt="" /><span className="loading-shutter" /></div>
    <strong>SHUSH</strong>
    <button type="button" className="intro-skip" onClick={() => { dialogRef.current?.close(); setVisible(false); }}>Entrar <span aria-hidden="true">↗</span></button>
  </dialog>;
}
