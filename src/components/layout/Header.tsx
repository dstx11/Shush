import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronDown, Menu, X } from 'lucide-react';
import { navGroups, type NavGroup } from '../../data/nav';
import { activePremierSeason } from '../../data/season';
import { motionPresets } from '../../lib/motion';
import { calculatePublicMatchDayState } from '../../lib/premier';
import { StatusBadge } from '../motion/MotionPrimitives';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [mobileOpenGroup, setMobileOpenGroup] = useState<string | null>(null);
  const [activePath, setActivePath] = useState(() => (typeof window === 'undefined' ? '/' : normalizePath(window.location.pathname)));
  const [isScrolled, setIsScrolled] = useState(false);
  const reduceMotion = useReducedMotion();
  const navRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const publicState = calculatePublicMatchDayState(activePremierSeason);
  const statusMeta = 'week' in publicState ? publicState.week.map ?? 'Mapa por definir' : publicState.detail;

  useEffect(() => {
    const onRouteChange = () => {
      setActivePath(normalizePath(window.location.pathname));
      setOpenGroup(null);
      setMobileOpenGroup(null);
      setIsOpen(false);
    };

    window.addEventListener('popstate', onRouteChange);
    return () => window.removeEventListener('popstate', onRouteChange);
  }, []);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!isOpen && !openGroup) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setOpenGroup(null);
      setMobileOpenGroup(null);
      setIsOpen(false);
      menuButtonRef.current?.focus();
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !navRef.current?.contains(event.target)) {
        setOpenGroup(null);
        setMobileOpenGroup(null);
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [isOpen, openGroup]);

  const closeMenus = () => {
    setOpenGroup(null);
    setMobileOpenGroup(null);
    setIsOpen(false);
  };

  const isGroupActive = (group: NavGroup) => activePath === normalizePath(group.href) || (group.href !== '/' && activePath.startsWith(`${normalizePath(group.href)}/`));
  const isSubItemActive = (href: string) => activePath === normalizePath(href);

  return (
    <motion.header
      className={`fixed left-0 right-0 top-0 z-50 px-4 py-3 ${isScrolled ? 'is-scrolled' : ''}`}
      initial={reduceMotion ? false : { opacity: 0, y: -14 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={reduceMotion ? undefined : { duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <nav ref={navRef} className="site-nav relative mx-auto flex max-w-7xl items-center justify-between" aria-label="Navegação principal">
        <a href="/" className="brand-mark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-shush-purpleGlow">
          <img src="/assets/brand/shush-logo.webp" alt="SHS" width="1167" height="647" className="h-8 w-auto" />
          <span>SHUSH</span>
        </a>

        <div className="primary-nav hidden md:flex md:items-center md:gap-1" id="primary-navigation">
          {navGroups.map((group) =>
            group.items ? (
              <div
                key={group.id}
                className="nav-group"
                onMouseEnter={() => setOpenGroup(group.id)}
                onMouseLeave={(event) => {
                  if (!event.currentTarget.contains(document.activeElement)) setOpenGroup(null);
                }}
                onBlur={(event) => {
                  const nextTarget = event.relatedTarget;
                  if (!(nextTarget instanceof Node) || !event.currentTarget.contains(nextTarget)) setOpenGroup(null);
                }}
              >
                <button
                  type="button"
                  className={`nav-trigger ${isGroupActive(group) ? 'is-active' : ''}`}
                  aria-current={isGroupActive(group) ? 'page' : undefined}
                  aria-expanded={openGroup === group.id}
                  aria-controls={`nav-panel-${group.id}`}
                  onFocus={() => setOpenGroup(group.id)}
                  onClick={() => setOpenGroup((value) => (value === group.id ? null : group.id))}
                >
                  {group.label}
                  <ChevronDown aria-hidden="true" className="h-3.5 w-3.5" />
                </button>

                <AnimatePresence>
                  {openGroup === group.id ? (
                    <motion.div
                      id={`nav-panel-${group.id}`}
                      className="nav-dropdown"
                      role="region"
                      aria-label={`${group.label} navigation`}
                      variants={reduceMotion ? undefined : motionPresets.dropdown}
                      initial={reduceMotion ? false : 'hidden'}
                      animate={reduceMotion ? undefined : 'visible'}
                      exit={reduceMotion ? undefined : 'exit'}
                    >
                      <div className="nav-dropdown-heading">
                        <span>{group.label}</span>
                        <small>{group.id === 'esports' ? statusMeta : 'SHUSH area'}</small>
                      </div>
                      <motion.div className="nav-dropdown-grid" variants={reduceMotion ? undefined : motionPresets.staggerParent} initial={reduceMotion ? false : 'hidden'} animate={reduceMotion ? undefined : 'visible'}>
                        {group.items.map((item) => (
                          <motion.a
                            key={item.href}
                            href={item.href}
                            variants={reduceMotion ? undefined : motionPresets.staggerItem}
                            className={`nav-sub-link ${isSubItemActive(item.href) ? 'is-active' : ''}`}
                            aria-current={isSubItemActive(item.href) ? 'page' : undefined}
                            onClick={closeMenus}
                          >
                            <span>{item.label}</span>
                            <small>{item.description}</small>
                          </motion.a>
                        ))}
                      </motion.div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            ) : (
              <a key={group.href} href={group.href} aria-current={isGroupActive(group) ? 'page' : undefined} className={`nav-link ${isGroupActive(group) ? 'is-active' : ''}`}>
                {group.label}
              </a>
            ),
          )}
        </div>

        <a href="/esports/valorant/premier" className="header-status hidden xl:grid" aria-label="Estado Premier">
          <StatusBadge pulse>Premier</StatusBadge>
          <strong>{statusMeta}</strong>
        </a>

        <a href="/products/jersey" className="header-cta hidden md:inline-flex">
          Jersey
        </a>

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
              id="mobile-navigation"
              className="mobile-nav-panel absolute left-0 right-0 top-[calc(100%+.75rem)] translate-y-0 p-3 opacity-100 transition md:hidden"
              variants={reduceMotion ? undefined : motionPresets.dropdown}
              initial={reduceMotion ? false : 'hidden'}
              animate={reduceMotion ? undefined : 'visible'}
              exit={reduceMotion ? undefined : 'exit'}
            >
              <div className="grid gap-2">
                {navGroups.map((group) =>
                  group.items ? (
                    <div key={group.id} className="mobile-nav-group">
                      <button
                        type="button"
                        className={`mobile-nav-trigger ${isGroupActive(group) ? 'is-active' : ''}`}
                        aria-current={isGroupActive(group) ? 'page' : undefined}
                        aria-expanded={mobileOpenGroup === group.id}
                        aria-controls={`mobile-panel-${group.id}`}
                        onClick={() => setMobileOpenGroup((value) => (value === group.id ? null : group.id))}
                      >
                        <span>{group.label}</span>
                        <ChevronDown aria-hidden="true" className="h-4 w-4" />
                      </button>
                      <AnimatePresence initial={false}>
                        {mobileOpenGroup === group.id ? (
                          <motion.div
                            id={`mobile-panel-${group.id}`}
                            className="mobile-nav-subgrid"
                            variants={reduceMotion ? undefined : motionPresets.mobileDisclosure}
                            initial={reduceMotion ? false : 'hidden'}
                            animate={reduceMotion ? undefined : 'visible'}
                            exit={reduceMotion ? undefined : 'exit'}
                          >
                            {group.items.map((item) => (
                              <a key={item.href} href={item.href} aria-current={isSubItemActive(item.href) ? 'page' : undefined} onClick={closeMenus} className="mobile-nav-link">
                                <span>{item.label}</span>
                                <small>{item.description}</small>
                              </a>
                            ))}
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <a key={group.href} href={group.href} aria-current={isGroupActive(group) ? 'page' : undefined} onClick={closeMenus} className={`mobile-nav-link ${isGroupActive(group) ? 'is-active' : ''}`}>
                      <span>{group.label}</span>
                      <small>Entrada principal.</small>
                    </a>
                  ),
                )}
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
