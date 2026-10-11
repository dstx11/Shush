import { useEffect, useRef, useState } from 'react';
import { players } from '../../data/players';
import { AppLink } from '../ui/AppLink';

export function HomePlayerRail() {
  const rail = useRef<HTMLDivElement>(null);
  const [range, setRange] = useState({ first: 1, last: players.length, previous: false, next: false });

  useEffect(() => {
    const element = rail.current;
    if (!element) return;
    let frame = 0;
    const measure = () => {
      const bounds = element.getBoundingClientRect();
      const visible = Array.from(element.children).flatMap((child, index) => {
        const card = child.getBoundingClientRect();
        return card.right > bounds.left + 6 && card.left < bounds.right - 6 ? [index + 1] : [];
      });
      const next = {
        first: visible[0] ?? 1,
        last: visible[visible.length - 1] ?? players.length,
        previous: element.scrollLeft > 2,
        next: element.scrollLeft + element.clientWidth < element.scrollWidth - 2,
      };
      setRange((current) => Object.keys(next).every((key) => current[key as keyof typeof next] === next[key as keyof typeof next]) ? current : next);
    };
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(measure); };
    const observer = new ResizeObserver(schedule);
    observer.observe(element);
    element.addEventListener('scroll', schedule, { passive: true });
    measure();
    return () => { observer.disconnect(); element.removeEventListener('scroll', schedule); cancelAnimationFrame(frame); };
  }, []);

  const move = (direction: -1 | 1) => {
    const element = rail.current;
    if (!element) return;
    const step = Math.max(1, range.last - range.first);
    const target = element.children[Math.max(0, Math.min(players.length - 1, range.first - 1 + direction * step))];
    const left = element.scrollLeft + target.getBoundingClientRect().left - element.getBoundingClientRect().left - 6;
    element.scrollTo({ left, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  };

  return <>
    <div ref={rail} id="home-player-rail" className="home-player-rail" aria-label="Jogadores SHUSH">
      {players.map((player) => <AppLink key={player.id} href={`/esports/valorant/roster?player=${player.id}`} className="home-player" aria-label={`Conhecer ${player.displayName}`}>
        <div className="home-player-image">
          {player.avatar ? <img src={player.avatar} alt="" width="768" height="768" loading="lazy" decoding="async" /> : <span className="initial-art" aria-hidden="true">{player.initials}</span>}
          <span className="home-player-number" aria-hidden="true">{player.number}</span>
          <span className="home-player-open" aria-hidden="true">Ver perfil ↗</span>
        </div>
        <span className="home-player-name">{player.displayName}<span aria-hidden="true">↗</span></span>
        <small>{player.roles[0]}</small>
      </AppLink>)}
    </div>
    <div className="home-roster-footer">
      {range.previous || range.next ? <div className="roster-rail-controls" role="group" aria-label="Navegar pelos jogadores">
        <span className="mono" aria-label={`Jogadores visíveis: ${range.first} a ${range.last} de ${players.length}`}>{range.first}–{range.last} / {players.length}</span>
        <button type="button" aria-label="Ver jogadores anteriores" aria-controls="home-player-rail" disabled={!range.previous} onClick={() => move(-1)}>←</button>
        <button type="button" aria-label="Ver mais jogadores" aria-controls="home-player-rail" disabled={!range.next} onClick={() => move(1)}>→</button>
      </div> : null}
    </div>
  </>;
}
