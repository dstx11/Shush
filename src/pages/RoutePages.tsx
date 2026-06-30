import type { CSSProperties } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ExternalLink, Shirt } from 'lucide-react';
import { AboutSection } from '../components/about/AboutSection';
import { DropSection } from '../components/drop/DropSection';
import { EmptyStateMotion, MapPing, ProgressMilestones, SectionBreadcrumb, SignalBars, StatusBadge, TacticalGrid, Waveform } from '../components/motion/MotionPrimitives';
import { RosterSection } from '../components/roster/RosterSection';
import { AnimatedNumber } from '../components/ui/AnimatedNumber';
import { AppLink } from '../components/ui/AppLink';
import { Button } from '../components/ui/Button';
import { Reveal } from '../components/ui/Reveal';
import { Stagger, StaggerItem } from '../components/ui/Stagger';
import { creators } from '../data/players';
import { activePremierSeason, getPlayersByIds } from '../data/season';
import { transitions } from '../lib/motion';
import { calculatePremierScore, calculatePublicMatchDayState, calculateSeasonStatus, formatDate, formatWindowCountdown } from '../lib/premier';

const trackerTeamUrl = 'https://tracker.gg/valorant/premier/teams/a5552155-90d0-4559-b879-f08e5f9f05b8';

const sectionCards = [
  { title: 'Valorant', copy: 'Divisão competitiva atual.', href: '/esports/valorant' },
  { title: 'Premier', copy: 'Match Center, score e próxima janela.', href: '/esports/valorant/premier' },
  { title: 'Roster', copy: 'Character select da equipa.', href: '/esports/valorant/roster' },
  { title: 'Results', copy: 'Match tickets publicados.', href: '/esports/valorant/results' },
  { title: 'Tournaments', copy: 'Resumo quando houver fecho confirmado.', href: '/esports/valorant/tournaments' },
];

