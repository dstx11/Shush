import type { CSSProperties } from 'react';
import type { Player } from '../../data/players';
import { PlayerPortrait } from './PlayerPortrait';
import '../../styles/channel-portrait.css';

export function ChannelPortrait({ player, sizes, eager }: { player: Player; sizes: string; eager?: boolean }) {
  return (
    <span className="channel-photo" aria-hidden="true"
      style={{ '--cutout': `url("/assets/campaign/${player.id}-mask.svg")` } as CSSProperties}>
      <PlayerPortrait player={player} decorative sizes={sizes} eager={eager} />
    </span>
  );
}
