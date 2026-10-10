import { useEffect, useRef, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

type PageTransitionProps = {
  children: ReactNode;
  initialNavigation: boolean;
};

export function PageTransition({ children, initialNavigation }: PageTransitionProps) {
  const { pathname, hash } = useLocation();
  const firstNavigation = useRef(initialNavigation);
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

  return <div key={pathname} className="route-frame route-enter">{children}</div>;
}
