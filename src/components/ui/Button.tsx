import type { ComponentProps, ReactNode } from 'react';
import { AppLink } from './AppLink';

type ButtonProps = ComponentProps<typeof AppLink> & {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
};

export function Button({ children, variant = 'primary', className = '', ...props }: ButtonProps) {
  return (
    <AppLink className={`site-button button-${variant} ${className}`} {...props}>
      <span>{children}</span><span aria-hidden="true" className="button-arrow">→</span>
    </AppLink>
  );
}
