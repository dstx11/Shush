import { useCallback, useEffect, useRef, useState } from 'react';
import { copyText, shareUrl } from '../../lib/browser-transfer';
import { useSearchParams } from 'react-router-dom';
import { players, playerDropUrl, type Player } from '../../data/players';
import { getCompetitiveProfile } from '../../data/competitive-profiles';
import { PlayerPortrait } from '../ui/PlayerPortrait';
import { AppLink } from '../ui/AppLink';

function TrackerButton({ href, playerName, compact = false }: { href: string; playerName: string; compact?: boolean }) {
  return (
    <AppLink href={href} target="_blank" rel="noopener noreferrer" className={`tracker-button${compact ? ' tracker-button-compact' : ''}`} aria-label={`Consultar ${playerName} no Tracker.gg (abre numa nova janela)`}>
      <span>{compact ? 'Tracker.gg' : 'Partidas Competitive'}</span>
      <span className="tracker-button-arrow" aria-hidden="true">↗</span>
    </AppLink>
  );
}

export function RosterSection() {
  const [params, setParams] = useSearchParams();
  const selectedIndex = Math.max(0, players.findIndex((player) => player.id === params.get('player')));
  const selectedPlayer = players[selectedIndex] ?? players[0];
  const competitiveProfile = getCompetitiveProfile(selectedPlayer.id);
  const previous = useRef(selectedPlayer);
  const [direction, setDirection] = useState(1);
  const [leaving, setLeaving] = useState<Player | null>(null);
  useEffect(() => {
    if (previous.current.id !== selectedPlayer.id && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) setLeaving(previous.current);
    previous.current = selectedPlayer;
  }, [selectedPlayer]);
  const stripRef = useRef<HTMLDivElement>(null);
  const gesture = useRef<{ x: number; y: number } | null>(null);
  useEffect(() => {
    const strip = stripRef.current;
    const card = strip?.children[selectedIndex] as HTMLElement | undefined;
    if (!strip || !card || strip.scrollWidth <= strip.clientWidth) return;
    const target = strip.scrollLeft + card.getBoundingClientRect().left - strip.getBoundingClientRect().left - (strip.clientWidth - card.offsetWidth) / 2;
    strip.scrollTo({ left: Math.max(0, target), behavior: 'instant' });
  }, [selectedIndex]);
  const selectPlayer = useCallback((index: number) => {
    setDirection(index === (selectedIndex + 1) % players.length ? 1 : -1);
    setParams((current) => {
      const next = new URLSearchParams(current);
      next.set('player', players[index].id);
      return next;
    }, { replace: true, preventScrollReset: true });
  }, [setParams, selectedIndex]);
  useEffect(() => {
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (connection?.saveData) return;
    const preload = window.setTimeout(() => {
      for (const offset of [-1, 1]) {
        const player = players[(selectedIndex + offset + players.length) % players.length];
        if (player.avatar) { const image = new Image(); image.src = player.avatar; }
      }
    }, 250);
    return () => window.clearTimeout(preload);
  }, [selectedIndex]);
  const selectNext = () => selectPlayer((selectedIndex + 1) % players.length);
  const selectPrevious = () => selectPlayer((selectedIndex - 1 + players.length) % players.length);

  return (
    <section id="roster" className="player-page" data-player={selectedPlayer.id} data-direction={direction} aria-labelledby="roster-title">
      <div className="shell">
        <div className="player-heading">
          <h1 id="roster-title">Roster<span className="roster-count"> / 07</span></h1>
          <span className="mono">SHUSH · VALORANT</span>
        </div>

        <div className="player-stage">


        <div className="character-select">
          <p className="sr-only" role="status">Jogador selecionado: {selectedPlayer.displayName}.</p>
          <article id="selected-player" className="character-spotlight" aria-labelledby="selected-player-name">
            <div key={`identity-${selectedPlayer.id}`} className="character-identity">
              <span className="section-kicker">SHUSH / VALORANT</span>
              <h2 id="selected-player-name">{selectedPlayer.displayName}</h2>

              <span className="sr-only">Camisola #{selectedPlayer.number}</span>
              <span className="character-number" aria-hidden="true">{selectedPlayer.number}</span>
            </div>
            <div key={`media-${selectedPlayer.id}`} className="character-media"
              onPointerDown={(event) => { if (event.pointerType === 'touch') gesture.current = { x: event.clientX, y: event.clientY }; }}
              onPointerCancel={() => { gesture.current = null; }}
              onPointerUp={(event) => {
                const start = gesture.current;
                gesture.current = null;
                if (!start) return;
                const dx = event.clientX - start.x;
                const dy = event.clientY - start.y;
                if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.5) {
                  if (dx < 0) selectNext(); else selectPrevious();
                }
              }}>
              {leaving?.avatar && <div className="portrait-depart" key={leaving.id} aria-hidden="true" onAnimationEnd={() => setLeaving(null)}><img src={leaving.avatar} alt="" style={{ objectPosition: leaving.portraitPosition }} /></div>}
              <PlayerPortrait player={selectedPlayer} eager sizes="(max-width: 767px) 100vw, 65vw" />
            </div>

          <div className="character-controls"><span className="mono">{String(selectedIndex + 1).padStart(2, '0')} / {String(players.length).padStart(2, '0')}</span><span className="selection-help">Seleciona um retrato <span aria-hidden="true">· ← →</span></span>
            <button type="button" onClick={selectPrevious} aria-label="Jogador anterior">
              <span aria-hidden="true">←</span>
            </button>
            <button type="button" onClick={selectNext} aria-label="Jogador seguinte">
              <span aria-hidden="true">→</span>
            </button>
          </div>
                    <div ref={stripRef} className="character-strip" role="group" aria-label="Selecionar jogador">
          {players.map((player, index) => {
            const profile = getCompetitiveProfile(player.id);
            return (
              <div key={player.id} className={`player-select-card${index === selectedIndex ? ' is-active' : ''}`}>
                <button type="button" className="player-card-select" aria-pressed={index === selectedIndex} aria-controls="selected-player" onClick={() => selectPlayer(index)} onKeyDown={(event) => {
                  const target = event.key === 'ArrowRight' ? (index + 1) % players.length : event.key === 'ArrowLeft' ? (index - 1 + players.length) % players.length : event.key === 'Home' ? 0 : event.key === 'End' ? players.length - 1 : -1;
                  if (target < 0) return;
                  event.preventDefault();
                  selectPlayer(target);
                  (stripRef.current?.children[target]?.querySelector('button') as HTMLButtonElement | null)?.focus({ preventScroll: true });
                }}>
                  <span className="strip-avatar">
                    <span className="player-card-number" aria-hidden="true">#{player.number}</span>
                    <PlayerPortrait player={player} decorative thumbnail sizes="(max-width: 1050px) 92px, 13vw" />
                  </span>
                  <span className="player-card-name"><strong>{player.displayName}</strong></span>
                </button>
                {profile ? (
                  <div className="player-card-account">
                    <span className="player-card-riot-id">{profile.riotId}</span>
                    <TrackerButton href={profile.trackerUrl} playerName={player.displayName} compact />
                  </div>
                ) : <p className="competitive-note">Perfil competitivo ainda não publicado.</p>}
              </div>
            );
          })}
        </div>

            <div key={`copy-${selectedPlayer.id}`} className="character-copy">
              <span className="section-kicker">Em jogo</span>
              <dl className="player-dna"><div><dt>Funções</dt><dd>{selectedPlayer.roles.join(' / ')}</dd></div>{selectedPlayer.agents?.length ? <div><dt>Agentes favoritos</dt><dd>{selectedPlayer.agents.join(' / ')}</dd></div> : null}{selectedPlayer.sensitivity ? <div><dt>Sensibilidade</dt><dd>{selectedPlayer.sensitivity}</dd></div> : null}{selectedPlayer.equipment ? <div><dt>Equipamento</dt><dd>{selectedPlayer.equipment}</dd></div> : null}</dl>

              {competitiveProfile ? (
                <>

                <div className="competitive-profile">
                  <dl className="competitive-identity">
                    <div>
                      <dt>Riot ID</dt>
                      <dd>{competitiveProfile.riotId}</dd>
                    </div>
                  </dl>
                  <TrackerButton href={competitiveProfile.trackerUrl} playerName={selectedPlayer.displayName} />
                  <PlayerActions key={selectedPlayer.id} playerId={selectedPlayer.id} playerName={selectedPlayer.displayName} riotId={competitiveProfile.riotId} />
                </div>
                </>
              ) : <p className="competitive-note">Perfil competitivo ainda não publicado.</p>}

              <AppLink className="editorial-link player-drop-link" href={playerDropUrl(selectedPlayer)}>Ver camisola {selectedPlayer.displayName} <span aria-hidden="true">↗</span></AppLink>

              {selectedPlayer.creatorUrl ? (
                <AppLink href={selectedPlayer.creatorUrl} target="_blank" rel="noreferrer" className="editorial-link">
                  {selectedPlayer.creatorType === 'twitch' ? 'Ver na Twitch' : 'Ver no YouTube'} <span aria-hidden="true">↗</span>
                </AppLink>
              ) : null}

            </div>

          </article>


        </div>
        </div>
      </div>
    </section>
  );
}

