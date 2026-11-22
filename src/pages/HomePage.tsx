import { lazy, Suspense } from 'react';
import { HomeHub } from '../components/home/HomeHub';
import { CoreHero } from '../components/seasonal/CoreHero';
import { SignalSection } from '../components/seasonal/SignalSection';
import { useSeason } from '../seasonal/SeasonProvider';

const ChristmasLanding = lazy(() => import('../components/seasonal/ChristmasLanding'));
const SeasonFeature = lazy(() => import('../components/seasonal/SeasonFeature'));

export function HomePage() {
  const { id } = useSeason();
  if (id === 'christmas') {
    return <Suspense fallback={<><CoreHero /><SignalSection /><HomeHub /></>}>
      <ChristmasLanding />
    </Suspense>;
  }
  return <>
    <CoreHero />
    {id !== 'base' && <Suspense fallback={null}><SeasonFeature /></Suspense>}
    <HomeHub />
    <SignalSection />
  </>;
}
