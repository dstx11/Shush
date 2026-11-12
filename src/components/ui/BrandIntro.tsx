import {useEffect,useRef,useState} from 'react';
import {useSeason} from '../../seasonal/SeasonProvider';
import {lisbonDate,type SeasonId} from '../../seasonal/calendar.mjs';
import {SeasonArtwork} from '../seasonal/SeasonArtwork';

const key=(id:SeasonId)=>'shush:intro:'+id+':'+lisbonDate().year;
function canShow(id:SeasonId){
 if(typeof window==='undefined'||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return false;
 try{return sessionStorage.getItem(key(id))!=='1';}catch{return false;}
}
export function BrandIntro(){
 const {id,theme}=useSeason();
 const [visible,setVisible]=useState(()=>canShow(id));
 const [leaving,setLeaving]=useState(false);
 const dialog=useRef<HTMLDialogElement>(null);
 useEffect(()=>{if(canShow(id)){setLeaving(false);setVisible(true);}},[id]);
 useEffect(()=>{
  const el=dialog.current;
  if(!visible||!el)return;
  if(!el.open)el.showModal();
  try{sessionStorage.setItem(key(id),'1');}catch{/* Optional storage */}
  const fade=window.setTimeout(()=>setLeaving(true),1050);
  const close=window.setTimeout(()=>setVisible(false),1390);
  const media=window.matchMedia('(prefers-reduced-motion: reduce)');
  const onMotion=()=>{if(media.matches)setVisible(false);};
  media.addEventListener('change',onMotion);
  return ()=>{window.clearTimeout(fade);window.clearTimeout(close);media.removeEventListener('change',onMotion);if(el.open)el.close();};
 },[visible,id]);
 if(!visible)return null;
 return <dialog ref={dialog} className={'brand-intro shush-season-intro'+(leaving?' is-leaving':'')} aria-label={'Entrada SHUSH / '+theme.label} onCancel={()=>setVisible(false)}>
   <div className="season-intro-symbol" aria-hidden="true"><SeasonArtwork id={id}/></div>
   <span className="intro-kicker">{theme.label}</span>
   <strong>{theme.intro}</strong>
   <p>{theme.introSub}</p>
   <button type="button" className="intro-skip" onClick={()=>setVisible(false)}>Entrar <span aria-hidden="true">↗</span></button>
   <span className="intro-signature" aria-hidden="true">SHUSH / {theme.chapter}</span>
 </dialog>;
}
