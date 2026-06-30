import { MotionRail, SectionBreadcrumb, TacticalGrid } from '../components/motion/MotionPrimitives';
import { AppLink } from '../components/ui/AppLink';
import { Reveal } from '../components/ui/Reveal';
import { Stagger, StaggerItem } from '../components/ui/Stagger';

const esportsAreas = [
  { title: 'Valorant', href: '/esports/valorant', copy: 'A divisão ativa da SHUSH.' },
  { title: 'Premier', href: '/esports/valorant/premier', copy: 'Calendário, score e próxima janela.' },
  { title: 'Roster', href: '/esports/valorant/roster', copy: 'Jogadores e roles públicas.' },
  { title: 'Results', href: '/esports/valorant/results', copy: 'Últimos jogos publicados.' },
];

export function EsportsPage() {
  return (
    <section className="page-hero route-page px-5 pb-20 pt-36">
      <TacticalGrid className="route-tactical-grid" />
      <div className="page-shell">
        <Reveal>
          <SectionBreadcrumb items={['Esports']} />
          <span className="section-kicker">Esports</span>
          <h1>Competitivo sem teatro.</h1>
          <MotionRail className="route-title-rail" />
          <p>Valorant e Premier são o centro competitivo da SHUSH. Acompanha calendário, roster e resultados publicados.</p>
        </Reveal>
        <Stagger className="route-card-grid">
          {esportsAreas.map((area) => (
            <StaggerItem key={area.href}>
              <AppLink href={area.href} className="route-card">
                <span>{area.title}</span>
                <p>{area.copy}</p>
              </AppLink>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
