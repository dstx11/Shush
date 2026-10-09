import { useSearchParams } from 'react-router-dom';
import { HeroShowcase } from '../components/home/HeroShowcase';
import { HomeHub } from '../components/home/HomeHub';
import { Matchday } from '../components/home/Matchday';
import { activePremierSeason } from '../data/season';
import { usePremierClock } from '../lib/use-premier-clock';
import { resolveMatchday } from '../lib/matchday';

export function HomePage() {
  const [params] = useSearchParams();
  const now = usePremierClock();
  const match = params.get('view') === 'home' ? null : resolveMatchday(activePremierSeason, now, params.get('matchday'));
  return <>{match ? <Matchday match={match} /> : <HeroShowcase />}<HomeHub /></>;
}
