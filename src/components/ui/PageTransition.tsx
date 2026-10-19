import { useEffect, useRef, type ReactNode } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

const scrollPositions = new Map<string, number>();

type PageTransitionProps = {
  children: ReactNode;
  initialNavigation: boolean;
};

export function PageTransition({ children, initialNavigation }: PageTransitionProps) {
  const { pathname, hash, key } = useLocation();
  const navigationType = useNavigationType();
  const previousPath = useRef<string | null>(null);
  const firstNavigation = useRef(initialNavigation);
  const frameRef = useRef<HTMLDivElement>(null);
  const hasCommitted = useRef(false);

  useEffect(() => {
    let active = true;
    const images = Array.from(frameRef.current?.querySelectorAll<HTMLImageElement>('img:not([loading="lazy"])') ?? []);
    const timeout = window.setTimeout(() => { if (active) window.dispatchEvent(new Event('shush:ready')); }, 2500);
    Promise.allSettled(images.map(image => image.decode())).then(() => {
      if (active) { clearTimeout(timeout); window.dispatchEvent(new Event('shush:ready')); }
    });
    return () => { active = false; clearTimeout(timeout); };
  }, []);

  useEffect(() => {
    const remember = () => { scrollPositions.set(key, window.scrollY); };
    window.addEventListener('scroll', remember, { passive: true });
    return () => window.removeEventListener('scroll', remember);
  }, [key]);

  // This effect runs after Suspense commits the loaded page, including on a
  // slow first visit. Anchors and keyboard focus cannot race the route import.
  useEffect(() => {
    const path = pathname + hash;
    const samePage = previousPath.current === path;
    // Query changes (player, jersey) preserve both focus and position.
    if (samePage) return;
    const frame = window.requestAnimationFrame(() => {
      previousPath.current = path;
      const restored = navigationType === 'POP' ? scrollPositions.get(key) : undefined;
      if (restored !== undefined) {
        window.scrollTo({ top: restored, left: 0, behavior: 'instant' });
        document.getElementById('main-content')?.focus({ preventScroll: true });
        return;
      }
      const isInitialCommit = firstNavigation.current && !hasCommitted.current;
      hasCommitted.current = true;
      // A slow initial route must not steal focus from a visitor who has
      // already opened/closed the header menu. Subsequent SPA routes still
      // move focus to their content after the lazy page commits.
      if (isInitialCommit && document.activeElement !== document.body &&
          document.activeElement !== document.getElementById('main-content')) return;
      let anchor = hash.slice(1);
      try {
        anchor = decodeURIComponent(anchor);
      } catch {
        // A malformed URL fragment should never break navigation.
      }
      const target = anchor ? document.getElementById(anchor) : null;
      if (target) {
        target.scrollIntoView({ behavior: 'instant', block: 'start' });
        if (!target.hasAttribute('tabindex')) target.tabIndex = -1;
        target.focus({ preventScroll: true });
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        document.getElementById('main-content')?.focus({ preventScroll: true });
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, [pathname, hash, key, navigationType]);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (media.matches || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) if (entry.isIntersecting) {
        entry.target.classList.add('reveal-arrive');
        observer.unobserve(entry.target);
      }
    }, { threshold: .12 });
    frameRef.current?.querySelectorAll('.section-heading, .home-records, .home-people, .home-closing, .verified-match, .creator-feature, .about-chapters article').forEach(element => observer.observe(element));
    const stop = () => { if (media.matches) observer.disconnect(); };
    media.addEventListener('change', stop);
    return () => { observer.disconnect(); media.removeEventListener('change', stop); };
  }, [pathname]);

  return <div ref={frameRef} key={pathname} className="route-frame route-enter">{children}</div>;
}
