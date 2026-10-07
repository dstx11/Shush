import type { ReactNode } from 'react';

type PrimitiveProps = {
  children?: ReactNode;
  className?: string;
};

export function StatusBadge({ children, className = '', pulse = false }: PrimitiveProps & { pulse?: boolean }) {
  return <span className={`status-badge ${pulse ? 'is-pulse' : ''} ${className}`}>{children}</span>;
}
