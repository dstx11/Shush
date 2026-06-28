import { CreatorsPulse } from '../components/home/CreatorsPulse';
import { HeroShowcase } from '../components/home/HeroShowcase';
import { MatchDayPanel } from '../components/home/MatchDayPanel';
import { ProductsTeaser } from '../components/home/ProductsTeaser';

export function HomePage() {
  return (
    <>
      <HeroShowcase />
      <MatchDayPanel />
      <CreatorsPulse />
      <ProductsTeaser />
    </>
  );
}
