import { SignatureIntro } from './components/ui/SignatureIntro';
import { useRouteMetadata } from './hooks/useRouteMetadata';
import { SeasonProvider, useSeason } from './seasonal/SeasonProvider';
import { lazy, Suspense, useLayoutEffect, useRef, type ComponentType } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { LabGate } from './components/lab/LabGate';
import { Footer } from './components/layout/Footer';
import { Header } from './components/layout/Header';
import { PageTransition } from './components/ui/PageTransition';
import {
  loadRouteWithRecovery,
  loadAboutPage,
  loadContentPage,
  loadHomePage,
  loadNotFoundPage,
  loadPremierPage,
  loadRosterPage,
} from './lib/routes';

const HomePage = lazy(() => loadRouteWithRecovery(loadHomePage));
const PremierPage = lazy(() => loadRouteWithRecovery(loadPremierPage));
const RosterPage = lazy(() => loadRouteWithRecovery(loadRosterPage));
const ContentPage = lazy(() => loadRouteWithRecovery(loadContentPage));
const AboutPage = lazy(() => loadRouteWithRecovery(loadAboutPage));
const NotFoundPage = lazy(() => loadRouteWithRecovery(loadNotFoundPage));

type AppProps = { initialPage?: ComponentType; initialPath?: string };

export default function App(props: AppProps) {
  return <SeasonProvider><SeasonApp {...props}/></SeasonProvider>;
}
function SeasonApp({ initialPage, initialPath }: AppProps) {
  const { id: seasonId } = useSeason();
  useLayoutEffect(() => { document.getElementById('shush-boot-stage')?.remove(); }, []);
  // The startup route has already been imported. Render it directly so the
  // first client commit does not briefly replace prerendered content with Suspense.
  const page = (path: string, fallback: ComponentType) => {
    const Component = path === initialPath && initialPage ? initialPage : fallback;
    return <Component />;
  };
  const location = useLocation();
  const initialLocationKey = useRef(location.key);
  useRouteMetadata(location.pathname);

  return (
    <div data-entering="false" data-season={seasonId} className={`shush-root min-h-screen bg-shush-bg text-shush-text route-${routeArea(location.pathname)}`}>
      <a className="skip-link" href="#main-content">Saltar para o conteúdo</a>
      <div className="shush-reading-progress" aria-hidden="true" />
      <SignatureIntro />
      <Header />
      <main id="main-content" tabIndex={-1}>
        <Suspense fallback={<RouteFallback />}>
          <PageTransition initialNavigation={location.key === initialLocationKey.current}>
            <Routes location={location}>
                <Route path="/" element={page('/', HomePage)} />
                <Route path="/esports/valorant/premier" element={page('/esports/valorant/premier', PremierPage)} />
                <Route path="/esports/valorant/roster" element={page('/esports/valorant/roster', RosterPage)} />
                <Route path="/content" element={page('/content', ContentPage)} />
                <Route path="/company" element={page('/company', AboutPage)} />

                <Route path="/esports" element={<Navigate to="/esports/valorant/premier" replace />} />
                <Route path="/esports/valorant" element={<Navigate to="/esports/valorant/premier" replace />} />
                <Route path="/esports/valorant/results" element={<Navigate to="/esports/valorant/premier#verified-results" replace />} />
                <Route path="/esports/valorant/tournaments" element={<Navigate to="/esports/valorant/premier#verified-results" replace />} />
                <Route path="/content/more" element={<Navigate to="/content" replace />} />
                <Route path="/content/th0maz7" element={<Navigate to="/content" replace />} />
                <Route path="/company/partners" element={<Navigate to="/company#partners" replace />} />
                <Route path="/company/contact" element={<Navigate to="/company" replace />} />

                <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </PageTransition>
        </Suspense>
      </main>
      <Footer />
      <LabGate />
    </div>
  );
}

function RouteFallback() {
  return (
    <div className="shush-loading" role="status" aria-live="polite">
      <img src="/assets/brand/shush-logo-small.webp" width="1167" height="647" alt="" />
      <span className="loading-line" aria-hidden="true" />
      <p>A carregar SHUSH…</p>
    </div>
  );
}


function routeArea(pathname: string) {
  if (pathname.startsWith('/esports')) return 'esports';
  if (pathname.startsWith('/content')) return 'content';
  if (pathname.startsWith('/products')) return 'products';
  if (pathname.startsWith('/company')) return 'company';
  return 'home';
}
