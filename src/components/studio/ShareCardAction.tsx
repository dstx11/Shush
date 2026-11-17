import {useEffect,useRef,useState,type ComponentType} from 'react';
import type {CardStudioProps,CardSubject} from './CanvasStudio';
import '../../styles/card-studio.css';

/** The optional studio is loaded only on request; failed chunks can be retried. */
export function ShareCardAction(subject:CardSubject){
 const [Studio,setStudio]=useState<ComponentType<CardStudioProps>|null>(null);
 const [open,setOpen]=useState(false);
 const [state,setState]=useState<'idle'|'loading'|'error'>('idle');
 const button=useRef<HTMLButtonElement>(null);
 const mounted=useRef(true);
 useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;};},[]);
 const launch=async()=>{
  if(state==='loading')return;
  setState('loading');
  try{const module=await import('./CanvasStudio');if(mounted.current){setStudio(()=>module.CardStudio);setOpen(true);setState('idle');}}
  catch{if(mounted.current)setState('error');}
 };
 return <div className="share-card-action"><button ref={button} type="button" className="utility-button" aria-haspopup="dialog" aria-busy={state==='loading'} disabled={state==='loading'} onClick={launch}>{state==='loading'?'A abrir estúdio…':subject.kind==='player'?'Criar cartão do jogador':'Criar cartão da camisola'} <span aria-hidden="true">↗</span></button>{state==='error'&&<p className="action-feedback" role="alert">Não foi possível abrir o estúdio. Tenta novamente.</p>}{Studio&&open&&<Studio {...subject} onClose={()=>{setOpen(false);requestAnimationFrame(()=>button.current?.focus({preventScroll:true}));}}/>}</div>;
}
