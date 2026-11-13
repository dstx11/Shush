import {lazy,Suspense} from 'react';
import {HomeHub} from '../components/home/HomeHub';
import {CoreHero} from '../components/seasonal/CoreHero';
import {SeasonFeature} from '../components/seasonal/SeasonFeature';
import {SignalSection} from '../components/seasonal/SignalSection';
import {CinematicStory} from '../components/seasonal/CinematicStory';
import {useSeason} from '../seasonal/SeasonProvider';
const ChristmasLanding=lazy(()=>import('../components/seasonal/ChristmasLanding'));
export function HomePage(){
 const {id}=useSeason();
 return id==='christmas'
  ? <Suspense fallback={<><CoreHero/><CinematicStory/><SignalSection/><HomeHub/></>}><ChristmasLanding/></Suspense>
  : <><CoreHero/><SeasonFeature/><CinematicStory/><SignalSection/><HomeHub/></>;
}
