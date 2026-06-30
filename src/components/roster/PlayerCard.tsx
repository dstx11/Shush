import { motion, useReducedMotion } from 'motion/react';
import type { Player } from '../../data/players';
import { hoverMotion, motionPresets } from '../../lib/motion';

type PlayerCardProps = {
  player: Player;
  isSelected?: boolean;
  onSelect?: () => void;
};

export function PlayerCard({ player, isSelected = false, onSelect }: PlayerCardProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.button
      type="button"
      className={`player-card text-left ${isSelected ? 'is-selected' : ''}`}
      onClick={onSelect}
      aria-pressed={isSelected}
      variants={reduceMotion ? undefined : motionPresets.playerCard}
      initial="rest"
      whileHover={reduceMotion ? undefined : hoverMotion.card}
      whileTap={reduceMotion ? undefined : hoverMotion.tap}
    >
      <span className="player-card-image">
        {player.avatar ? (
          <img src={player.avatar} alt={`Avatar de ${player.displayName}`} width="768" height="768" loading="lazy" decoding="async" />
        ) : (
          <span className="avatar-fallback">
            <span className="avatar-ring" aria-hidden="true" />
            <span className="relative text-4xl font-extrabold tracking-normal text-white">{player.initials}</span>
          </span>
        )}
        {player.status ? <span className="status-badge absolute left-4 top-4">{player.status}</span> : null}
      </span>
      <span className="mt-4 flex items-start justify-between gap-4">
        <span>
          <span className="block text-lg font-extrabold tracking-normal text-shush-text">{player.displayName}</span>
          <span className="mt-1.5 block text-xs font-extrabold uppercase tracking-[0.12em] text-shush-muted">{player.focus}</span>
        </span>
        <span className="text-sm font-black text-shush-purpleGlow">{player.number}</span>
      </span>
      <span className="mt-4 flex flex-wrap gap-2">
        {player.roles.map((role) => (
          <span key={role} className="role-badge">
            {role}
          </span>
        ))}
      </span>
    </motion.button>
  );
}
