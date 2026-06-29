import { useEffect, useState } from 'react';
import { AnimatePresence, useReducedMotion } from 'framer-motion';
import { AdminUnlockModal } from './components/admin/AdminUnlockModal';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { ScrollProgressRail } from './components/motion/MotionPrimitives';
import { InitialLoader } from './components/ui/InitialLoader';
import { PageTransition } from './components/ui/PageTransition';
import { QuickNav } from './components/ui/QuickNav';
import { defaultMetadata, routeMetadata, siteUrl } from './data/meta';
import { CompanyPage } from './pages/CompanyPage';
import { ContentPage } from './pages/ContentPage';
import { EsportsPage } from './pages/EsportsPage';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ProductsPage } from './pages/ProductsPage';
import {
  CompanyContactPage,
  CompanyPartnersPage,
  ContentCreatorPage,
  EsportsResultsPage,
  EsportsTournamentsPage,
  JerseyCustomPage,
  JerseyPage,
  PremierPage,
  ProductsOverviewPage,
  RosterPage,
  ValorantPage,
} from './pages/RoutePages';

export default function App() {
  const location = useLocation();
  const Page = getPage(location.pathname);
  const reduceMotion = useReducedMotion();
  useRouteMetadata(location.pathname);

  return (
    <div className={`min-h-screen overflow-x-hidden bg-shush-bg text-shush-text route-${routeArea(location.pathname)}`}>
      <ScrollProgressRail />
      <InitialLoader />
      <Header />
      <main>
        <AnimatePresence mode="wait" initial={!reduceMotion}>
          <PageTransition key={location.pathname}>
            <Page />
          </PageTransition>
        </AnimatePresence>
      </main>
      <Footer />
      <QuickNav />
      <AdminUnlockModal />
    </div>
  );
}

function useRouteMetadata(pathname: string) {
  useEffect(() => {
    const metadata = routeMetadata[pathname] ?? defaultMetadata;
    const canonicalUrl = `${siteUrl}${pathname === '/' ? '' : pathname}`;
    const image = metadata.image ?? defaultMetadata.image ?? '/assets/jersey/frontjersey.webp';

    document.title = metadata.title;
    setMeta('meta[name="description"]', metadata.description);
    setMeta('meta[property="og:title"]', metadata.title);
    setMeta('meta[property="og:description"]', metadata.description);
    setMeta('meta[property="og:url"]', canonicalUrl);
    setMeta('meta[property="og:image"]', image);
    setMeta('meta[name="twitter:title"]', metadata.title);
    setMeta('meta[name="twitter:description"]', metadata.description);
    setMeta('meta[name="twitter:image"]', image);
    setCanonical(canonicalUrl);
  }, [pathname]);
}

function setMeta(selector: string, content: string) {
  document.querySelector<HTMLMetaElement>(selector)?.setAttribute('content', content);
}

function setCanonical(href: string) {
  const link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (link) link.href = href;
}

function useLocation() {
  const [location, setLocation] = useState(() => ({
    pathname: normalizePath(window.location.pathname),
    hash: window.location.hash,
  }));
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const update = () =>
      setLocation({
        pathname: normalizePath(window.location.pathname),
        hash: window.location.hash,
      });

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
    let frame = 0;
    let timeout = 0;
    let attempts = 0;

    const scrollToLocation = () => {
      if (location.hash) {
        const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
        if (target) {
          target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
          return;
        }

        if (attempts < 12) {
          attempts += 1;
          timeout = window.setTimeout(scrollToLocation, 50);
          return;
        }
      }

      window.scrollTo({ top: 0, left: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    };

    frame = window.requestAnimationFrame(scrollToLocation);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timeout);
    };
  }, [location.pathname, location.hash, reduceMotion]);

  return location;
}

function getPage(pathname: string) {
  if (pathname === '/') return HomePage;
  if (pathname === '/esports') return EsportsPage;
  if (pathname === '/esports/valorant') return ValorantPage;
  if (pathname === '/esports/valorant/premier') return PremierPage;
  if (pathname === '/esports/valorant/roster') return RosterPage;
  if (pathname === '/esports/valorant/results') return EsportsResultsPage;
  if (pathname === '/esports/valorant/tournaments') return EsportsTournamentsPage;
  if (pathname === '/content') return ContentPage;
  if (pathname === '/content/more') return () => <ContentCreatorPage creatorId="more" />;
  if (pathname === '/content/th0maz7') return () => <ContentCreatorPage creatorId="th0maz7" />;
  if (pathname === '/products') return ProductsPage;
  if (pathname === '/products/jersey') return JerseyPage;
  if (pathname === '/products/jersey/custom') return JerseyCustomPage;
  if (pathname === '/company') return CompanyPage;
  if (pathname === '/company/partners') return CompanyPartnersPage;
  if (pathname === '/company/contact') return CompanyContactPage;
  return NotFoundPage;
}

function isPublicRoute(pathname: string) {
  return publicRoutes.includes(pathname);
}

const publicRoutes = [
  '/',
  '/esports',
  '/esports/valorant',
  '/esports/valorant/premier',
  '/esports/valorant/roster',
  '/esports/valorant/results',
  '/esports/valorant/tournaments',
  '/content',
  '/content/more',
  '/content/th0maz7',
  '/products',
  '/products/jersey',
  '/products/jersey/custom',
  '/company',
  '/company/partners',
  '/company/contact',
];

function normalizePath(pathname: string) {
  if (!pathname || pathname === '/index.html') return '/';
  return pathname.endsWith('/') && pathname !== '/' ? pathname.slice(0, -1) : pathname;
}

function routeArea(pathname: string) {
  if (pathname.startsWith('/esports')) return 'esports';
  if (pathname.startsWith('/content')) return 'content';
  if (pathname.startsWith('/products')) return 'products';
  if (pathname.startsWith('/company')) return 'company';
  return 'home';
}
