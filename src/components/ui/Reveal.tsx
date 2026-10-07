import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';

type RevealProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  className?: string;
  delay?: number;
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className'>;

export function Reveal<T extends ElementType = 'div'>({ as, children, className = '', delay = 0, style, ...props }: RevealProps<T>) {
  const Component = as ?? 'div';
  const revealStyle = {
    ...style,
    '--reveal-delay': `${delay}s`,
  } as React.CSSProperties;

  return (
    <Component className={`css-reveal ${className}`} style={revealStyle} {...props}>
      {children}
    </Component>
  );
}
