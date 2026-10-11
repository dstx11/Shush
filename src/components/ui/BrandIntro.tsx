import { useEffect, useState } from 'react';

/** One intro per document, bounded even when a route or image fails. */
export function BrandIntro() {
  const [visible, setVisible] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    if (!visible) return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    let exit: ReturnType<typeof setTimeout>;
    const close = () => setVisible(false);
    const ready = () => { exit = setTimeout(close, Math.max(0, 1800 - performance.now())); };
    const reduce = () => { if (media.matches) close(); };
    window.addEventListener('shush:ready', ready, { once: true });
    media.addEventListener('change', reduce);
    const limit = setTimeout(close, 6000);
    return () => { clearTimeout(exit); clearTimeout(limit); window.removeEventListener('shush:ready', ready); media.removeEventListener('change', reduce); };
  }, [visible]);
  if (!visible) return null;
  return <div className="brand-intro" aria-hidden="true"><div className="loading-emblem"><span className="loading-orbit" /><img src="/assets/brand/shush-logo.webp" width="1167" height="647" alt="" /><span className="loading-shutter" /></div><strong>SHUSH</strong><span className="intro-caption">THE NEXT ROUND</span></div>;
}
