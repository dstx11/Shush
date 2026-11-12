import { useEffect, type RefObject } from 'react';

let scrollLocks = 0;
let restoreScroll: (() => void) | undefined;

function lockPageScroll() {
  if (scrollLocks++ === 0) {
    const body = document.body;
    const overflow = body.style.overflow;
    const padding = body.style.paddingRight;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbar > 0) body.style.paddingRight = `${parseFloat(getComputedStyle(body).paddingRight) + scrollbar}px`;
    body.style.overflow = 'hidden';
    restoreScroll = () => { body.style.overflow = overflow; body.style.paddingRight = padding; };
  }
  let released = false;
  return () => {
    if (released) return;
    released = true;
    if (--scrollLocks === 0) { restoreScroll?.(); restoreScroll = undefined; }
  };
}

/** Native focus containment, balanced scroll locking and focus restoration. */
export function useModalDialog(ref: RefObject<HTMLDialogElement | null>, open = true) {
  useEffect(() => {
    const dialog = ref.current;
    if (!open || !dialog) return;
    const origin = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const unlock = lockPageScroll();
    try { if (!dialog.open) dialog.showModal(); }
    catch (error) { unlock(); throw error; }
    return () => {
      dialog.close();
      unlock();
      if (origin?.isConnected) origin.focus({ preventScroll: true });
    };
  }, [ref, open]);
}
