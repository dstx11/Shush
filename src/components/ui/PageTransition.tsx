import type { ReactNode } from 'react';

type PageTransitionProps = {
  children: ReactNode;
};

export function PageTransition({ children }: PageTransitionProps) {
  return <div className="route-frame route-enter">{children}</div>;
}
