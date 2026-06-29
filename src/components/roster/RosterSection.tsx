import { useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { players } from '../../data/players';
import { motionPresets } from '../../lib/motion';
import { MotionRail, PlayerLockIndicator, SnakeLine } from '../motion/MotionPrimitives';
import { PlayerCard } from './PlayerCard';

const allFilter = 'Todos';

export function RosterSection() {
  const [activeFilter, setActiveFilter] = useState(allFilter);
  const [selectedName, setSelectedName] = useState(players[0]?.displayName ?? '');
  const reduceMotion = useReducedMotion();

  const filters = useMemo(() => {
    const roles = Array.from(new Set(players.flatMap((player) => player.roles)));
    return [allFilter, ...roles];
  }, []);

  const filteredPlayers = useMemo(() => {
    if (activeFilter === allFilter) return players;
    return players.filter((player) => player.roles.includes(activeFilter));
  }, [activeFilter]);

  const selectedPlayer = players.find((player) => player.displayName === selectedName) ?? filteredPlayers[0] ?? players[0];

  const setFilter = (filter: string) => {
    setActiveFilter(filter);
    const nextPlayer = filter === allFilter ? players[0] : players.find((player) => player.roles.includes(filter));
    if (nextPlayer) setSelectedName(nextPlayer.displayName);
  };

  return (
    <section id="roster" className="roster-section relative scroll-mt-24 overflow-hidden px-5 py-28">
      <div className="role-lane-stack" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="mx-auto grid max-w-7xl gap-8 xl:grid-cols-[1.05fr_.95fr]">
        <div>
          <div className="mb-7 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="section-kicker">Roster</span>
              <h2 className="mt-3 max-w-4xl text-3xl font-extrabold leading-tight tracking-normal text-shush-text md:text-5xl">
                Quem entra no lobby connosco.
              </h2>
              <MotionRail className="roster-title-rail" />
            </div>
            <p className="max-w-sm text-sm leading-7 text-shush-muted">Roles claras, presença própria e leitura rápida.</p>
          </div>

          <div className="filter-rack mb-8" role="group" aria-label="Filtros do roster">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                aria-pressed={activeFilter === filter}
                onClick={() => setFilter(filter)}
                className={`filter-chip ${activeFilter === filter ? 'is-active' : ''}`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="roster-grid">
            {filteredPlayers.map((player, index) => (
              <motion.div
                key={player.id}
                variants={reduceMotion ? undefined : motionPresets.staggerItem}
                initial={reduceMotion ? false : 'hidden'}
                whileInView={reduceMotion ? undefined : 'visible'}
                viewport={{ once: true, margin: '-12%' }}
                transition={reduceMotion ? undefined : { delay: index * 0.055 }}
              >
                <PlayerCard player={player} isSelected={selectedPlayer.displayName === player.displayName} onSelect={() => setSelectedName(player.displayName)} />
              </motion.div>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.article
            key={selectedPlayer.id}
            className="roster-spotlight"
            initial={reduceMotion ? false : motionPresets.rosterSwap.initial}
            animate={reduceMotion ? undefined : motionPresets.rosterSwap.animate}
            exit={reduceMotion ? undefined : motionPresets.rosterSwap.exit}
          >
            <SnakeLine className="spotlight-snake" />
            <div className="spotlight-media">
              <span className="spotlight-sweep" aria-hidden="true" />
              {selectedPlayer.avatar ? (
                <img src={selectedPlayer.avatar} alt={`Avatar de ${selectedPlayer.displayName}`} width="768" height="768" loading="lazy" decoding="async" />
              ) : (
                <div className="avatar-fallback">
                  <span className="avatar-ring" aria-hidden="true" />
                  <span className="relative text-5xl font-extrabold tracking-normal text-white">{selectedPlayer.initials}</span>
                </div>
              )}
            </div>
            <div className="spotlight-copy">
              <span className="section-kicker">Spotlight / {selectedPlayer.number}</span>
              <PlayerLockIndicator />
              <h3>{selectedPlayer.displayName}</h3>
              <p>{selectedPlayer.quote}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {selectedPlayer.status ? <span className="status-badge">{selectedPlayer.status}</span> : null}
                {selectedPlayer.roles.map((role) => (
                  <span key={role} className="role-badge">
                    {role}
                  </span>
                ))}
              </div>
            </div>
          </motion.article>
        </AnimatePresence>
      </div>
    </section>
  );
}
