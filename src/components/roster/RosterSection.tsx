import {useModalDialog} from '../../hooks/useModalDialog';
import { ArrowIcon } from '../ui/ArrowIcon';
import { useCallback, useEffect, useRef, useState } from 'react';
import { copyText, shareUrl } from '../../lib/browser-transfer';
import { useSearchParams } from 'react-router-dom';
import { players, playerDropUrl, type Player } from '../../data/players';
import { getCompetitiveProfile } from '../../data/competitive-profiles';
import { PlayerPortrait } from '../ui/PlayerPortrait';
import { AppLink } from '../ui/AppLink';
import { PlayerSignature } from './PlayerSignature';
import { useCinematicPointer } from '../../hooks/useCinematicPointer';
import { useSelectCue } from '../../hooks/useSelectCue';

function TrackerButton({ href, playerName }: { href: string; playerName: string }) {
  return (
    <AppLink href={href} target="_blank" rel="noopener noreferrer" className="tracker-button" aria-label={`Consultar ${playerName} no Tracker.gg (abre numa nova janela)`}>
      <span>Partidas Competitive</span>
      <span className="tracker-button-arrow" aria-hidden="true"><ArrowIcon /></span>
    </AppLink>
  );
}

export function RosterSection() {
  const [params, setParams] = useSearchParams();
  const selectedIndex = Math.max(0, players.findIndex((player) => player.id === params.get('player')));
  const selectedPlayer = players[selectedIndex] ?? players[0];
  const competitiveProfile = getCompetitiveProfile(selectedPlayer.id);
  const camera = useCinematicPointer<HTMLDivElement>();
  const { enabled: soundEnabled, setEnabled: setSoundEnabled, play: playCue } = useSelectCue();
  const [dossierOpen,setDossierOpen]=useState(false);
  const [replayCycle, setReplayCycle] = useState(0);
  const [stageVisible, setStageVisible] = useState(true);
  const previous = useRef(selectedPlayer);
  const [direction, setDirection] = useState(1);
  const [leaving, setLeaving] = useState<Player | null>(null);
  useEffect(() => {
    if (previous.current.id !== selectedPlayer.id && !window.matchMedia('(prefers-reduced-motion: reduce)').matches && document.documentElement.dataset.motion !== 'reduce') setLeaving(previous.current);
    previous.current = selectedPlayer;
  }, [selectedPlayer]);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const stop = () => { if (media.matches || document.documentElement.dataset.motion === 'reduce') setLeaving(null); };
    media.addEventListener('change', stop);
    document.addEventListener('shush:reduce-motion', stop);
    return () => { media.removeEventListener('change', stop); document.removeEventListener('shush:reduce-motion', stop); };
  }, []);
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
    if (index < 0 || index >= players.length) return;
    playCue();
    if(index===selectedIndex&&params.get("player")===players[index].id)return;
    setDirection(index > selectedIndex || (selectedIndex===players.length-1 && index===0) ? 1 : -1);
    setParams((current) => {
      const next = new URLSearchParams(current);
      next.set('player', players[index].id);
      return next;
    }, { replace: true, preventScrollReset: true });
  }, [setParams, selectedIndex, playCue, params]);
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
    <section id="roster" className="player-page" data-player={selectedPlayer.id} data-direction={direction} aria-labelledby="roster-title">
      <div className="shell">
        <div className="player-heading">
          <h1 id="roster-title">Roster<span className="roster-count"> / 07</span></h1>
          <span className="mono">SHUSH · VALORANT / PLAYER SELECT</span>
        </div>

        <div className="player-stage">


        <div className="character-select">
          <p className="sr-only" role="status">Jogador selecionado: {selectedPlayer.displayName}.</p>
          <article id="selected-player" className="character-spotlight" aria-labelledby="selected-player-name">
            <div key={`identity-${selectedPlayer.id}`} className="character-identity">
              <span className="section-kicker">SHUSH / PLAYER SELECT</span>
              <h2 id="selected-player-name">{selectedPlayer.displayName}</h2>
              <span className="character-role-tape">{selectedPlayer.roles.join(' / ')}</span>

              <span className="sr-only">Camisola #{selectedPlayer.number}</span>
              <span className="character-number" aria-hidden="true">{selectedPlayer.number}</span>
            </div>
            <div key={`media-${selectedPlayer.id}-${replayCycle}`} className="character-media" data-stage-visible={stageVisible}
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
              <PlayerSignature player={selectedPlayer} index={selectedIndex} />
              <span className="character-signal-flare" key={`flare-${selectedPlayer.id}-${replayCycle}`} aria-hidden="true" />
              {leaving?.avatar && <div className="portrait-depart" key={leaving.id} aria-hidden="true" onAnimationEnd={() => setLeaving(current => current?.id === leaving.id ? null : current)}><img src={leaving.avatar} alt="" style={{ objectPosition: leaving.portraitPosition }} /></div>}
              <PlayerPortrait player={selectedPlayer} eager sizes="(max-width: 767px) 100vw, 65vw" />
            </div>

          <div className="character-controls"><span className="mono">{String(selectedIndex + 1).padStart(2, '0')} / {String(players.length).padStart(2, '0')}</span><span className="selection-help">Escolhe um jogador <span aria-hidden="true">· ← →</span></span>
            <button type="button" className="selector-sound" onClick={() => setSoundEnabled(value => !value)} aria-pressed={soundEnabled} aria-label={soundEnabled ? 'Desativar som de seleção' : 'Ativar som de seleção'}>{soundEnabled ? 'SOM ON' : 'SOM OFF'}</button>
            <button type="button" className="selector-replay" onClick={() => setReplayCycle(cycle => cycle + 1)} aria-label="Rever entrada do jogador">Rever entrada</button>
            <button type="button" onClick={selectPrevious} aria-label="Jogador anterior">
              <span aria-hidden="true">←</span>
            </button>
            <button type="button" onClick={selectNext} aria-label="Jogador seguinte">
              <span aria-hidden="true">→</span>
            </button>
          </div>
                    <div ref={stripRef} className="character-strip" role="group" aria-label="Selecionar jogador">
          {players.map((player, index) => {
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

              </div>
            );
          })}
        </div>

            <div key={`copy-${selectedPlayer.id}`} className="character-copy">
              <p><button type="button" className="utility-button" onClick={()=>setDossierOpen(true)}>Abrir dossier de {selectedPlayer.displayName} <ArrowIcon/></button></p>
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

              <AppLink className="editorial-link player-drop-link" href={playerDropUrl(selectedPlayer)}>Ver camisola {selectedPlayer.displayName} <span aria-hidden="true"><ArrowIcon /></span></AppLink>

              {selectedPlayer.creatorUrl ? (
                <AppLink href={selectedPlayer.creatorUrl} target="_blank" rel="noreferrer" className="editorial-link">
                  {selectedPlayer.creatorType === 'twitch' ? 'Ver na Twitch' : 'Ver no YouTube'} <span aria-hidden="true"><ArrowIcon /></span>
                </AppLink>
              ) : null}

            </div>

          </article>


        </div>
        <p className="player-selection-footer">Setas · Teclas 1–7 · Deslizar no telemóvel</p>
        </div>
      </div>
      {dossierOpen&&<PlayerDossier player={selectedPlayer} onClose={()=>{setDossierOpen(false);requestAnimationFrame(()=>document.querySelector<HTMLButtonElement>(".character-copy .utility-button")?.focus({preventScroll:true}));}} onPrevious={selectPrevious} onNext={selectNext}/>}
    </section>
  );
}

