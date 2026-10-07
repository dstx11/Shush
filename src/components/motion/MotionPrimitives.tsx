import type { ReactNode } from 'react';

type PrimitiveProps = {
  children?: ReactNode;
  className?: string;
};

export function MotionRail({ className = '' }: PrimitiveProps) {
  return <span className={`motion-rail css-rail ${className}`} aria-hidden="true" />;
}

export function StatusBadge({ children, className = '', pulse = false }: PrimitiveProps & { pulse?: boolean }) {
  return <span className={`motion-status-badge ${pulse ? 'is-pulse' : ''} ${className}`}>{children}</span>;
}

export function PlayerLockIndicator({ label = 'SELECIONADO' }: { label?: string }) {
  return <span className="player-lock-indicator css-pop-in">{label}</span>;
}