function PlayerActions({ playerId, playerName, riotId }: { playerId: string; playerName: string; riotId: string }) {
  const [feedback, setFeedback] = useState('');
  const [manual, setManual] = useState('');
  const mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  const copy = async () => {
    const copied = await copyText(riotId);
    if (!mounted.current) return;
    setManual(copied ? '' : riotId);
    setFeedback(copied ? 'Riot ID copiado.' : 'Não foi possível copiar. Seleciona o Riot ID abaixo.');
  };
  const share = async () => {
    const url = new URL('/esports/valorant/roster', window.location.origin);
    url.searchParams.set('player', playerId);
    const result = await shareUrl(url.href, `${playerName} — SHUSH`);
    if (!mounted.current) return;
    setManual(result === 'manual' ? url.href : '');
    setFeedback(result === 'copied' ? 'Ligação do jogador copiada.' : result === 'shared' ? 'Opções de partilha abertas.' : result === 'cancelled' ? 'Partilha cancelada.' : 'Seleciona a ligação abaixo para partilhar.');
  };
  return <div className="player-utilities">
    <div className="action-row"><button type="button" className="utility-button" onClick={copy}>Copiar Riot ID <span aria-hidden="true">⧉</span></button><button type="button" className="utility-button" onClick={share}>Partilhar jogador <span aria-hidden="true">↗</span></button></div>
    <p className="action-feedback" role="status">{feedback}</p>
    {manual ? <label className="manual-copy"><span>Texto para copiar</span><input readOnly value={manual} onFocus={(event) => event.target.select()} /></label> : null}
  </div>;
}
