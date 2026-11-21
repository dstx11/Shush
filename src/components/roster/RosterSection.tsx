import {PlayerActions} from './PlayerActions';
import {PlayerDossier} from './PlayerDossier';
import {TrackerButton} from './TrackerButton';
import { ArrowIcon } from '../ui/ArrowIcon';
import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { useSearchParams } from 'react-router-dom';
import { players, type Player } from '../../data/players';
import { getCompetitiveProfile } from '../../data/competitive-profiles';
import { PlayerPortrait } from '../ui/PlayerPortrait';
import { AppLink } from '../ui/AppLink';
import { useCinematicPointer } from '../../hooks/useCinematicPointer';

export function RosterSection() {
  const [params, setParams] = useSearchParams();
  const selectedIndex = Math.max(0, players.findIndex((player) => player.id === params.get('player')));
  const selectedPlayer = players[selectedIndex] ?? players[0];
  const competitiveProfile = getCompetitiveProfile(selectedPlayer.id);
  const camera = useCinematicPointer<HTMLDivElement>();
  const [dossierOpen,setDossierOpen]=useState(false);
  const [replayCycle, setReplayCycle] = useState(0);
  const [stageVisible, setStageVisible] = useState(true);
  const previous = useRef(selectedPlayer);
  const [leaving, setLeaving] = useState<Player | null>(null);
  useEffect(() => {
    if (previous.current.id !== selectedPlayer.id) setLeaving(previous.current);
    previous.current = selectedPlayer;
  }, [selectedPlayer]);
  useEffect(() => {
    const element = camera.ref.current;
    if (!element || !('IntersectionObserver' in window)) return;
    let inView = false;
    const sync = () => setStageVisible(inView && !document.hidden);
    const observer = new IntersectionObserver(entries => {
      inView = entries[0]?.isIntersecting ?? false;
      sync();
    }, { rootMargin: '80px' });
    observer.observe(element);
    document.addEventListener('visibilitychange', sync);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', sync); };
  }, [selectedPlayer.id, replayCycle]);

  const [allPlayersVisible, setAllPlayersVisible] = useState(false);
  const stripRef = useRef<HTMLDivElement>(null);
  const gesture = useRef<{ x: number; y: number } | null>(null);
  useEffect(() => {
    const strip = stripRef.current;
    const card = strip?.children[selectedIndex] as HTMLElement | undefined;
    if (!strip || !card || strip.scrollWidth <= strip.clientWidth) return;
    const target = strip.scrollLeft + card.getBoundingClientRect().left - strip.getBoundingClientRect().left - (strip.clientWidth - card.offsetWidth) / 2;
    strip.scrollTo({ left: Math.max(0, target), behavior: 'instant' });
  }, [selectedIndex, allPlayersVisible]);
  const selectPlayer = useCallback((index: number) => {
    if (index < 0 || index >= players.length) return;
    if(index===selectedIndex&&params.get("player")===players[index].id)return;
    setParams((current) => {
      const next = new URLSearchParams(current);
      next.set('player', players[index].id);
      return next;
    }, { replace: true, preventScrollReset: true });
  }, [setParams, selectedIndex, params]);
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!/^[1-7]$/.test(event.key) || event.altKey || event.ctrlKey || event.metaKey || event.repeat ||
          document.querySelector('dialog[open]') || (event.target instanceof Element &&
          event.target.closest('input, textarea, select, [contenteditable="true"]'))) return;
      selectPlayer(Number(event.key) - 1);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectPlayer]);
  useEffect(() => {
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (connection?.saveData) return;
    const preload = window.setTimeout(() => {
      for (const offset of [-1, 1]) {
        const player = players[(selectedIndex + offset + players.length) % players.length];
        if (player.avatar) {
          const image = new Image();
          image.sizes = '(max-width: 767px) 100vw, 65vw';
          image.srcset = `${player.avatar.replace('.webp', '-160.webp')} 160w, ${player.avatar.replace('.webp', '-384.webp')} 384w, ${player.avatar} 768w`;
          image.src = player.avatar;
        }
      }
    }, 250);
    return () => window.clearTimeout(preload);
  }, [selectedIndex]);
  const selectNext = () => selectPlayer((selectedIndex + 1) % players.length);
  const selectPrevious = () => selectPlayer((selectedIndex - 1 + players.length) % players.length);

  return (
    <section id="roster" className="player-page" data-player={selectedPlayer.id} aria-labelledby="roster-title">
      <div className="shell">
        <div className="player-heading">
          <h1 id="roster-title">Roster.<span className="roster-count"> VALORANT / SETE JOGADORES</span></h1>
          <span className="mono">SILENCE BEFORE IMPACT</span>
        </div>

        <div className="player-stage">


        <div className="character-select">
          <p className="sr-only" role="status">Jogador selecionado: {selectedPlayer.displayName}.</p>
          <article id="selected-player" className="character-spotlight" aria-labelledby="selected-player-name">
            <div key={`identity-${selectedPlayer.id}`} className="character-identity">
              <h2 id="selected-player-name">{selectedPlayer.displayName}</h2>
              <span className="character-role-tape">{selectedPlayer.roles.join(' / ')}</span>

              <span className="sr-only">Camisola #{selectedPlayer.number}</span>
              <span className="character-number" aria-hidden="true">{selectedPlayer.number}</span>
            </div>
            <div key={`media-${selectedPlayer.id}-${replayCycle}`} className="character-media" style={{ '--silhouette': `url("/assets/campaign/${selectedPlayer.id}-mask.svg")` } as CSSProperties} data-stage-visible={stageVisible}
              ref={camera.ref} onPointerMove={camera.onPointerMove} onPointerLeave={camera.onPointerLeave}
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
              <span className="character-backlight" aria-hidden="true" />
              {leaving?.avatar && <div className="portrait-depart" style={{ '--silhouette': `url("/assets/campaign/${leaving.id}-mask.svg")` } as CSSProperties} key={leaving.id} aria-hidden="true" onAnimationEnd={() => setLeaving(current => current?.id === leaving.id ? null : current)}><img src={leaving.avatar} alt="" style={{ objectPosition: leaving.portraitPosition }} /></div>}
              <div className="roster-portrait">
                <PlayerPortrait player={selectedPlayer} eager sizes="(max-width: 767px) 100vw, 65vw" />
              </div>
            </div>

                    <div className="player-selector"><div className="player-selector-heading"><span>{allPlayersVisible ? 'Todos à vista' : 'Desliza para explorar'}</span><button className="utility-button" type="button" aria-label="Ver os 7 jogadores" aria-pressed={allPlayersVisible} aria-controls="player-options" onClick={() => setAllPlayersVisible(value => !value)}>Ver os 7 <span aria-hidden="true">{allPlayersVisible ? '-' : '+'}</span></button></div><div ref={stripRef} id="player-options" className={`character-strip${allPlayersVisible ? ' is-expanded' : ''}`} role="group" aria-label="Selecionar jogador">
          {players.map((player, index) => {
            return (
              <div key={player.id} className={`player-select-card${index === selectedIndex ? ' is-active' : ''}`}>
                <button type="button" className="player-card-select" aria-label={player.displayName} aria-pressed={index === selectedIndex} aria-controls="selected-player" onClick={() => selectPlayer(index)} onKeyDown={(event) => {
                  const target = event.key === 'ArrowRight' ? (index + 1) % players.length : event.key === 'ArrowLeft' ? (index - 1 + players.length) % players.length : event.key === 'Home' ? 0 : event.key === 'End' ? players.length - 1 : -1;
                  if (target < 0) return;
                  event.preventDefault();
                  selectPlayer(target);
                  (stripRef.current?.children[target]?.querySelector('button') as HTMLButtonElement | null)?.focus({ preventScroll: true });
                }}>
                  <span className="strip-avatar">
                    <span className="player-card-number" aria-hidden="true">#{player.number}</span>
                    <PlayerPortrait player={player} decorative thumbnail sizes={allPlayersVisible ? '(max-width: 767px) calc((100vw - 56px) / 3), 55px' : '(max-width: 767px) 72px, 55px'} />
                  </span>
                  <span className="player-card-name"><strong>{player.displayName}</strong><span aria-hidden="true">{String(index+1).padStart(2,'0')}</span></span>
                </button>

              </div>
            );
          })}
        </div></div>

          <div className="character-controls"><span className="mono">{String(selectedIndex + 1).padStart(2, '0')} / {String(players.length).padStart(2, '0')}</span><details className="roster-shortcuts"><summary>Atalhos</summary><p><kbd>1–7</kbd> selecionar jogador<br /><kbd>← →</kbd> percorrer as opções em foco<br />Desliza sobre a fotografia no telemóvel.</p></details>
            <button type="button" className="selector-replay" onClick={() => setReplayCycle(cycle => cycle + 1)} aria-label="Rever entrada do jogador">Rever entrada</button>
            <button type="button" onClick={selectPrevious} aria-label="Jogador anterior">
              <span aria-hidden="true">←</span>
            </button>
            <button type="button" onClick={selectNext} aria-label="Jogador seguinte">
              <span aria-hidden="true">→</span>
            </button>
          </div>

            <div key={`copy-${selectedPlayer.id}`} className="character-copy">
              <div className="player-file-heading"><span className="section-kicker">Ficheiro do jogador</span><span className="mono">#{selectedPlayer.number}</span></div><h3>Perfil competitivo</h3>


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

              <button type="button" className="utility-button player-dossier-control" onClick={()=>setDossierOpen(true)}>Abrir dossier de {selectedPlayer.displayName} <ArrowIcon/></button>


              {selectedPlayer.creatorUrl ? (
                <AppLink href={selectedPlayer.creatorUrl} target="_blank" rel="noreferrer" className="editorial-link">
                  {selectedPlayer.creatorType === 'twitch' ? 'Ver na Twitch' : 'Ver no YouTube'} <span aria-hidden="true"><ArrowIcon /></span>
                </AppLink>
              ) : null}

            </div>

          </article>


        </div>
        <p className="player-selection-footer"><span className="strip-explore">Explora os 7 jogadores <span aria-hidden="true">↔</span></span></p>
        </div>
      </div>
      {dossierOpen&&<PlayerDossier player={selectedPlayer} onClose={()=>{setDossierOpen(false);requestAnimationFrame(()=>document.querySelector<HTMLButtonElement>(".player-dossier-control")?.focus({preventScroll:true}));}} onPrevious={selectPrevious} onNext={selectNext}/>}
    </section>
  );
}

