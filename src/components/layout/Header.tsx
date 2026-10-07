import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { navItems } from '../../data/nav';
import { activePremierSeason } from '../../data/season';
import { motionPresets } from '../../lib/motion';
import { calculatePublicMatchDayState } from '../../lib/premier';
import { StatusBadge } from '../motion/MotionPrimitives';
import { AppLink } from '../ui/AppLink';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const activePath = normalizePath(location.pathname);
  const reduceMotion = useReducedMotion();
  const navRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobilePanelRef = useRef<HTMLDivElement>(null);
  const publicState = calculatePublicMatchDayState(activePremierSeason);

  useEffect(() => {
    setIsOpen(false);
  }, [activePath]);

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
    <motion.header
      className={`fixed left-0 right-0 top-0 z-50 px-4 py-3 ${isScrolled ? 'is-scrolled' : ''}`}
      initial={reduceMotion ? false : { opacity: 0, y: -12 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={reduceMotion ? undefined : { duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
    >
      <nav ref={navRef} className="site-nav relative mx-auto flex max-w-7xl items-center justify-between" aria-label="Navegação principal">
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
          {isOpen ? <X aria-hidden="true" className="h-5 w-5" /> : <Menu aria-hidden="true" className="h-5 w-5" />}
        </button>

        <AnimatePresence>
          {isOpen ? (
            <motion.div
              ref={mobilePanelRef}
              id="mobile-navigation"
              className="mobile-nav-panel absolute left-0 right-0 top-[calc(100%+.65rem)] p-2 md:hidden"
              variants={reduceMotion ? undefined : motionPresets.dropdown}
              initial={reduceMotion ? false : 'hidden'}
              animate={reduceMotion ? undefined : 'visible'}
              exit={reduceMotion ? undefined : 'exit'}
            >
              <div className="grid gap-1">
                {navItems.map((item) => (
                  <AppLink
                    key={item.href}
                    href={item.href}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                    onClick={() => setIsOpen(false)}
                    className={`mobile-nav-link ${isActive(item.href) ? 'is-active' : ''}`}
                  >
                    <span>{item.label}</span>
                  </AppLink>
                ))}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
}

function normalizePath(pathname: string) {
  if (!pathname || pathname === '/index.html') return '/';
  return pathname.endsWith('/') && pathname !== '/' ? pathname.slice(0, -1) : pathname;
}
