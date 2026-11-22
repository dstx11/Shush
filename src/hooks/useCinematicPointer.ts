import { useCallback, useEffect, useRef, type PointerEvent } from 'react';
import { useQuietMotion } from './useQuietMotion';

export function useCinematicPointer<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const frame = useRef(0);
  const point = useRef({ x: 0, y: 0 });
  const quiet = useQuietMotion();

  const clear = useCallback(() => {
    cancelAnimationFrame(frame.current);
    frame.current = 0;
    ref.current?.style.removeProperty('--lens-x');
    ref.current?.style.removeProperty('--lens-y');
  }, []);

  const onPointerMove = useCallback((event: PointerEvent<T>) => {
    if (quiet || event.pointerType !== 'mouse') return;
    point.current.x = event.clientX;
    point.current.y = event.clientY;
    if (frame.current) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      const node = ref.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const offset = (p: number, start: number, size: number) => Math.max(-1, Math.min(1, (p - start) / size * 2 - 1));
      node.style.setProperty('--lens-x', (offset(point.current.x, rect.left, rect.width) * 15).toFixed(1) + 'px');
      node.style.setProperty('--lens-y', (offset(point.current.y, rect.top, rect.height) * 12).toFixed(1) + 'px');
    });
  }, [quiet]);

  useEffect(() => {
    if (quiet) { clear(); return; }
    const hide = () => { if (document.hidden) clear(); };
    document.addEventListener('visibilitychange', hide);
    return () => { clear(); document.removeEventListener('visibilitychange', hide); };
  }, [quiet, clear]);

  return { ref, onPointerMove, onPointerLeave: clear };
}
