import { useEffect } from 'react';
import { AnimatePresence, useReducedMotion } from 'motion/react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Footer } from './components/layout/Footer';
import { Header } from './components/layout/Header';
import { PageTransition } from './components/ui/PageTransition';
import { defaultMetadata, routeMetadata, siteUrl } from './data/meta';
import { CompanyPage } from './pages/CompanyPage';
import { ContentPage } from './pages/ContentPage';
import { EsportsPage } from './pages/EsportsPage';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ProductsPage } from './pages/ProductsPage';
import { RosterPage } from './pages/RosterPage';
import {
  CompanyContactPage,
  CompanyPartnersPage,
  ContentCreatorPage,
  EsportsResultsPage,
  EsportsTournamentsPage,
  JerseyCustomPage,
  JerseyPage,
  PremierPage,
  ValorantPage,
} from './pages/RoutePages';

export default function App() {
  const location = useLocation();
  const reduceMotion = useReducedMotion();
  useRouteMetadata(location.pathname);
  useRouteScroll(location.pathname, location.hash);

  return (
    <div className={`min-h-screen overflow-x-hidden bg-shush-bg text-shush-text route-${routeArea(location.pathname)}`}>
      <Header />
      <main>
        <AnimatePresence mode="wait" initial={!reduceMotion}>
          <PageTransition key={location.pathname}>
            <Routes location={location}>
              <Route path="/" element={<HomePage />} />
              <Route path="/esports" element={<EsportsPage />} />
              <Route path="/esports/valorant" element={<ValorantPage />} />
              <Route path="/esports/valorant/premier" element={<PremierPage />} />
              <Route path="/esports/valorant/roster" element={<RosterPage />} />
              <Route path="/esports/valorant/results" element={<EsportsResultsPage />} />
              <Route path="/esports/valorant/tournaments" element={<EsportsTournamentsPage />} />
              <Route path="/content" element={<ContentPage />} />
              <Route path="/content/more" element={<ContentCreatorPage creatorId="more" />} />
              <Route path="/content/th0maz7" element={<ContentCreatorPage creatorId="th0maz7" />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/jersey" element={<JerseyPage />} />
              <Route path="/products/jersey/custom" element={<JerseyCustomPage />} />
              <Route path="/company" element={<CompanyPage />} />
              <Route path="/company/partners" element={<CompanyPartnersPage />} />
              <Route path="/company/contact" element={<CompanyContactPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </PageTransition>
        </AnimatePresence>
      </main>
      <Footer />
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

function useRouteScroll(pathname: string, hash: string) {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    let frame = 0;
    let timeout = 0;
    let attempts = 0;

    const scrollToLocation = () => {
      if (hash) {
        const target = document.getElementById(decodeURIComponent(hash.slice(1)));
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
  }, [pathname, hash, reduceMotion]);
}

function setMeta(selector: string, content: string) {
  document.querySelector<HTMLMetaElement>(selector)?.setAttribute('content', content);
}

function setCanonical(href: string) {
  const link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (link) link.href = href;
}

function routeArea(pathname: string) {
  if (pathname.startsWith('/esports')) return 'esports';
  if (pathname.startsWith('/content')) return 'content';
  if (pathname.startsWith('/products')) return 'products';
  if (pathname.startsWith('/company')) return 'company';
  return 'home';
}
