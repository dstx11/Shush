import {useState} from 'react';
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
export function SeasonFeature(){
 const {id,theme}=useSeason();
 if(id==='base'||id==='christmas')return null;
 const href=id==='newyear'?'/esports/valorant/premier':id==='easter'?'/company':'/esports/valorant/roster';
 return <section className="shell season-feature" aria-labelledby="season-feature-heading">
  <div className="season-feature-heading"><span className="section-kicker">{theme.label} / EXPERIÊNCIA</span><h2 id="season-feature-heading">{theme.feature}</h2><p>{theme.featureBody}</p><AppLink className="editorial-link" href={href}>{id==='newyear'?'Ver partidas':id==='easter'?'Conhecer a origem':'Conhecer o roster'} <ArrowIcon/></AppLink></div>
  <div className={'season-feature-stage season-feature-'+id}>{id==='valentines'?<DuoQueue/>:<><span className="season-feature-oversize" aria-hidden="true">{id==='newyear'?'01':id==='carnival'?'?':id==='easter'?';':id==='summer'?'24':'SH'}</span><span className="season-feature-stamp">{theme.chapter} / SHUSH</span><p>{theme.closing}</p></>}</div>
 </section>;
}