function PlayerActions({ playerId, playerName, riotId }: { playerId: string; playerName: string; riotId: string }) {
  const [feedback, setFeedback] = useState('');
  const [manual, setManual] = useState('');
  const [pending, setPending] = useState(false);
  const operation = useRef(0);
  const mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; operation.current++; }; }, []);
  const copy = async () => {
    const id = ++operation.current;
    setPending(true); setManual(''); setFeedback('A copiar o Riot ID…');
    const copied = await copyText(riotId);
    if (!mounted.current || id !== operation.current) return;
    setPending(false);
    setManual(copied ? '' : riotId);
    setFeedback(copied ? 'Riot ID copiado.' : 'Não foi possível copiar. Seleciona o Riot ID abaixo.');
  };
  const share = async () => {
    const id = ++operation.current;
    setPending(true); setManual(''); setFeedback('A preparar a partilha…');
    const url = new URL('/esports/valorant/roster', window.location.origin);
    url.searchParams.set('player', playerId);
    const result = await shareUrl(url.href, `${playerName} — SHUSH`);
    if (!mounted.current || id !== operation.current) return;
    setPending(false);
    setManual(result === 'manual' ? url.href : '');
    setFeedback(result === 'copied' ? 'Ligação do jogador copiada.' : result === 'shared' ? 'Opções de partilha abertas.' : result === 'cancelled' ? 'Partilha cancelada.' : 'Seleciona a ligação abaixo para partilhar.');
  };
  return <div className="player-utilities">
    <div className="action-row" aria-busy={pending}><button type="button" className="utility-button" onClick={copy} disabled={pending}>Copiar Riot ID <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V4H4v12h4"/></svg></button><button type="button" className="utility-button" onClick={share} disabled={pending}>Partilhar jogador <span aria-hidden="true"><ArrowIcon /></span></button></div>
    <p className="action-feedback" role="status">{feedback}</p>
    {manual ? <label className="manual-copy"><span>Texto para copiar</span><input readOnly value={manual} onFocus={(event) => event.target.select()} /></label> : null}
  </div>;
}

function PlayerDossier({player,onClose,onPrevious,onNext}:{player:Player;onClose:()=>void;onPrevious:()=>void;onNext:()=>void}){
 const dialog=useRef<HTMLDialogElement>(null);
 useModalDialog(dialog);
 const profile=getCompetitiveProfile(player.id);
 return <dialog ref={dialog} className="match-poster-dialog player-dossier" aria-labelledby="dossier-name" onCancel={event=>{event.preventDefault();onClose();}}>
  <div className="action-row"><span className="section-kicker">SHUSH / DOSSIER</span><button type="button" className="utility-button" onClick={onClose}>Voltar ao lobby</button></div>
  <div className="dossier-body" key={player.id}><PlayerPortrait player={player} eager sizes="(max-width:600px) 85vw, 320px"/><div><h2 id="dossier-name">{player.displayName}</h2><p>{player.roles.join(' / ')}</p><p>Camisola #{player.number}</p>{profile&&<><p>{profile.riotId}</p><TrackerButton href={profile.trackerUrl} playerName={player.displayName}/></>}{player.creatorUrl&&<AppLink className="editorial-link" href={player.creatorUrl} target="_blank">{player.creatorType==='twitch'?'Twitch':'YouTube'} <ArrowIcon/></AppLink>}<AppLink className="editorial-link" href={playerDropUrl(player)}>Personalizar camisola <ArrowIcon/></AppLink></div></div>
  <div className="action-row"><button type="button" className="utility-button" onClick={onPrevious}>Jogador anterior</button><button type="button" className="utility-button" onClick={onNext}>Jogador seguinte</button></div>
 </dialog>;
}
