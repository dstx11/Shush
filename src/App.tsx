import { lazy, Suspense, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Footer } from './components/layout/Footer';
import { Header } from './components/layout/Header';
import { PageTransition } from './components/ui/PageTransition';
import { defaultMetadata, routeMetadata, siteUrl } from './data/meta';

const HomePage = lazy(() => import('./pages/HomePage').then((module) => ({ default: module.HomePage })));
const PremierPage = lazy(() => import('./pages/PremierPage').then((module) => ({ default: module.PremierPage })));
const RosterPage = lazy(() => import('./pages/RosterPage').then((module) => ({ default: module.RosterPage })));
const ContentPage = lazy(() => import('./pages/ContentPage').then((module) => ({ default: module.ContentPage })));
const DropPage = lazy(() => import('./pages/DropPage').then((module) => ({ default: module.DropPage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then((module) => ({ default: module.AboutPage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then((module) => ({ default: module.NotFoundPage })));

export default function App() {
  const location = useLocation();
  useRouteMetadata(location.pathname);
  useRouteScroll(location.pathname, location.hash);

  return (
    <div className={`min-h-screen overflow-x-hidden bg-shush-bg text-shush-text route-${routeArea(location.pathname)}`}>
      <a className="skip-link" href="#main-content">Saltar para o conteúdo</a>
      <Header />
      <main id="main-content" tabIndex={-1}>
        <Suspense fallback={<RouteFallback />}>
          <PageTransition key={location.pathname}>
            <Routes location={location}>
                <Route path="/" element={<HomePage />} />
                <Route path="/esports/valorant/premier" element={<PremierPage />} />
                <Route path="/esports/valorant/roster" element={<RosterPage />} />
                <Route path="/content" element={<ContentPage />} />
                <Route path="/products/jersey" element={<DropPage />} />
                <Route path="/company" element={<AboutPage />} />

                <Route path="/esports" element={<Navigate to="/esports/valorant/premier" replace />} />
                <Route path="/esports/valorant" element={<Navigate to="/esports/valorant/premier" replace />} />
                <Route path="/esports/valorant/results" element={<Navigate to="/esports/valorant/premier#results" replace />} />
                <Route path="/esports/valorant/tournaments" element={<Navigate to="/esports/valorant/premier#results" replace />} />
                <Route path="/content/more" element={<Navigate to="/content" replace />} />
                <Route path="/content/th0maz7" element={<Navigate to="/content" replace />} />
                <Route path="/products" element={<Navigate to="/products/jersey" replace />} />
                <Route path="/products/jersey/custom" element={<Navigate to="/products/jersey#customizacao" replace />} />
                <Route path="/company/partners" element={<Navigate to="/company#partners" replace />} />
                <Route path="/company/contact" element={<Navigate to="/company" replace />} />

                <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </PageTransition>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

function RouteFallback() {
  return (
    <div className="route-loading" role="status" aria-live="polite">
      <span>SHUSH</span>
    </div>
  );
}

function useRouteMetadata(pathname: string) {
  useEffect(() => {
    const metadata = routeMetadata[pathname] ?? defaultMetadata;
    const canonicalUrl = `${siteUrl}${pathname === '/' ? '' : pathname}`;
    const image = metadata.image ?? defaultMetadata.image ?? '/assets/jersey/frontjersey.webp';
    const absoluteImage = image.startsWith('http') ? image : `${siteUrl}${image}`;

    document.title = metadata.title;
    setMeta('meta[name="description"]', metadata.description);
    setMeta('meta[property="og:title"]', metadata.title);
    setMeta('meta[property="og:description"]', metadata.description);
    setMeta('meta[property="og:url"]', canonicalUrl);
    setMeta('meta[property="og:image"]', absoluteImage);
    setMeta('meta[name="twitter:title"]', metadata.title);
    setMeta('meta[name="twitter:description"]', metadata.description);
    setMeta('meta[name="twitter:image"]', absoluteImage);
    setCanonical(canonicalUrl);
  }, [pathname]);
}

function useRouteScroll(pathname: string, hash: string) {
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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
      document.getElementById('main-content')?.focus({ preventScroll: true });
    };

    frame = window.requestAnimationFrame(scrollToLocation);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timeout);
    };
  }, [pathname, hash]);
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
