import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';

type ButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
};

export function Button({ children, variant = 'primary', className = '', ...props }: ButtonProps) {
  const base =
    'group inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-5 text-sm font-black uppercase tracking-[0.16em] transition duration-300 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-shush-purpleGlow';
  const styles =
    variant === 'primary'
      ? 'border border-shush-purpleGlow/45 bg-shush-purple text-white shadow-glow hover:bg-shush-purpleGlow hover:shadow-[0_0_64px_rgba(110,50,255,.36)]'
      : 'border border-white/14 bg-white/[0.045] text-shush-text hover:border-shush-purpleGlow/55 hover:bg-white/[0.075] hover:shadow-[0_0_38px_rgba(110,50,255,.16)]';

  return (
    <a className={`${base} ${styles} ${className}`} {...props}>
      <span>{children}</span>
      <ArrowRight aria-hidden="true" className="h-4 w-4 transition group-hover:translate-x-1" />
    </a>
  );
}
