import {useEffect,useState} from 'react';
import {players} from '../../data/players';
import {lisbonDate} from '../../seasonal/calendar.mjs';
import {useSeason} from '../../seasonal/SeasonProvider';
import {AppLink} from '../ui/AppLink';
import {ArrowIcon} from '../ui/ArrowIcon';
import {copyText} from '../../lib/browser-transfer';

function DuoQueue(){
 const [first,setFirst]=useState('');
 const [second,setSecond]=useState('');
 const [status,setStatus]=useState('');
 const message=(first.trim()||'PLAYER 01')+' + '+(second.trim()||'PLAYER 02')+' / DUO QUEUE / SHUSH';
 return <div className="season-duo">
  <div className="season-duo-heading"><span>DUO QUEUE / 02</span><span>SHUSH EDITION</span></div>
  <div className="season-duo-fields"><label>Primeiro nick<input value={first} maxLength={18} onChange={e=>{setFirst(e.target.value);setStatus('');}} placeholder="PLAYER 01"/></label><span aria-hidden="true">+</span><label>Segundo nick<input value={second} maxLength={18} onChange={e=>{setSecond(e.target.value);setStatus('');}} placeholder="PLAYER 02"/></label></div>
  <p className="season-duo-output">{message}</p>
  <button type="button" onClick={async()=>setStatus(await copyText(message)?'Mensagem copiada.':'Não foi possível copiar.')}>Copiar cartão <ArrowIcon/></button>
  <span role="status" className="season-duo-status">{status}</span>
 </div>;
}

