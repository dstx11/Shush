import { useEffect, useState } from 'react';

export function usePremierClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const refresh = () => {
      if (!document.hidden) setNow(new Date());
    };
    const timer = window.setInterval(refresh, 30_000);
    document.addEventListener('visibilitychange', refresh);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, []);

  return now;
}
