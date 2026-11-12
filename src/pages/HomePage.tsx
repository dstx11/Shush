import {lazy,Suspense} from 'react';
import {HomeHub} from '../components/home/HomeHub';
import {CoreHero} from '../components/seasonal/CoreHero';
import {SeasonFeature} from '../components/seasonal/SeasonFeature';
import {useSeason} from '../seasonal/SeasonProvider';
const ChristmasLanding=lazy(()=>import('../components/seasonal/ChristmasLanding'));
export function HomePage(){
 const {id}=useSeason();
 return id==='christmas'
  ? <Suspense fallback={<CoreHero/>}><ChristmasLanding/></Suspense>
  : <><CoreHero/><SeasonFeature/><HomeHub/></>;
}
