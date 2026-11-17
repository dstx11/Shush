import type {VerifiedMatch} from '../../data/verified-matches';
import type {Player} from '../../data/players';
import type {DropConfig} from '../../lib/drop-config';
import {drawMatchPoster} from '../../lib/match-poster';
import {drawShareCard} from '../../lib/share-card';
import {useCallback,useEffect,useRef,useState,type ReactNode} from 'react';
import {useModalDialog} from '../../hooks/useModalDialog';
import {downloadBlob} from '../../lib/browser-transfer';

type Height=1080|1350;
type Props={title:string;label:string;details:ReactNode;initialHeight?:Height;formatLabel:string;resource:string;draw:(canvas:HTMLCanvasElement,height:Height)=>Promise<void>;filename:(height:Height)=>string;onClose:()=>void};
/** One export lifecycle for posters and identity cards, including rapid format changes. */
function CanvasExportDialog({title,label,details,initialHeight=1080,formatLabel,resource,draw,filename,onClose}:Props){
 const dialog=useRef<HTMLDialogElement>(null),canvas=useRef<HTMLCanvasElement>(null);
 const generation=useRef(0),operation=useRef(0),timer=useRef(0),busy=useRef(false);
 const [height,setHeight]=useState<Height>(initialHeight),[ready,setReady]=useState(false),[error,setError]=useState(''),[attempt,setAttempt]=useState(0),[exporting,setExporting]=useState(false);
 useModalDialog(dialog);
 useEffect(()=>{
  const id=++generation.current;
  window.clearTimeout(timer.current);setReady(false);setError('');setExporting(false);busy.current=false;
  const stage=document.createElement('canvas');
  draw(stage,height).then(()=>{
   if(id!==generation.current||!canvas.current)return;
   canvas.current.width=stage.width;canvas.current.height=stage.height;
   canvas.current.getContext('2d')!.drawImage(stage,0,0);setReady(true);
  }).catch(()=>{if(id===generation.current)setError(`Não foi possível preparar ${resource}. Tenta novamente.`);});
  return()=>{generation.current++;window.clearTimeout(timer.current);};
 },[draw,height,attempt,resource]);
 const download=()=>{
  if(!ready||busy.current)return;
  busy.current=true;setExporting(true);setError('');
  const id=generation.current,request=++operation.current;
  const current=()=>id===generation.current&&request===operation.current;
  const fail=()=>{if(current()){operation.current++;busy.current=false;setExporting(false);setError('Não foi possível exportar o PNG. Tenta novamente.');}};
  timer.current=window.setTimeout(fail,8000);
  try{canvas.current?.toBlob(blob=>{
   if(!current())return;
   window.clearTimeout(timer.current);
   try{if(!blob)throw new Error();downloadBlob(blob,filename(height));busy.current=false;setExporting(false);}
   catch{fail();}
  },'image/png');}catch{window.clearTimeout(timer.current);fail();}
 };
 return <dialog ref={dialog} className="match-poster-dialog" aria-labelledby="export-title" onKeyDown={event=>event.stopPropagation()} onCancel={event=>{event.preventDefault();event.stopPropagation();onClose();}}>
  <div className="poster-heading"><h2 id="export-title">{title}</h2><button type="button" className="utility-button" autoFocus onClick={onClose}>Fechar ×</button></div>
  <div className="poster-layout"><div className="poster-preview" aria-busy={!ready&&!error}><canvas ref={canvas} aria-label={label} hidden={!ready}/>{!ready&&!error&&<p role="status">A preparar {resource}…</p>}{error&&<p role="alert">{error}</p>}</div><div className="poster-options">{details}<div className="view-control" role="group" aria-label={formatLabel}>{([1080,1350] as const).map(value=><button key={value} type="button" aria-pressed={height===value} onClick={()=>{if(value!==height){setReady(false);setHeight(value);}}}>{value===1080?'Quadrado':'Vertical'}</button>)}</div><span className="mono">1080 × {height} px · PNG</span><button type="button" className="site-button" disabled={!ready||exporting} aria-busy={exporting} onClick={download}>{exporting?'A preparar PNG…':'Descarregar PNG ↓'}</button>{error&&<button type="button" className="utility-button" onClick={()=>setAttempt(value=>value+1)}>Tentar novamente</button>}</div></div>
 </dialog>;
}

export function MatchPoster({match,onClose}:{match:VerifiedMatch;onClose:()=>void}){
 const draw=useCallback((canvas:HTMLCanvasElement,height:1080|1350)=>drawMatchPoster(canvas,match,height),[match]);
 return <CanvasExportDialog title="Cartaz da partida" label={`SHUSH ${match.shushScore} – ${match.opponentScore} ${match.opponent}, ${match.map}, ${match.date}`} resource="o cartaz" formatLabel="Formato do cartaz" draw={draw} details={<p>{match.opponent} / {match.map}</p>} filename={height=>`shush-${match.id}-1080x${height}.png`} onClose={onClose}/>;
}

export type CardSubject={kind:'player';player:Player}|{kind:'jersey';config:DropConfig};
export type CardStudioProps=CardSubject&{onClose:()=>void};
export function CardStudio(props:CardStudioProps){
 const subject=props.kind==='player'?props.player:props.config;
 const draw=useCallback((canvas:HTMLCanvasElement,height:1080|1350)=>drawShareCard(canvas,props,height),[props.kind,subject]);
 const name=props.kind==='player'?props.player.displayName:props.config.nick||'SHUSH';
 return <CanvasExportDialog title={props.kind==='player'?'Cartão do jogador':'Cartão da camisola'} label={`Cartão SHUSH de ${name}`} resource="a imagem" initialHeight={1350} formatLabel="Formato do cartão" draw={draw} details={<><p>{name}</p><p>Uma composição para guardar ou partilhar.</p>{props.kind==='jersey'&&<p>Pré-visualização indicativa. Não é uma encomenda nem uma prova de impressão.</p>}</>} filename={height=>`shush-${props.kind==='player'?props.player.id:'drop01'}-1080x${height}.png`} onClose={props.onClose}/>;
}
