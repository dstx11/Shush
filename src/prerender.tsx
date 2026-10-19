import { StaticRouter } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { PremierPage } from './pages/PremierPage';
import { RosterPage } from './pages/RosterPage';
import { ContentPage } from './pages/ContentPage';
import { DropPage } from './pages/DropPage';
import { AboutPage } from './pages/AboutPage';

const pages = {
  '/': HomePage,
  '/esports/valorant/premier': PremierPage,
  '/esports/valorant/roster': RosterPage,
  '/content': ContentPage,
  '/products/jersey': DropPage,
  '/company': AboutPage,
};
export function staticPage(path: keyof typeof pages) {
  const Page = pages[path];
  const area = path.split('/')[1] || 'home';
  return <StaticRouter location={path}><div className={`min-h-screen bg-shush-bg text-shush-text route-${area}`}><a className="skip-link" href="#main-content">Saltar para o conteúdo</a><Header /><main id="main-content" tabIndex={-1}><div className="route-frame"><Page /></div></main><Footer /></div></StaticRouter>;
}
