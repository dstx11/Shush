import { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { navItems } from '../../data/nav';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeHash, setActiveHash] = useState(() => (typeof window === 'undefined' ? '#top' : window.location.hash || '#top'));
  const navRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onHashChange = () => setActiveHash(window.location.hash || '#top');
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !navRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 px-4 py-4">
      <nav
        ref={navRef}
        className="relative mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/10 bg-black/55 px-4 py-3 shadow-[0_24px_80px_rgba(0,0,0,.46)] backdrop-blur-md"
        aria-label="Navegação principal"
      >
        <a href="#top" className="flex items-center gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-shush-purpleGlow">
          <img src="/assets/brand/shush-logo.webp" alt="SHS" width="1167" height="647" className="h-8 w-auto" />
          <span className="hidden text-xs font-black uppercase tracking-[0.26em] text-shush-muted sm:inline">SHUSH</span>
        </a>

        <div className="hidden rounded-full border border-white/10 bg-white/[0.035] p-1 md:flex md:items-center md:gap-1" id="primary-navigation">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              aria-current={activeHash === item.href ? 'page' : undefined}
              className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.18em] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-shush-purpleGlow ${
                activeHash === item.href ? 'bg-shush-purple/80 text-white shadow-glow' : 'text-shush-muted hover:bg-white/[0.06] hover:text-shush-text'
              }`}
            >
              {item.label}
            </a>
          ))}
        </div>

        <a
          href="#drop"
          className="hidden rounded-full border border-shush-purpleGlow/35 bg-shush-purple/70 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-white shadow-glow transition hover:bg-shush-purpleGlow md:inline-flex"
        >
          Ver Drop 01
        </a>

        <button
          ref={menuButtonRef}
          className="grid h-11 w-11 place-items-center rounded-full border border-white/12 bg-white/[0.045] text-shush-text md:hidden"
          type="button"
          aria-label={isOpen ? 'Fechar navegação' : 'Abrir navegação'}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsOpen((value) => !value)}
        >
          {isOpen ? <X aria-hidden="true" className="h-5 w-5" /> : <Menu aria-hidden="true" className="h-5 w-5" />}
        </button>

        {isOpen ? (
          <div
            id="mobile-navigation"
            className="absolute left-0 right-0 top-[calc(100%+.75rem)] translate-y-0 rounded-[1.4rem] border border-white/10 bg-black/85 p-3 opacity-100 shadow-[0_24px_80px_rgba(0,0,0,.46)] backdrop-blur-md transition md:hidden"
          >
            <div className="grid gap-2">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  aria-current={activeHash === item.href ? 'page' : undefined}
                  onClick={closeMenu}
                  className={`rounded-2xl px-4 py-4 text-sm font-black uppercase tracking-[0.16em] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-shush-purpleGlow ${
                    activeHash === item.href ? 'bg-shush-purple/75 text-white' : 'bg-white/[0.045] text-shush-muted hover:text-shush-text'
                  }`}
                >
                  {item.label}
                </a>
              ))}
              <a
                href="#drop"
                onClick={closeMenu}
                className="rounded-2xl border border-shush-purpleGlow/35 bg-shush-purple px-4 py-4 text-sm font-black uppercase tracking-[0.16em] text-white shadow-glow"
              >
                Ver Drop 01
              </a>
            </div>
          </div>
        ) : null}
      </nav>
    </header>
  );
}
