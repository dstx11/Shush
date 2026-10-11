import { useEffect, useRef, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

type PageTransitionProps = {
  children: ReactNode;
  initialNavigation: boolean;
};

export function PageTransition({ children, initialNavigation }: PageTransitionProps) {
  const { pathname, hash } = useLocation();
  const firstNavigation = useRef(initialNavigation);
  const frameRef = useRef<HTMLDivElement>(null);
  const hasCommitted = useRef(false);

  // This effect runs after Suspense commits the loaded page, including on a
  // slow first visit. Anchors and keyboard focus cannot race the route import.
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
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
  }, [pathname, hash]);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (media.matches || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) if (entry.isIntersecting) {
        entry.target.classList.add('reveal-arrive');
        observer.unobserve(entry.target);
      }
    }, { threshold: .12 });
    frameRef.current?.querySelectorAll('.section-heading, .home-player, .home-channel, .home-story, .verified-match, .creator-feature, .about-chapters article, .about-people a, .home-drop-inline').forEach(element => observer.observe(element));
    const stop = () => { if (media.matches) observer.disconnect(); };
    media.addEventListener('change', stop);
    return () => { observer.disconnect(); media.removeEventListener('change', stop); };
  }, [pathname]);

  return <div ref={frameRef} key={pathname} className="route-frame route-enter">{children}</div>;
}
