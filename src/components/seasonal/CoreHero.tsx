import {AppLink} from '../ui/AppLink';
import {Button} from '../ui/Button';
import {ArrowIcon} from '../ui/ArrowIcon';
import {getHomePlayers} from '../../lib/home-selection';
import {useSeason} from '../../seasonal/SeasonProvider';
import {SeasonArtwork} from './SeasonArtwork';

export function CoreHero(){
 const {id,theme}=useSeason();
 const featured=getHomePlayers();
 return <section id="top" className="opening shush-hero" aria-labelledby="hero-title"><div className="shell shush-hero-layout">
  <div className="shush-hero-copy"><div className="shush-hero-eyebrow"><span className="shush-hero-dot" aria-hidden="true"/>{theme.label}<span className="shush-hero-index">{theme.chapter}</span></div>
   <p className="shush-hero-overline">{id==='base'?'Uma equipa. A nossa maneira.':'SHUSH / LIMITED EDITION'}</p>
   <h1 id="hero-title"><span>{theme.title[0]}</span><em>{theme.title[1]}</em></h1>
   <p className="shush-hero-lead">{theme.lead}</p>
   <div className="action-row shush-hero-actions"><Button href="/esports/valorant/roster">Conhecer o roster</Button><Button href="/company" variant="secondary">A nossa história</Button></div>
   <div className="shush-hero-lower"><span>{theme.closing}</span><a href="#discover" className="editorial-link">Explorar <ArrowIcon/></a></div>
  </div>
  <div className="shush-hero-visual" aria-label="Jogadores em destaque da SHUSH"><div className="shush-hero-aura" aria-hidden="true"/><SeasonArtwork id={id}/><span className="shush-visual-watermark" aria-hidden="true">SHUSH</span>
  <div className="shush-hero-portraits team-cover">{featured.map((player,i)=><AppLink key={player.id} className={'team-cover-player shush-hero-player shush-hero-player-'+i} data-player={player.id} href={'/esports/valorant/roster?player='+player.id} aria-label={'Conhecer '+player.displayName}>
    {player.avatar?<img src={player.avatar} srcSet={player.avatar.replace('.webp','-384.webp')+' 384w, '+player.avatar+' 768w'} sizes="(max-width: 767px) 36vw, 18vw" width="768" height="768" alt="" decoding="async" loading="eager" fetchPriority={i===1?'high':'auto'} style={{objectPosition:player.portraitPosition}}/>:null}
    <span className="shush-hero-player-tag"><small>{String(i+1).padStart(2,'0')} / SHUSH</small><strong>{player.displayName}</strong></span>
   </AppLink>)}</div><span className="shush-hero-visual-caption">SHUSH / VALORANT ROSTER</span></div>
 </div><div className="shush-hero-bottom-line" aria-hidden="true"/></section>;
}
