import {useEffect,useRef} from 'react';
import {useModalDialog} from '../../hooks/useModalDialog';
import {players,playerDropUrl,type Player} from '../../data/players';
import {getCompetitiveProfile} from '../../data/competitive-profiles';
import {PlayerPortrait} from '../ui/PlayerPortrait';
import {AppLink} from '../ui/AppLink';
import {ArrowIcon} from '../ui/ArrowIcon';
import {TrackerButton} from './TrackerButton';
import {ShareCardAction} from '../studio/ShareCardAction';

export function PlayerDossier({player,onClose,onPrevious,onNext}:{player:Player;onClose:()=>void;onPrevious:()=>void;onNext:()=>void}){
 const dialog=useRef<HTMLDialogElement>(null);
 useModalDialog(dialog);
 const profile=getCompetitiveProfile(player.id);
 const index=players.findIndex(member=>member.id===player.id);
 useEffect(()=>{dialog.current?.querySelector('.dossier-body')?.scrollTo({top:0,behavior:'instant'});},[player.id]);
 return <dialog ref={dialog} className="match-poster-dialog player-dossier" aria-labelledby="dossier-name"
  onCancel={event=>{event.preventDefault();onClose();}}
  onKeyDown={event=>{
   if(event.altKey||event.ctrlKey||event.metaKey||event.shiftKey||event.repeat)return;
   if(event.target instanceof Element&&event.target.closest('input,textarea,select,[contenteditable="true"]'))return;
   if(event.key==='ArrowLeft'){event.preventDefault();onPrevious();}
   if(event.key==='ArrowRight'){event.preventDefault();onNext();}
  }}>
  <header className="dossier-heading"><span className="section-kicker">SHUSH / DOSSIER</span><button type="button" className="utility-button" onClick={onClose}>Voltar ao lobby</button></header>
  <div className="dossier-body" tabIndex={0} role="region" aria-label="Informação do jogador">
   <figure className="dossier-portrait"><PlayerPortrait player={player} eager sizes="(max-width:600px) 85vw, 380px"/><figcaption>Camisola <strong>#{player.number}</strong></figcaption></figure>
   <div className="dossier-information"><span className="section-kicker">VALORANT / ROSTER</span><h2 id="dossier-name">{player.displayName}</h2>
    <dl className="dossier-facts"><div><dt>Funções</dt><dd>{player.roles.join(' / ')}</dd></div>
     {profile&&<div><dt>Riot ID</dt><dd>{profile.riotId}</dd></div>}
     {player.agents?.length?<div><dt>Agentes favoritos</dt><dd>{player.agents.join(' / ')}</dd></div>:null}
     {player.sensitivity?<div><dt>Sensibilidade</dt><dd>{player.sensitivity}</dd></div>:null}
     {player.equipment?<div><dt>Equipamento</dt><dd>{player.equipment}</dd></div>:null}
    </dl>
    <p className="dossier-context">{player.creatorUrl ? `Encontra ${player.displayName} também ${player.creatorType==='twitch'?'na Twitch':'no YouTube'}.` : `Leva a identidade de ${player.displayName} para a tua versão da camisola.`}</p><div className="dossier-actions"><ShareCardAction kind="player" player={player}/><AppLink className="site-button button-primary" href={playerDropUrl(player)}>Personalizar camisola <ArrowIcon/></AppLink>
     {profile&&<TrackerButton href={profile.trackerUrl} playerName={player.displayName}/>}
     {player.creatorUrl&&<AppLink className="editorial-link" href={player.creatorUrl} target="_blank">{player.creatorType==='twitch'?'Ver na Twitch':'Ver no YouTube'} <ArrowIcon/></AppLink>}
    </div>
   </div>
  </div>
  <nav className="dossier-navigation" aria-label="Navegação entre jogadores"><button type="button" className="utility-button" onClick={onPrevious} aria-label="Jogador anterior"><span aria-hidden="true">←</span> Anterior</button><span className="mono" role="status">{index+1} / {players.length}</span><button type="button" className="utility-button" onClick={onNext} aria-label="Jogador seguinte">Seguinte <span aria-hidden="true">→</span></button></nav>
 </dialog>;
}
