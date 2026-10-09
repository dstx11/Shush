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
    const background = [document.getElementById('main-content'), document.querySelector('footer')];
    const inertStates = background.map((element) => element?.inert ?? false);
    background.forEach((element) => { if (element) element.inert = true; });
    // The panel has committed: focus it now so a queued frame cannot override
    // a visitor who has already started tabbing through the open menu.
    mobilePanelRef.current?.querySelector<HTMLAnchorElement>('a')?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        const links = Array.from(mobilePanelRef.current?.querySelectorAll<HTMLAnchorElement>('a') ?? []);
        const controls = [menuButtonRef.current, ...links].filter((element): element is HTMLButtonElement | HTMLAnchorElement => Boolean(element));
        const index = controls.indexOf(document.activeElement as HTMLButtonElement | HTMLAnchorElement);
        if (event.shiftKey && index <= 0) { event.preventDefault(); controls[controls.length - 1]?.focus(); }
        else if (!event.shiftKey && (index === controls.length - 1 || index === -1)) { event.preventDefault(); controls[0]?.focus(); }
      }
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
      background.forEach((element, index) => { if (element) element.inert = inertStates[index]; });
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
    <header className={`site-header shush-header ${isScrolled ? 'is-scrolled' : ''} ${isOpen ? 'menu-open' : ''}`}>
      <nav ref={navRef} className="shush-navigation shell" aria-label="Navegação principal"
        onBlur={(event) => {
          if (isOpen && !event.currentTarget.contains(event.relatedTarget)) setIsOpen(false);
        }}>
        <AppLink href="/" className="brand-mark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-shush-purpleGlow">
          <img src="/assets/brand/shush-logo.webp" alt="" width="1167" height="647" className="h-8 w-auto" />
          <span>SHUSH</span>
        </AppLink>

        <div className="desktop-navigation" id="primary-navigation">
          {navItems.map((item) => (
            <AppLink
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? 'page' : undefined}
              className="desktop-nav-link"
            >
              {item.label}
            </AppLink>
          ))}
        </div>

        <AppLink href="/esports/valorant/premier" className="competition-signal" aria-label={`Premier: ${publicState.title}`}>
          <StatusBadge pulse={publicState.kind === 'match_day_live' || publicState.kind === 'playoffs_live'}>Premier</StatusBadge>
          <strong>{publicState.title}</strong>
        </AppLink>

        <button
          ref={menuButtonRef}
          className="navigation-toggle"
          type="button"
          aria-label={isOpen ? 'Fechar navegação' : 'Abrir navegação'}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsOpen((value) => !value)}
        >
          <span aria-hidden="true">{isOpen ? 'Fechar' : 'Menu'}</span><span aria-hidden="true" className="menu-glyph">{isOpen ? '×' : '+'}</span>
        </button>

        {isOpen ? (
          <div
            ref={mobilePanelRef}
            id="mobile-navigation"
            className="navigation-overlay mobile-panel-enter"
          >
            <div className="overlay-links">
              {navItems.map((item, index) => (
                <AppLink
                  key={item.href}
                  href={item.href}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  onClick={() => {
                    setIsOpen(false);
                    document.getElementById('main-content')?.focus({ preventScroll: true });
                  }}
                  className="overlay-link"
                >
                  <span className="mono" aria-hidden="true">0{index + 1}</span><span>{item.label}</span><span aria-hidden="true">↗</span>
                </AppLink>
              ))}
            </div>
            <div className="overlay-foot"><span>Sem barulho. Só rounds.</span><small>SHUSH / Gaming + Creators</small></div>
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
