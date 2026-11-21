import type { CSSProperties, ReactNode } from 'react';
import type { Player } from '../../data/players';
import { PlayerPortrait } from './PlayerPortrait';
import '../../styles/channel-portrait.css';

export function ChannelPortrait({ player, sizes, eager, children }: { player: Player; sizes: string; eager?: boolean; children?: ReactNode }) {
  return (
    <span className="channel-photo" aria-hidden="true"
      style={{ '--cutout': `url("/assets/campaign/${player.id}-mask.svg")` } as CSSProperties}>
      {children}
      <PlayerPortrait player={player} decorative sizes={sizes} eager={eager} />
    </span>
  );
}
