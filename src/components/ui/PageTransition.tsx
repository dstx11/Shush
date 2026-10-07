import { useEffect, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

type PageTransitionProps = {
  children: ReactNode;
};

export function PageTransition({ children }: PageTransitionProps) {
  const { pathname, hash } = useLocation();

  // This effect runs after Suspense commits the loaded page, including on a
  // slow first visit. Anchors and keyboard focus cannot race the route import.
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
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

  return <div className="route-frame route-enter">{children}</div>;
}
