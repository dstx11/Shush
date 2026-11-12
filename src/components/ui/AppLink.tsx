import type { AnchorHTMLAttributes, FocusEvent, MouseEvent, ReactNode, TouchEvent } from 'react';
import { Link } from 'react-router-dom';
import { safeNavigationHref } from '../../lib/navigation';
import { preloadRoute } from '../../lib/routes';

type AppLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  href: string;
};

export function AppLink({
  href,
  children,
  onFocus,
  onMouseEnter,
  onTouchStart,
  rel,
  ...props
}: AppLinkProps) {
  const safeHref = safeNavigationHref(href);
  const safeRel = props.target === '_blank' ? [...new Set([...(rel?.split(/\s+/) ?? []), 'noopener', 'noreferrer'])].join(' ') : rel;
  if (!safeHref) return <a {...props} role="link" aria-disabled="true" tabIndex={-1}>{children}</a>;
  const isInternalRoute = safeHref.startsWith('/');

  if (!isInternalRoute || props.target || props.download) {
    return (
      <a
        href={safeHref} rel={safeRel}
        onFocus={onFocus}
        onMouseEnter={onMouseEnter}
        onTouchStart={onTouchStart}
        {...props}
      >
        {children}
      </a>
    );
  }

  const preload = () => preloadRoute(href);

  const handleFocus = (event: FocusEvent<HTMLAnchorElement>) => {
    preload();
    onFocus?.(event);
  };

  const handleMouseEnter = (event: MouseEvent<HTMLAnchorElement>) => {
    preload();
    onMouseEnter?.(event);
  };

  const handleTouchStart = (event: TouchEvent<HTMLAnchorElement>) => {
    preload();
    onTouchStart?.(event);
  };

  return (
    <Link
      to={safeHref} rel={safeRel}
      onFocus={handleFocus}
      onMouseEnter={handleMouseEnter}
      onTouchStart={handleTouchStart}
      {...props}
    >
      {children}
    </Link>
  );
}
