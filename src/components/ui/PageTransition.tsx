import { useEffect, useLayoutEffect, useRef, type ReactNode } from 'react';
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
  const restoringKey = useRef<string | null>(null);
  const departingKey = useRef<string | null>(null);

  useEffect(() => {
    let active = true;
    const images = Array.from(frameRef.current?.querySelectorAll<HTMLImageElement>('img:not([loading="lazy"])') ?? []);
    const timeout = window.setTimeout(() => { if (active) window.dispatchEvent(new Event('shush:ready')); }, 2500);
    Promise.allSettled(images.map(image => image.decode())).then(() => {
      if (active) { clearTimeout(timeout); window.dispatchEvent(new Event('shush:ready')); }
    });
    return () => { active = false; clearTimeout(timeout); };
  }, []);

  // Capture scroll before React replaces the outgoing route's DOM. Otherwise
  // WebKit may clamp the viewport while the old passive scroll listener is
  // still attached and overwrite the original position with a false value.
  useLayoutEffect(() => {
    if (departingKey.current === key) departingKey.current = null;
    if (navigationType === 'POP' && scrollPositions.has(key)) restoringKey.current = key;
    return () => {
      if (restoringKey.current !== key) {
        scrollPositions.delete(key);
        scrollPositions.set(key, window.scrollY);
      }
      departingKey.current = key;
    };
  }, [key]);

  useEffect(() => {
    const remember = () => {
      // History entries can be replaced repeatedly while editing shared URLs.
      // A POP can trigger a transient scroll event before the restoration frame.
      // Never overwrite the saved entry with that temporary layout position.
      if (previousPath.current !== pathname + hash || restoringKey.current === key || departingKey.current === key) return;
      scrollPositions.delete(key);
      scrollPositions.set(key, window.scrollY);
      if (scrollPositions.size > 64) scrollPositions.delete(scrollPositions.keys().next().value!);
    };
    window.addEventListener('scroll', remember, { passive: true });
    return () => window.removeEventListener('scroll', remember);
  }, [key, pathname, hash]);

  // This effect runs after Suspense commits the loaded page, including on a
  // slow first visit. Anchors and keyboard focus cannot race the route import.
  useEffect(() => {
    const path = pathname + hash;
    const samePage = previousPath.current === path;
    // Query changes (player, jersey) preserve both focus and position.
    if (samePage) return;
    const restoreTimers: number[] = [];
    let stopRestoring = () => {};
    const frame = window.requestAnimationFrame(() => {
      previousPath.current = path;
      // A visitor can start editing before this deferred navigation frame.
      // Preserve that interaction rather than moving focus away mid-keystroke.
      const focused = document.activeElement;
      if (focused && frameRef.current?.contains(focused) &&
          focused.matches('input, textarea, select, button, [contenteditable="true"]')) return;
      const restored = navigationType === 'POP' ? scrollPositions.get(key) : undefined;
      if (restored !== undefined) {
        // WebKit can commit the route before its lazy CSS has completed. The
        // first scroll is then clamped to a short interim document. Retry a
        // handful of times after layout/paint rather than losing the position.
        restoringKey.current = key;
        let active = true;
        const settle = () => {
          if (active && window.location.pathname === pathname && window.location.hash === hash) {
            window.scrollTo({ top: restored, left: 0, behavior: 'instant' });
          }
        };
        const interrupt = () => {
          active = false;
          if (restoringKey.current === key) restoringKey.current = null;
          for (const timer of restoreTimers) window.clearTimeout(timer);
          for (const type of ['wheel', 'touchstart', 'pointerdown', 'keydown']) {
            window.removeEventListener(type, interrupt);
          }
        };
        stopRestoring = interrupt;
        for (const type of ['wheel', 'touchstart', 'pointerdown', 'keydown']) {
          window.addEventListener(type, interrupt, { passive: true });
        }
        settle();
        for (const milliseconds of [100, 300, 750]) {
          restoreTimers.push(window.setTimeout(settle, milliseconds));
        }
        restoreTimers.push(window.setTimeout(interrupt, 1000));
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
    return () => { window.cancelAnimationFrame(frame); stopRestoring(); };
  }, [pathname, hash, key, navigationType]);

  useEffect(() => {
    const frame = frameRef.current;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!frame || !('IntersectionObserver' in window) || media.matches ||
        document.documentElement.dataset.motion === 'reduce') return;
    const items = frame.querySelectorAll<HTMLElement>(
      '.motion-section, .section-index, .home-records, .home-people, .home-closing, .verified-match, .creator-feature, .about-chapters article, .about-origin-story, .drop-layout, .signal-panel'
    );
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('motion-visible');
        observer.unobserve(entry.target);
      }
    }, { threshold: .08, rootMargin: '0px 0px -24px 0px' });
    items.forEach((element, index) => {
      element.classList.add('motion-in');
      element.style.setProperty('--motion-delay', `${Math.min(index % 4, 3) * 65}ms`);
      observer.observe(element);
    });
    const stop = () => {
      if (!media.matches && document.documentElement.dataset.motion !== 'reduce') return;
      observer.disconnect();
      items.forEach(element => { element.classList.remove('motion-in'); element.classList.add('motion-visible'); });
    };
    media.addEventListener('change', stop);
    document.addEventListener('shush:reduce-motion', stop);
    return () => {
      observer.disconnect();
      media.removeEventListener('change', stop);
      document.removeEventListener('shush:reduce-motion', stop);
      items.forEach(element => element.classList.remove('motion-in'));
    };
  }, [pathname]);

  return <div ref={frameRef} key={pathname} className="route-frame route-enter">{children}</div>;
}
