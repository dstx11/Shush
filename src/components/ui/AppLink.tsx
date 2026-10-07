import type { AnchorHTMLAttributes, FocusEvent, MouseEvent, ReactNode, TouchEvent } from 'react';
import { Link } from 'react-router-dom';
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
  ...props
}: AppLinkProps) {
  const isInternalRoute = href.startsWith('/');

  if (!isInternalRoute || props.target || props.download) {
    return (
      <a
        href={href}
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
      to={href}
      onFocus={handleFocus}
      onMouseEnter={handleMouseEnter}
      onTouchStart={handleTouchStart}
      {...props}
    >
      {children}
    </Link>
  );
}
