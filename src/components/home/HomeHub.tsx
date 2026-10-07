import { ExternalLink, Shirt, Trophy, Users } from 'lucide-react';
import { creators, players } from '../../data/players';
import { activePremierSeason } from '../../data/season';
import { calculatePremierScore, calculatePublicMatchDayState, calculateSeasonStatus } from '../../lib/premier';
import { StatusBadge } from '../motion/MotionPrimitives';
import { Button } from '../ui/Button';
import { Reveal } from '../ui/Reveal';

export function HomeHub() {
  const state = calculatePublicMatchDayState(activePremierSeason);
  const status = calculateSeasonStatus(activePremierSeason);
  const score = calculatePremierScore(activePremierSeason);
  const rosterPreview = players.slice(0, 5);

  return (
    <section id="match-day" className="home-hub scroll-mt-28 px-5 py-20" aria-labelledby="home-hub-title">
      <div className="home-hub-shell">
        <Reveal className="hub-editorial-head">
          <div>
            <span className="section-kicker">SHUSH / agora</span>
            <h2 id="home-hub-title">Tudo o que interessa, sem ruído.</h2>
          </div>
          <p>Premier, roster, creators e Drop 01. Sem páginas de enchimento nem informação inventada.</p>
        </Reveal>

        <div className="hub-editorial-grid">
          <Reveal className="hub-feature hub-feature-premier">
            <div className="hub-feature-top">
              <span className="hub-label">
                <Trophy aria-hidden="true" className="h-4 w-4" />
                Premier
              </span>
              <StatusBadge pulse={state.kind === 'match_day_live' || state.kind === 'playoffs_live'}>{status}</StatusBadge>
            </div>
            <div className="hub-feature-copy">
              <h3>{state.title}</h3>
              <p>{state.detail}</p>
            </div>
            <div className="hub-scoreline" aria-label={`Premier score ${score} de ${activePremierSeason.qualificationPoints}`}>
              <strong>{score}</strong>
              <span>/ {activePremierSeason.qualificationPoints}</span>
            </div>
            <Button href="/esports/valorant/premier">Abrir Match Center</Button>
          </Reveal>

          <Reveal className="hub-feature hub-feature-roster" delay={0.05}>
            <div className="hub-feature-top">
              <span className="hub-label">
                <Users aria-hidden="true" className="h-4 w-4" />
                Roster
              </span>
              <small>{players.length} jogadores</small>
            </div>
            <div className="hub-avatar-row" aria-label="Jogadores SHUSH">
              {rosterPreview.map((player) => (
                <span key={player.id} title={player.displayName}>
                  {player.avatar ? <img src={player.avatar} alt="" width="768" height="768" loading="lazy" decoding="async" /> : player.initials}
                </span>
              ))}
            </div>
            <h3>Lineup pública.</h3>
            <p>Roles claras, presença visual e zero estatísticas inventadas.</p>
            <Button href="/esports/valorant/roster" variant="secondary">Ver roster</Button>
          </Reveal>

          <Reveal id="creator-pulse" className="hub-feature hub-feature-creators scroll-mt-28" delay={0.1}>
            <span className="hub-label">Creators</span>
            <div className="hub-creator-list">
              {creators.map((creator) => (
                <a key={creator.id} href={creator.creatorUrl} target="_blank" rel="noreferrer">
                  <span>
                    <strong>{creator.displayName}</strong>
                    <small>{creator.creatorType === 'twitch' ? 'Twitch' : 'YouTube'}</small>
                  </span>
                  <ExternalLink aria-hidden="true" className="h-4 w-4" />
                </a>
              ))}
            </div>
          </Reveal>

          <Reveal className="hub-feature hub-feature-drop" delay={0.15}>
            <span className="hub-label">
              <Shirt aria-hidden="true" className="h-4 w-4" />
              Drop 01
            </span>
            <div className="hub-drop-preview">
              <img src="/assets/jersey/frontjersey.webp" width="1280" height="1280" alt="Jersey SHUSH Drop 01" loading="lazy" decoding="async" />
            </div>
            <div>
              <h3>Jersey / Clothing</h3>
              <p>Frente, verso e personalização manual.</p>
            </div>
            <Button href="/products/jersey" variant="secondary">Ver Drop 01</Button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