function NewYearCounter(){
 const getRemaining=()=>{
  const date=lisbonDate();
  if(date.month!==12)return 0;
  return Math.max(0,Math.floor((Date.UTC(date.year+1,0,1)-Date.now())/1000));
 };
 const [remaining,setRemaining]=useState(getRemaining);
 useEffect(()=>{
  const update=()=>{if(!document.hidden)setRemaining(getRemaining());};
  const timer=window.setInterval(update,1000);
  document.addEventListener('visibilitychange',update);
  return()=>{window.clearInterval(timer);document.removeEventListener('visibilitychange',update);};
 },[]);
 const days=Math.floor(remaining/86400),hours=Math.floor(remaining/3600)%24,mins=Math.floor(remaining/60)%60,secs=remaining%60;
 return <div className="season-counter" aria-label="Contagem decrescente até ao Ano Novo">
  <span className="season-scene-kicker">SHUSH / NEXT ROUND</span>
  <strong className="season-counter-round">{remaining?'00':'01'}</strong>
  <div className="season-counter-readout">{remaining?<><span>{String(days).padStart(2,'0')}<small>DIAS</small></span><span>{String(hours).padStart(2,'0')}<small>HORAS</small></span><span>{String(mins).padStart(2,'0')}<small>MIN</small></span><span>{String(secs).padStart(2,'0')}<small>SEG</small></span></>:<strong>ROUND 01 / LET'S GO</strong>}</div>
 </div>;
}
function IncognitoScene(){
 const [index,setIndex]=useState(0);
 const [revealed,setRevealed]=useState(false);
 const player=players[index];
 return <div className="season-incognito">
  <span className="season-scene-kicker">INCOGNITO / IDENTIDADE {String(index+1).padStart(2,'0')}</span>
  <div className={'season-incognito-art'+(revealed?' is-revealed':'')}>
   {player.avatar?<img src={player.avatar} alt="" loading="lazy" decoding="async" width="768" height="768" style={{objectPosition:player.portraitPosition}}/>:null}
   <svg viewBox="0 0 320 180" aria-hidden="true" className="season-incognito-mask"><path d="M20 48 Q87 15 160 47 Q230 15 300 48 L283 140 L160 173 L37 140Z" fill="currentColor"/><path d="M42 77 Q88 48 139 87 Q92 124 42 77Z M181 87 Q229 48 279 77 Q229 124 181 87Z" fill="#1b1724"/></svg>
   <strong>{revealed?player.displayName:'???'}</strong>
  </div>
  <div className="season-scene-actions"><button type="button" aria-pressed={revealed} onClick={()=>setRevealed(v=>!v)}>{revealed?'Esconder nick':'Revelar nick'}</button><button type="button" onClick={()=>{setIndex(i=>(i+1)%players.length);setRevealed(false);}}>Outro jogador ↗</button></div>
 </div>;
}
const secrets=[
 {hint:'01 / ORIGEM',body:'O nome SHUSH surgiu em 2022, inspirado no contraste com a LOUD.'},
 {hint:'02 / NICKS',body:'O More foi a nossa resposta bem-humorada ao Less.'},
 {hint:'03 / SÍMBOLO',body:'O ponto e vírgula foi o nosso contraponto ao aspas.'}
];
function HiddenScene(){
 const [open,setOpen]=useState<number[]>([]);
 return <div className="season-hidden"><span className="season-scene-kicker">HIDDEN / 03 PISTAS</span>
  <div className="season-hidden-grid">{secrets.map((item,index)=><button key={item.hint} type="button" aria-expanded={open.includes(index)} onClick={()=>setOpen(current=>current.includes(index)?current.filter(i=>i!==index):[...current,index])}>
   <svg viewBox="0 0 96 122" aria-hidden="true"><path d="M48 4C24 4 5 41 5 72C5 99 24 117 48 117S91 99 91 72C91 41 72 4 48 4Z" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M7 74Q48 48 89 74 M19 100Q48 83 77 100" fill="none" stroke="currentColor"/></svg>
   <span>{item.hint}</span><strong>{open.includes(index)?item.body:'Descobrir'}</strong>
  </button>)}</div></div>;
}
function AfterhoursScene(){
 const [night,setNight]=useState(true);
 return <div className={'season-afterhours'+(night?' is-night':' is-day')}>
  <span className="season-scene-kicker">SHUSH / AFTERHOURS</span>
  <div className="season-afterhours-orb" aria-hidden="true"/><div className="season-afterhours-horizon" aria-hidden="true"/>
  <strong>{night?'A última?':'Já amanheceu.'}</strong>
  <button type="button" aria-pressed={!night} onClick={()=>setNight(v=>!v)}>{night?'Ver o amanhecer':'Voltar à noite'}</button>
 </div>;
}
function DeadSilenceScene(){
 const [lights,setLights]=useState(false);
 return <div className={'season-dead-silence'+(lights?' is-lit':'')}>
  <span className="season-scene-kicker">SHUSH / DEAD SILENCE</span>
  <div className="season-dead-sign" aria-hidden="true">SHUSH<span>.</span></div>
  <strong>{lights?'Encontrei-te.':'Ouviste aquilo?'}</strong>
  <button type="button" aria-pressed={lights} onClick={()=>setLights(v=>!v)}>{lights?'Apagar luzes':'Acender luzes'}</button>
 </div>;
}
export function SeasonFeature(){
 const {id,theme}=useSeason();
 if(id==='base'||id==='christmas')return null;
 const href=id==='newyear'?'/esports/valorant/premier':id==='easter'?'/company':'/esports/valorant/roster';
 const scene=id==='valentines'?<DuoQueue/>:id==='newyear'?<NewYearCounter/>:id==='carnival'?<IncognitoScene/>:id==='easter'?<HiddenScene/>:id==='summer'?<AfterhoursScene/>:id==='halloween'?<DeadSilenceScene/>:null;
 return <section className="shell season-feature" aria-labelledby="season-feature-heading">
  <div className="season-feature-heading"><span className="section-kicker">{theme.label} / EXPERIÊNCIA</span><h2 id="season-feature-heading">{theme.feature}</h2><p>{theme.featureBody}</p><AppLink className="editorial-link" href={href}>{id==='newyear'?'Ver partidas':id==='easter'?'Conhecer a origem':'Conhecer o roster'} <ArrowIcon/></AppLink></div>
  <div className={'season-feature-stage season-feature-'+id}>{scene}</div>
 </section>;
}
