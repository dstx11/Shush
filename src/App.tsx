import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HeroShowcase } from './components/home/HeroShowcase';
import { RosterSection } from './components/roster/RosterSection';
import { DropSection } from './components/drop/DropSection';
import { AboutSection } from './components/about/AboutSection';

export default function App() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-shush-bg text-shush-text">
      <Header />
      <main>
        <HeroShowcase />
        <RosterSection />
        <DropSection />
        <AboutSection />
      </main>
      <Footer />
    </div>
  );
}
