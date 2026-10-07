import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { navItems } from '../../data/nav';
import { motionPresets } from '../../lib/motion';
import { AppLink } from './AppLink';

type QuickNavItem = {
  label: string;
  href: string;
  description: string;
};

const MotionAppLink = motion.create(AppLink);

export function QuickNav() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const navigate = useNavigate();

  const items = useMemo<QuickNavItem[]>(
    () =>
      navItems.map((item) => ({
        label: item.label,
        href: item.href,
        description: `Abrir ${item.label}`,
      })),
    [],
  );

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return items.slice(0, 8);
    return items.filter((item) => `${item.label} ${item.description} ${item.href}`.toLowerCase().includes(needle)).slice(0, 8);
  }, [items, query]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const isQuickNav = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k';
      if (!isQuickNav) return;
      event.preventDefault();
      setOpen(true);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (!open) return;

    inputRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !panelRef.current?.contains(event.target)) setOpen(false);
    };

    window.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const close = () => {
    setOpen(false);
    setQuery('');
  };

  const goTo = (href: string) => {
    navigate(href);
    close();
  };

  const onInputKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((value) => Math.min(value + 1, Math.max(filtered.length - 1, 0)));
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((value) => Math.max(value - 1, 0));
    }

    if (event.key === 'Enter' && filtered[activeIndex]) {
      event.preventDefault();
      goTo(filtered[activeIndex].href);
    }
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div className="quick-nav-backdrop" initial={reduceMotion ? false : { opacity: 0 }} animate={reduceMotion ? undefined : { opacity: 1 }} exit={reduceMotion ? undefined : { opacity: 0 }}>
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="quick-nav-title"
            className="quick-nav-panel"
            variants={reduceMotion ? undefined : motionPresets.dropdown}
            initial={reduceMotion ? false : 'hidden'}
            animate={reduceMotion ? undefined : 'visible'}
            exit={reduceMotion ? undefined : 'exit'}
          >
            <div className="quick-nav-head">
              <Search aria-hidden="true" className="h-4 w-4" />
              <label className="sr-only" htmlFor="quick-nav-search">
                Procurar página
              </label>
              <input ref={inputRef} id="quick-nav-search" value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={onInputKeyDown} placeholder="Premier, roster, jersey..." />
              <button type="button" aria-label="Fechar pesquisa rápida" onClick={close}>
                <X aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>
            <h2 id="quick-nav-title" className="sr-only">
              Pesquisa rápida
            </h2>
            <motion.div className="quick-nav-results" variants={reduceMotion ? undefined : motionPresets.staggerParent} initial={reduceMotion ? false : 'hidden'} animate={reduceMotion ? undefined : 'visible'}>
              {filtered.map((item, index) => (
                <MotionAppLink
                  key={`${item.href}-${item.label}`}
                  href={item.href}
                  className={index === activeIndex ? 'is-active' : ''}
                  variants={reduceMotion ? undefined : motionPresets.dropdownItem}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={close}
                >
                  <span>{item.label}</span>
                  <small>{item.description}</small>
                </MotionAppLink>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
