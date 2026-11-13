import {useEffect,useRef,useState} from 'react';
import {AppLink} from '../ui/AppLink';
import {ArrowIcon} from '../ui/ArrowIcon';
import {players} from '../../data/players';
import {verifiedMatches} from '../../data/verified-matches';
import '../../styles/cinematic-story.css';

const transmissions=['VALORANT','SHUSH','SEM BARULHO. SÓ ROUNDS.','EST. 2022','SHUSH'];
function Transmission(){
 const ref=useRef<HTMLDivElement>(null);
 const [active,setActive]=useState(false);
 useEffect(()=>{
  const node=ref.current;
  if(!node||!('IntersectionObserver' in window))return;
  let inView=false;
  const sync=()=>setActive(inView&&!document.hidden);
  const observer=new IntersectionObserver(entries=>{inView=entries[0]?.isIntersecting??false;sync();},{rootMargin:'100px'});
  observer.observe(node);
  document.addEventListener('visibilitychange',sync);
  return()=>{observer.disconnect();document.removeEventListener('visibilitychange',sync);};
 },[]);
 return <div ref={ref} className="cinema-transmission" data-active={active} aria-hidden="true">
  <div className="cinema-transmission-track">{[0,1].map(copy=><span key={copy} className="cinema-transmission-set">{transmissions.map((line,i)=><span key={i}>{line}<i aria-hidden="true">✳</i></span>)}</span>)}</div>
 </div>;
}
const chapters=[
 {number:'01',label:'A ORIGEM',title:'Começou pelo contrário.',lead:'Uma referência entre amigos transformou-se num nome para entrar no servidor. O contraste ficou na origem; a identidade cresceu com quem a usa.',href:'/company',cta:'A história inteira'},
 {number:'02',label:'O ROSTER',title:'Uma tag. Sete formas de jogar.',lead:'Cada pessoa tem a sua maneira de ver o round. O que nos junta não é jogar da mesma forma, é querer voltar à queue juntos.',href:'/esports/valorant/roster',cta:'Conhecer os jogadores'},
 {number:'03',label:'O REGISTO',title:'O que acontece, fica.',lead:'A competição também tem memória. Mantemos os resultados que conseguimos confirmar e distinguimos os registos dos próximos jogos.',href:'/esports/valorant/premier#verified-results',cta:'Explorar as partidas'}
] as const;
export function CinematicStory(){
 return <>
  <Transmission/>
  <section className="shush-cinema motion-section" aria-labelledby="cinema-title">
   <div className="shell shush-cinema-intro">
    <span className="section-kicker">SHUSH / ENTRE ROUNDS</span>
    <h2 id="cinema-title">Não é só o que se vê.<br/><em>É o que nos move.</em></h2>
    <p>Há uma história por trás da tag. Não precisámos de inventar outra.</p>
   </div>
   <div className="shell shush-cinema-layout">
    <div className="shush-cinema-stage" aria-hidden="true">
     <div className="shush-cinema-horizon"/><div className="shush-cinema-cameos">{players.slice(0,3).map(player=>player.avatar?<img key={player.id} src={player.avatar.replace('.webp','-384.webp')} width="384" height="384" alt="" loading="lazy" decoding="async"/>:null)}</div>
     <svg className="shush-cinema-orbit" viewBox="0 0 620 620" fill="none" stroke="currentColor">
      <circle cx="310" cy="310" r="250" strokeDasharray="3 15"/>
      <circle cx="310" cy="310" r="194"/>
      <circle cx="310" cy="310" r="126" strokeDasharray="18 15"/>
      <circle cx="310" cy="310" r="47"/>
      <path d="M310 0V122 M310 498V620 M0 310H122 M498 310H620"/>
      <path d="M98 98L178 178 M442 442L522 522 M98 522L178 442 M442 178L522 98"/>
     </svg>
     <div className="shush-cinema-logotype"><span>SHUSH</span><strong>;</strong></div>
     <div className="shush-cinema-corner shush-cinema-corner-top">001 / SHUSH SYSTEM</div>
     <div className="shush-cinema-corner shush-cinema-corner-bottom">NOISE LEVEL: ZERO</div>
     <div className="shush-cinema-measure"><span/></div>
    </div>
    <ol className="shush-cinema-chapters">{chapters.map(chapter=>
     <li key={chapter.number} className="shush-cinema-chapter">
      <span className="shush-cinema-chapter-index"><b>{chapter.number}</b><span>{chapter.label}</span></span>
      <h3>{chapter.title}</h3><p>{chapter.lead}</p>
      <AppLink className="editorial-link" href={chapter.href}>{chapter.cta} <ArrowIcon/></AppLink>
     </li>
    )}</ol>
   </div>
   <div className="shell shush-cinema-outro"><span>{players.length} jogadores no roster</span><span>{verifiedMatches.length} partidas no registo publicado</span><span>Uma história independente desde 2022</span></div>
  </section>
  <Transmission/>
 </>;
}
