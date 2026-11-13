import {lazy,Suspense,useEffect,useState} from 'react';
import {useLocation} from 'react-router-dom';
import {useSeason} from '../../seasonal/SeasonProvider';
import {ErrorBoundary} from '../ui/ErrorBoundary';

const ShushLab=lazy(()=>import('./ShushLab'));

export function LabGate(){
 const [open,setOpen]=useState(false);
 const {preview,theme,previewSeason,commitSeason}=useSeason();
 const location=useLocation();
 useEffect(()=>setOpen(false),[location.pathname]);
 useEffect(()=>{
  let count=0;
  let previous=0;
  const keyboard=(event:KeyboardEvent)=>{
   if(!event.altKey||!event.shiftKey||event.ctrlKey||event.metaKey||event.code!=='KeyS'||event.repeat)return;
   if(event.target instanceof HTMLElement&&event.target.closest('input,textarea,select,[contenteditable="true"]'))return;
   event.preventDefault();
   setOpen(value=>!value);
  };
  const logo=(event:MouseEvent)=>{
   if(!(event.target instanceof Element)||!event.target.closest('a.brand-mark'))return;
   const now=performance.now();
   count=now-previous<850?count+1:1;
   previous=now;
   if(count>=5){count=0;setOpen(true);}
  };
  document.addEventListener('keydown',keyboard);
  document.addEventListener('click',logo);
  return ()=>{document.removeEventListener('keydown',keyboard);document.removeEventListener('click',logo);};
 },[]);
 return <>
 {!open&&preview&&<aside className="season-preview-toolbar" aria-label="Pré-visualização temporária"><span role="status">Pré-visualização · {theme.label}</span><button onClick={()=>commitSeason(preview)}>Aplicar edição</button><button onClick={()=>previewSeason(null)}>Cancelar</button><button onClick={()=>setOpen(true)}>Voltar ao LAB</button></aside>}
 {open&&<ErrorBoundary fallback={<aside className="season-preview-toolbar" role="alert">Não foi possível abrir o LAB. <button onClick={()=>setOpen(false)}>Fechar</button><button onClick={()=>window.location.reload()}>Tentar novamente</button></aside>}><Suspense fallback={<div className="season-preview-toolbar" role="status">A carregar laboratório… <button onClick={()=>setOpen(false)}>Cancelar</button></div>}><ShushLab onExplore={()=>setOpen(false)} onClose={()=>{previewSeason(null);setOpen(false);}}/></Suspense></ErrorBoundary>}
 </>;
}
