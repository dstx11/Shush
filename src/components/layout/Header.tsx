import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { navItems } from '../../data/nav';
import { activePremierSeason } from '../../data/season';
import { calculatePublicMatchDayState } from '../../lib/premier';
import { usePremierClock } from '../../lib/use-premier-clock';
import { StatusBadge } from '../ui/VisualPrimitives';
import { AppLink } from '../ui/AppLink';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const activePath = normalizePath(location.pathname);
  const navRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobilePanelRef = useRef<HTMLDivElement>(null);
  const now = usePremierClock();
  const publicState = calculatePublicMatchDayState(activePremierSeason, now);

  useEffect(() => {
    setIsOpen(false);
  }, [activePath]);

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 768px)');
    const closeOnDesktop = () => { if (desktop.matches) setIsOpen(false); };
    desktop.addEventListener('change', closeOnDesktop);
    return () => desktop.removeEventListener('change', closeOnDesktop);
  }, []);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusFrame = window.requestAnimationFrame(() => {
      mobilePanelRef.current?.querySelector<HTMLAnchorElement>('a')?.focus();
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setIsOpen(false);
      menuButtonRef.current?.focus();
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !navRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.cancelAnimationFrame(focusFrame);
      window.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [isOpen]);

  const isActive = (href: string) => {
    const normalized = normalizePath(href);
    if (normalized === '/') return activePath === '/';
    return activePath === normalized || activePath.startsWith(`${normalized}/`);
  };

  return (
    <header className={`site-header fixed left-0 right-0 top-0 z-50 px-4 py-3 ${isScrolled ? 'is-scrolled' : ''}`}>
      <nav ref={navRef} className="site-nav relative mx-auto flex max-w-7xl items-center justify-between" aria-label="Navegação principal"
        onBlur={(event) => {
          if (isOpen && !event.currentTarget.contains(event.relatedTarget)) setIsOpen(false);
        }}>
        <AppLink href="/" className="brand-mark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-shush-purpleGlow">
          <img src="/assets/brand/shush-logo.webp" alt="" width="1167" height="647" className="h-8 w-auto" />
          <span>SHUSH</span>
        </AppLink>

        <div className="primary-nav hidden md:flex md:items-center md:gap-1" id="primary-navigation">
          {navItems.map((item) => (
            <AppLink
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? 'page' : undefined}
              className={`nav-link ${isActive(item.href) ? 'is-active' : ''}`}
            >
              {item.label}
            </AppLink>
          ))}
        </div>

        <AppLink href="/esports/valorant/premier" className="header-status header-status-compact hidden lg:flex" aria-label={`Premier: ${publicState.title}`}>
          <StatusBadge pulse={publicState.kind === 'match_day_live' || publicState.kind === 'playoffs_live'}>Premier</StatusBadge>
          <strong>{publicState.title}</strong>
        </AppLink>

        <button
          ref={menuButtonRef}
          className="mobile-menu-button grid h-11 w-11 place-items-center md:hidden"
          type="button"
          aria-label={isOpen ? 'Fechar navegação' : 'Abrir navegação'}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsOpen((value) => !value)}
        >
          <span aria-hidden="true" className="menu-glyph">{isOpen ? '×' : '☰'}</span>
        </button>

        {isOpen ? (
          <div
            ref={mobilePanelRef}
            id="mobile-navigation"
            className="mobile-nav-panel mobile-panel-enter absolute left-0 right-0 top-[calc(100%+.65rem)] p-2 md:hidden"
          >
            <div className="grid gap-1">
              {navItems.map((item) => (
                <AppLink
                  key={item.href}
                  href={item.href}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  onClick={() => {
                    setIsOpen(false);
                    document.getElementById('main-content')?.focus({ preventScroll: true });
                  }}
                  className={`mobile-nav-link ${isActive(item.href) ? 'is-active' : ''}`}
                >
                  <span>{item.label}</span>
                </AppLink>
              ))}
            </div>
          </div>
        ) : null}
      </nav>
    </header>
  );
}

function normalizePath(pathname: string) {
  if (!pathname || pathname === '/index.html') return '/';
  return pathname.endsWith('/') && pathname !== '/' ? pathname.slice(0, -1) : pathname;
}
