import { useState } from 'react';
import type { Player } from '../../data/players';

type Props = { player: Player; decorative?: boolean; eager?: boolean; sizes?: string; thumbnail?: boolean };

// The wrapper is keyed by player: a failed image must not hide another portrait.
export function PlayerPortrait(props: Props) {
  return <PortraitImage key={props.player.avatar ?? props.player.id} {...props} />;
}
function PortraitImage({ player, decorative = false, eager = false, sizes = '100vw', thumbnail = false }: Props) {
  const [failed, setFailed] = useState(false);
  if (!player.avatar || failed) return <span className="portrait-placeholder" role={decorative ? undefined : 'img'} aria-label={decorative ? undefined : `Retrato indisponível: ${player.displayName}`} aria-hidden={decorative || undefined}>{player.initials}</span>;
  const base = player.avatar.replace(/\.webp$/, '');
  return <img src={thumbnail ? `${base}-160.webp` : player.avatar} srcSet={`${base}-160.webp 160w, ${base}-384.webp 384w, ${player.avatar} 768w`} sizes={sizes} style={{ objectPosition: player.portraitPosition }} alt={decorative ? '' : `Retrato de ${player.displayName}`} width="768" height="768" draggable="false" loading={eager ? 'eager' : 'lazy'} fetchPriority={eager ? 'high' : 'auto'} decoding="async" onError={() => setFailed(true)} />;
}
