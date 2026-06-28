import { useEffect, useState } from 'react';
import { AdminUnlockModal } from './components/admin/AdminUnlockModal';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { CompanyPage } from './pages/CompanyPage';
import { ContentPage } from './pages/ContentPage';
import { EsportsPage } from './pages/EsportsPage';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ProductsPage } from './pages/ProductsPage';

export default function App() {
  const pathname = usePathname();
  const Page = getPage(pathname);

  return (
    <div className="min-h-screen overflow-x-hidden bg-shush-bg text-shush-text">
      <Header />
      <main>
        <Page />
      </main>
      <Footer />
      <AdminUnlockModal />
    </div>
  );
}

function usePathname() {
  const [pathname, setPathname] = useState(() => normalizePath(window.location.pathname));

  useEffect(() => {
    const update = () => setPathname(normalizePath(window.location.pathname));
    window.addEventListener('popstate', update);
    return () => window.removeEventListener('popstate', update);
  }, []);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href]');
      if (!anchor || anchor.target || anchor.hasAttribute('download')) return;

      const url = new URL(anchor.href);
      const nextPath = normalizePath(url.pathname);
      if (url.origin !== window.location.origin || !isPublicRoute(nextPath)) return;

      event.preventDefault();
      window.history.pushState({}, '', `${nextPath}${url.search}${url.hash}`);
      window.dispatchEvent(new PopStateEvent('popstate'));
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, [pathname]);

  return pathname;
}

function getPage(pathname: string) {
  if (pathname === '/') return HomePage;
  if (pathname === '/esports') return EsportsPage;
  if (pathname === '/content') return ContentPage;
  if (pathname === '/products') return ProductsPage;
  if (pathname === '/company') return CompanyPage;
  return NotFoundPage;
}

function isPublicRoute(pathname: string) {
  return pathname === '/' || pathname === '/esports' || pathname === '/content' || pathname === '/products' || pathname === '/company';
}

function normalizePath(pathname: string) {
  if (!pathname || pathname === '/index.html') return '/';
  return pathname.endsWith('/') && pathname !== '/' ? pathname.slice(0, -1) : pathname;
}
