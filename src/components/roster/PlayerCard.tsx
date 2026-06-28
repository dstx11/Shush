import type { Player } from '../../data/roster';

type PlayerCardProps = {
  player: Player;
  isSelected?: boolean;
  onSelect?: () => void;
};

export function PlayerCard({ player, isSelected = false, onSelect }: PlayerCardProps) {
  return (
    <button type="button" className={`player-card text-left ${isSelected ? 'is-selected' : ''}`} onClick={onSelect} aria-pressed={isSelected}>
      <span className="player-card-image">
        {player.avatar ? (
          <img src={player.avatar} alt={`Foto de ${player.name}`} width="768" height="768" loading="lazy" decoding="async" />
        ) : (
          <span className="avatar-fallback">
            <span className="avatar-ring" aria-hidden="true" />
            <span className="relative text-5xl font-black tracking-normal text-white">{player.initials}</span>
          </span>
        )}
        {player.status ? <span className="status-badge absolute left-4 top-4">{player.status}</span> : null}
      </span>
      <span className="mt-4 flex items-start justify-between gap-4">
        <span>
          <span className="block text-xl font-black uppercase tracking-normal text-shush-text">{player.name}</span>
          <span className="mt-2 block text-xs font-black uppercase tracking-[0.15em] text-shush-muted">{player.focus}</span>
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
    </button>
  );
}