export function ValorantPage() {
  return (
    <section className="page-hero route-page valorant-overview px-5 pb-20 pt-36">
      <div className="page-shell">
        <Reveal>
          <SectionBreadcrumb items={['Esports', 'Valorant']} />
          <span className="section-kicker">Esports / Valorant</span>
          <h1>Valorant é o lobby competitivo.</h1>
          <Waveform className="mt-4" />
          <p>Premier no centro. Roster definido pela SHUSH. Resultados só quando houver confirmação.</p>
          <Button href={trackerTeamUrl} target="_blank" rel="noreferrer" variant="secondary">
            Tracker team
          </Button>
        </Reveal>
        <Stagger className="route-card-grid mission-grid">
          {sectionCards.slice(1, 4).map((card) => (
            <StaggerItem key={card.href}>
              <AppLink className="route-card mission-card" href={card.href}>
                <span>{card.title}</span>
                <p>{card.copy}</p>
              </AppLink>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

export function PremierPage() {
  const reduceMotion = useReducedMotion();
  const score = calculatePremierScore(activePremierSeason);
  const status = calculateSeasonStatus(activePremierSeason);
  const progress = Math.min(100, Math.round((score / activePremierSeason.qualificationPoints) * 100));
  const state = calculatePublicMatchDayState(activePremierSeason);
  const currentWeek = 'week' in state ? state.week : null;
  const currentDay = 'day' in state ? state.day : null;
  const convocados = currentWeek ? getPlayersByIds(currentWeek.convocados) : [];
  const ringStyle = { '--progress': `${progress}%` } as CSSProperties;

  return (
    <>
      <section className="page-hero route-page premier-center px-5 pb-12 pt-36">
        <TacticalGrid className="premier-tactical-grid" />
        <div className="page-shell">
          <Reveal>
            <SectionBreadcrumb items={['Esports', 'Valorant', 'Premier']} />
            <span className="section-kicker">Valorant / Premier</span>
            <h1>Premier Match Center.</h1>
            <Waveform className="mt-4" />
            <p>Score, timeline, próxima janela e convocados da SHUSH.</p>
          </Reveal>
        </div>
      </section>

      <section className="esports-section px-5 py-12">
        <div className="page-shell">
          <div className="premier-match-grid">
            <Reveal className="qualification-ring-card">
              <span className="section-kicker">Qualification ring</span>
              <div className="qualification-ring" style={ringStyle} aria-label={`Premier score ${score} de ${activePremierSeason.qualificationPoints}`}>
                <div>
                  <strong>
                    <AnimatedNumber value={score} />
                  </strong>
                  <small>/ {activePremierSeason.qualificationPoints}</small>
                </div>
              </div>
              <StatusBadge pulse>{status}</StatusBadge>
            </Reveal>

            <Reveal className="qualification-panel" delay={0.08}>
              <span>Estado</span>
              <h2>{state.title}</h2>
              <p>{state.detail}</p>
              <div className="progress-rail" aria-hidden="true">
                <motion.span initial={reduceMotion ? false : { scaleX: 0 }} whileInView={reduceMotion ? undefined : { scaleX: progress / 100 }} viewport={{ once: true }} transition={reduceMotion ? undefined : transitions.deliberate} />
                <ProgressMilestones progress={progress} />
              </div>
              <Button href={trackerTeamUrl} target="_blank" rel="noreferrer" variant="secondary">
                Tracker team
              </Button>
            </Reveal>
          </div>

          {currentWeek && currentDay ? (
            <Reveal className="premier-now-panel mt-4" delay={0.12}>
              <div>
                <span className="section-kicker">Next window</span>
                <h2>
                  Week {currentWeek.weekNumber} · {currentWeek.map ?? 'Mapa por definir'}
                  {currentWeek.map ? <MapPing label={`Mapa ${currentWeek.map}`} /> : null}
                </h2>
                <p>
                  {formatDate(currentDay.date)} · {currentDay.windowStart}-{currentDay.windowEnd} · {formatWindowCountdown(currentDay)}
                </p>
              </div>
              <div className="premier-called">
                <span>Convocados</span>
                {convocados.length > 0 ? (
                  <div>
                    {convocados.map((player) => (
                      <strong key={player.id}>
                        {player.displayName}
                        <small>{player.roles[0]}</small>
                      </strong>
                    ))}
                  </div>
                ) : (
                  <p>A atualizar</p>
                )}
              </div>
            </Reveal>
          ) : null}

          <Stagger className="premier-timeline mt-10" aria-label="Timeline Premier">
            {activePremierSeason.weeks.map((week) => (
              <StaggerItem key={week.id}>
                <article className={`calendar-card timeline-node ${currentWeek?.id === week.id ? 'is-current' : ''}`}>
                  <span className="calendar-scan" aria-hidden="true" />
                  <span>Week {week.weekNumber}</span>
                  <h3>{week.map ?? 'Mapa por definir'}</h3>
                  {week.selectedDays.length > 0 ? (
                    week.selectedDays.map((day) => (
                      <p key={day.id}>
                        {formatDate(day.date)} · {day.windowStart}-{day.windowEnd}
                      </p>
                    ))
                  ) : (
                    <p>Dia a confirmar</p>
                  )}
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}

export function RosterPage() {
  return (
    <>
      <section className="page-hero route-page px-5 pb-8 pt-36">
        <Reveal className="page-shell">
          <SectionBreadcrumb items={['Esports', 'Valorant', 'Roster']} />
          <span className="section-kicker">Valorant / Roster</span>
          <h1>Quem entra no lobby.</h1>
          <p>Character select da SHUSH. Nicks públicos, roles claras e presença de equipa.</p>
        </Reveal>
      </section>
      <RosterSection />
    </>
  );
}

export function EsportsResultsPage() {
  return (
    <section className="matches-section route-page px-5 pb-24 pt-36">
      <div className="page-shell">
        <Reveal>
          <SectionBreadcrumb items={['Esports', 'Valorant', 'Results']} />
          <span className="section-kicker">Valorant / Results</span>
          <h1>Match tickets.</h1>
          <p>Jogos publicados pela SHUSH. Dados por confirmar ficam marcados.</p>
        </Reveal>
        <Stagger className="match-list mt-8">
          {activePremierSeason.results.map((match) => {
            const confirmedRival = match.opponent && !/^opp/i.test(match.opponent);
            const hasScore = confirmedRival && match.shushScore !== undefined && match.opponentScore !== undefined;
            return (
              <StaggerItem key={match.id}>
                <article className={`match-row match-ticket is-${match.outcome}`}>
                  <span className="result-lock" aria-hidden="true" />
                  <span>
                    {formatDate(match.date)} · {match.tournamentName} · {match.phase} · {match.map ?? 'Mapa por definir'}
                  </span>
                  <strong>{hasScore ? `SHUSH ${match.shushScore}-${match.opponentScore} ${confirmedRival}` : 'Adversário por confirmar · Resultado a atualizar'}</strong>
                </article>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}

export function EsportsTournamentsPage() {
  return (
    <section className="results-section route-page px-5 pb-24 pt-36">
      <div className="page-shell">
        <Reveal>
          <SectionBreadcrumb items={['Esports', 'Valorant', 'Tournament Results']} />
          <span className="section-kicker">Valorant / Tournament Results</span>
          <h1>Resumo público.</h1>
          <p>Fechos de seasons e torneios entram aqui quando houver resultado confirmado.</p>
        </Reveal>
        <Stagger className="result-grid mt-8">
          <StaggerItem>
            <article className="result-card result-stamp">
              <EmptyStateMotion title="A atualizar" copy="Sem classificação final pública nesta fase." />
            </article>
          </StaggerItem>
        </Stagger>
      </div>
    </section>
  );
}

export function ContentCreatorPage({ creatorId }: { creatorId: 'more' | 'th0maz7' }) {
  const creator = creators.find((item) => item.id === creatorId) ?? creators[0];
  const platform = creator.creatorType === 'twitch' ? 'Twitch' : 'YouTube';

  return (
    <section className={`content-page creator-detail creator-${creator.creatorType} px-5 pb-24 pt-36`}>
      <div className="page-shell">
        <Reveal>
          <SectionBreadcrumb items={['Content', platform]} />
          <span className="section-kicker">Content / {platform}</span>
          <h1>{creator.displayName}</h1>
          <p>Canal ligado à SHUSH. Área preparada para conteúdo real quando existir.</p>
          <SignalBars className={creator.creatorType === 'twitch' ? 'is-twitch' : 'is-youtube'} />
          <Button href={creator.creatorUrl ?? '/content'} target="_blank" rel="noreferrer">
            Abrir {platform}
          </Button>
        </Reveal>
      </div>
    </section>
  );
}

export function ProductsOverviewPage() {
  return (
    <section className="page-hero route-page products-overview px-5 pb-20 pt-36">
      <div className="page-shell">
        <Reveal>
          <SectionBreadcrumb items={['Products']} />
          <span className="section-kicker">Products</span>
          <h1>Jersey / Clothing.</h1>
          <Waveform className="mt-4" />
          <p>Jersey / Clothing da SHUSH. Pedido manual, frente/verso e customização.</p>
        </Reveal>
        <Stagger className="route-card-grid">
          <StaggerItem>
            <AppLink className="route-card product-route-card" href="/products/jersey">
              <Shirt aria-hidden="true" className="h-5 w-5" />
              <span>Jersey</span>
              <p>Frente, verso e identidade visual.</p>
            </AppLink>
          </StaggerItem>
          <StaggerItem>
            <AppLink className="route-card product-route-card" href="/products/jersey/custom">
              <span>Customização</span>
              <p>Nick, número, tamanho e frase opcional.</p>
            </AppLink>
          </StaggerItem>
        </Stagger>
      </div>
    </section>
  );
}

export function JerseyPage() {
  return <DropSection />;
}

export function JerseyCustomPage() {
  return <DropSection />;
}

export function CompanyPartnersPage() {
  return (
    <section className="company-contact route-page px-5 pb-24 pt-36">
      <Reveal className="page-shell">
        <SectionBreadcrumb items={['Company', 'Partners']} />
        <span className="section-kicker">Company / Partners</span>
        <h1>Backora.</h1>
        <Waveform className="mt-4" />
        <p>Partner técnico/digital da SHUSH. Discreto, direto, dentro da camada web e suporte técnico.</p>
        <a href="https://backora.org/" target="_blank" rel="noreferrer" className="about-backora footer-backora mt-8">
          <span className="section-kicker">Partner</span>
          <span>Backora apoia a camada técnica e digital.</span>
          <img src="/assets/brand/backora-logo.png" width="320" height="293" alt="Backora" loading="lazy" decoding="async" />
          <ExternalLink aria-hidden="true" className="h-5 w-5" />
        </a>
      </Reveal>
    </section>
  );
}

export function CompanyContactPage() {
  return (
    <section className="company-contact route-page px-5 pb-24 pt-36">
      <Reveal className="page-shell">
        <SectionBreadcrumb items={['Company', 'Contact']} />
        <span className="section-kicker">Company / Contact</span>
        <h1>Contacto direto.</h1>
        <EmptyStateMotion title="A atualizar" copy="Contacto direto da SHUSH." />
      </Reveal>
    </section>
  );
}

export { AboutSection as CompanyAboutBlock };
