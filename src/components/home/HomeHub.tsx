import { Radio, Shirt, Trophy, Users } from 'lucide-react';
import { creators } from '../../data/players';
import { activePremierSeason, getPlayersByIds } from '../../data/season';
import { calculatePublicMatchDayState, calculateSeasonStatus, formatDate, formatWindowCountdown } from '../../lib/premier';
import { MapPing, SignalBars, SnakeLine, StatusBadge } from '../motion/MotionPrimitives';
import { Button } from '../ui/Button';
import { Reveal } from '../ui/Reveal';

export function HomeHub() {
  const state = calculatePublicMatchDayState(activePremierSeason);
  const status = calculateSeasonStatus(activePremierSeason);
  const week = 'week' in state ? state.week : null;
  const day = 'day' in state ? state.day : null;
  const convocados = week ? getPlayersByIds(week.convocados) : [];

  return (
    <section id="match-day" className="home-hub scroll-mt-28 px-5 py-16" aria-labelledby="home-hub-title">
      <div className="home-hub-shell">
        <Reveal className="hub-main">
          <div className="hub-main-copy">
            <span className="section-kicker">SHUSH hub</span>
            <h2 id="home-hub-title">{state.title}</h2>
            <p>{state.detail}</p>
          </div>

          <div className="hub-state">
            <span>{activePremierSeason.tournamentName}</span>
            <StatusBadge pulse>{status}</StatusBadge>
            <small>Premier derivado dos dados publicados.</small>
          </div>
        </Reveal>
        <SnakeLine className="home-section-snake" />

        <div className="hub-grid">
          <Reveal className="hub-block hub-block-wide" delay={0.05}>
            <span className="hub-label">Premier Calendar</span>
            {week && day ? (
              <>
                <h3>
                  Week {week.weekNumber} · {week.map ?? 'Mapa por definir'}
                  {week.map ? <MapPing label={`Mapa ${week.map}`} /> : null}
                </h3>
                <p>
                  {formatDate(day.date)} · {day.windowStart}-{day.windowEnd}
                </p>
                <span className="hub-live">{formatWindowCountdown(day)}</span>
              </>
            ) : (
              <>
                <h3>Dia a confirmar.</h3>
                <p>{state.detail}</p>
              </>
            )}
            {state.kind === 'match_day_live' && state.showStreams ? (
              <span className="hub-live">
                <Radio aria-hidden="true" className="h-4 w-4" />
                Streams manuais disponíveis
              </span>
            ) : null}
          </Reveal>

          <Reveal id="convocados" className="hub-block scroll-mt-28" delay={0.1}>
            <span className="hub-label">
              <Users aria-hidden="true" className="h-4 w-4" />
              Convocados
            </span>
            {convocados.length > 0 ? (
              <div className="hub-roster">
                {convocados.map((player, index) => (
                  <span key={player.id}>
                    <small className="lineup-slot">{String(index + 1).padStart(2, '0')}</small>
                    {player.displayName} <small>{player.roles[0]}</small>
                  </span>
                ))}
              </div>
            ) : (
              <p>Roster definido pela SHUSH quando houver janela confirmada.</p>
            )}
          </Reveal>

          <Reveal id="creator-pulse" className="hub-block scroll-mt-28" delay={0.15}>
            <span className="hub-label">Creators pulse</span>
            <div className="hub-links">
              {creators.map((creator) => (
                <a key={creator.id} href={creator.creatorUrl} target="_blank" rel="noreferrer">
                  <SignalBars />
                  {creator.displayName}
                  <small>{creator.creatorType === 'twitch' ? 'Twitch' : 'YouTube'}</small>
                </a>
              ))}
            </div>
          </Reveal>

          <Reveal className="hub-block" delay={0.2}>
            <span className="hub-label">
              <Trophy aria-hidden="true" className="h-4 w-4" />
              Season status
            </span>
            <h3>{status}</h3>
            <p>Resultados entram aqui quando forem confirmados pela equipa.</p>
          </Reveal>

          <Reveal id="home-products" className="hub-block hub-product scroll-mt-28" delay={0.25}>
            <span className="hub-label">
              <Shirt aria-hidden="true" className="h-4 w-4" />
              Products
            </span>
            <h3>Jersey / Clothing</h3>
            <p>Pedido manual com nick, número e tamanho.</p>
            <Button href="/products/jersey">Ver jersey</Button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
