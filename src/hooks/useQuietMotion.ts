import { useSyncExternalStore } from 'react';

const key = 'shush:quiet-motion';
const change = 'shush:quiet-motion-change';

function readChoice() {
  try { return window.localStorage.getItem(key) === '1'; }
  catch { return false; }
}

let quiet = typeof window !== 'undefined' && readChoice();
export const isQuietMotion = () => quiet;

export function chooseQuietMotion(next: boolean) {
  quiet = next;
  try {
    if (next) localStorage.setItem(key, '1');
    else localStorage.removeItem(key);
  } catch { /* The preference still applies in this tab. */ }
  window.dispatchEvent(new Event(change));
}

function subscribe(notify: () => void) {
  const sync = (event: StorageEvent) => {
    if (event.storageArea !== localStorage || (event.key !== key && event.key !== null)) return;
    quiet = readChoice();
    notify();
  };
  window.addEventListener(change, notify);
  window.addEventListener('storage', sync);
  return () => {
    window.removeEventListener(change, notify);
    window.removeEventListener('storage', sync);
  };
}

export const useQuietMotion = () => useSyncExternalStore(subscribe, isQuietMotion, () => false);
