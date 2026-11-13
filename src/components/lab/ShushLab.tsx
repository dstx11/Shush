import {useEffect,useMemo,useRef,useState,type CSSProperties} from 'react';
import {useModalDialog} from '../../hooks/useModalDialog';
import {useSeason,type SeasonChoice,isSeasonId} from '../../seasonal/SeasonProvider';
import {themes} from '../../seasonal/themes';
import type {SeasonId} from '../../seasonal/calendar.mjs';
import {AppLink} from '../ui/AppLink';
import {players} from '../../data/players';
import {verifiedMatches} from '../../data/verified-matches';
import '../../styles/lab.css';

type Page='overview'|'seasons'|'motion'|'components'|'performance';
const pages:{id:Page;label:string}[]=[
 {id:'overview',label:'Visão geral'},
 {id:'seasons',label:'Seasons'},
 {id:'motion',label:'Motion'},
 {id:'components',label:'Componentes'},
 {id:'performance',label:'Performance'}
];
const swatches:Record<SeasonId,string>={
 base:'#c4afe9',christmas:'#edcb94',newyear:'#c8d5f2',carnival:'#e9baf8',
 valentines:'#f1a7c1',easter:'#d1c7fe',summer:'#ffa58b',halloween:'#eab17d'
};
function SeasonStudio(){
 const {id,theme,automatic,override,preview,previewSeason,commitSeason}=useSeason();
 const selected=preview??id;
 const choices=Object.keys(themes).filter(isSeasonId);
 return <div className="lab-panel" id="lab-seasons" role="tabpanel" aria-labelledby="lab-tab-seasons">
  <div className="lab-panel-intro"><span className="lab-eyebrow">SEASON ENGINE / 01</span><h3>O mesmo universo. Outras atmosferas.</h3><p>Pré-visualiza uma edição no website sem alterar a preferência guardada. Só a opção «Aplicar» a mantém nas próximas visitas.</p></div>
  <div className="lab-season-status"><span>Edição atual <strong>{theme.label}</strong></span><span>Calendário <strong>{themes[automatic].label}</strong></span><span>Definição <strong>{override==='auto'?'Automática':'Manual'}</strong></span></div>
  <div className="lab-season-grid" aria-label="Edições disponíveis">{choices.map(choice=>
   <button type="button" key={choice} className="lab-season-choice" style={{'--lab-swatch':swatches[choice]} as CSSProperties}
    aria-pressed={selected===choice} onClick={()=>previewSeason(choice)}>
     <span className="lab-season-disk" aria-hidden="true"><span/></span>
     <small>{themes[choice].chapter}</small><strong>{themes[choice].label}</strong>
     <span>{selected===choice?'Em pré-visualização':'Explorar edição'}</span>
   </button>
  )}</div>
  <div className="lab-actions"><button className="lab-primary" type="button" onClick={()=>commitSeason(selected)}>Aplicar esta edição</button><button type="button" onClick={()=>previewSeason(null)} disabled={!preview}>Cancelar pré-visualização</button><button type="button" onClick={()=>commitSeason('auto')}>Usar calendário automático</button></div>
  <p className="lab-note" role="status">{preview?'A pré-visualização é temporária.':'A edição acompanha a tua escolha ou as datas do calendário.'}</p>
 </div>;
}
function MotionStudio(){
 const [duration,setDuration]=useState(850);
 const [distance,setDistance]=useState(55);
 const [easing,setEasing]=useState('cubic-bezier(.16,1,.3,1)');
 const [cycle,setCycle]=useState(0);
 const [paused,setPaused]=useState(false);
 const style={'--demo-duration':duration+'ms','--demo-distance':distance+'px','--demo-ease':easing} as CSSProperties;
 const reduced=typeof window!=='undefined'&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 return <div className="lab-panel" id="lab-motion" role="tabpanel" aria-labelledby="lab-tab-motion">
  <div className="lab-panel-intro"><span className="lab-eyebrow">MOTION PLAYGROUND / 02</span><h3>Movimento com intenção.</h3><p>Altera uma sequência real, compara a resposta e reinicia quando quiseres. As definições só afetam este ensaio local.</p></div>
  <div className="lab-motion-layout"><div className="lab-demo" style={style} aria-label="Pré-visualização da animação">
   <span className="lab-demo-axis" aria-hidden="true"/>
   <div key={cycle} className={'lab-demo-object'+(paused?' is-paused':'')}><span>SHUSH</span><b>;</b></div>
   <span className="lab-demo-caption">PREVIEW / EXPERIMENTAL</span>
  </div><div className="lab-controls">
   <label>Duração <output>{duration} ms</output><input type="range" min="250" max="1800" step="50" value={duration} onChange={e=>setDuration(Number(e.target.value))}/></label>
   <label>Amplitude <output>{distance} px</output><input type="range" min="0" max="110" step="5" value={distance} onChange={e=>setDistance(Number(e.target.value))}/></label>
   <label>Movimento<select value={easing} onChange={e=>setEasing(e.target.value)}>
    <option value="cubic-bezier(.16,1,.3,1)">Suave / editorial</option>
    <option value="cubic-bezier(.34,1.56,.64,1)">Elástico / retorno</option>
    <option value="ease-in-out">Simétrico / constante</option>
   </select></label>
   <div className="lab-actions"><button className="lab-primary" type="button" onClick={()=>{setCycle(n=>n+1);setPaused(false);}}>Reproduzir</button><button type="button" onClick={()=>setPaused(x=>!x)} aria-pressed={paused}>{paused?'Retomar':'Pausar'}</button></div>
   {reduced&&<p className="lab-note">O sistema pediu movimento reduzido: a pré-visualização respeita essa preferência.</p>}
  </div></div>
 </div>;
}
function ComponentStudio(){
 const [selected,setSelected]=useState(false);
 const [label,setLabel]=useState('');
 const [status,setStatus]=useState('');
 return <div className="lab-panel" id="lab-components" role="tabpanel" aria-labelledby="lab-tab-components">
  <div className="lab-panel-intro"><span className="lab-eyebrow">COMPONENT SYSTEM / 03</span><h3>Os estados contam.</h3><p>Experimenta estados reais de foco, seleção, validação e feedback. Estes componentes nunca alteram dados públicos.</p></div>
  <div className="lab-component-grid">
   <div className="lab-component-case"><span className="lab-eyebrow">01 / SELEÇÃO</span><button type="button" aria-pressed={selected} className="lab-choice-button" onClick={()=>setSelected(v=>!v)}>{selected?'Selecionado':'Selecionar este estado'}<span aria-hidden="true">{selected?'●':'○'}</span></button><p>O estado mantém-se até voltares a selecionar.</p></div>
   <div className="lab-component-case"><span className="lab-eyebrow">02 / VALIDAÇÃO</span><label htmlFor="lab-nick">Nick para o laboratório</label><input id="lab-nick" value={label} maxLength={18} placeholder="Até 18 caracteres" onChange={event=>{setLabel(event.target.value);setStatus('');}}/><button type="button" onClick={()=>setStatus(label.trim()?'Nick válido para esta experiência.':'Escreve um nick antes de confirmar.')}>Validar</button><p role="status">{status||'Sem alterações guardadas.'}</p></div>
   <div className="lab-component-case"><span className="lab-eyebrow">03 / AÇÃO</span><AppLink href="/esports/valorant/roster">Abrir o roster da SHUSH <span aria-hidden="true">↗</span></AppLink><p>Um link real deve levar a um destino real.</p></div>
  </div>
 </div>;
}
type Metrics={navigation:number|null;resources:number;longTasks:number|null;fps:number|null};
function PerformanceStudio(){
 const [metrics,setMetrics]=useState<Metrics>({navigation:null,resources:0,longTasks:null,fps:null});
 useEffect(()=>{
  let active=true,frame=0;
  const navigation=performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming|undefined;
  const types=typeof PerformanceObserver!=='undefined'?PerformanceObserver.supportedEntryTypes:[];
  let count=0;
  let observer:PerformanceObserver|undefined;
  if(types?.includes('longtask')){
   observer=new PerformanceObserver(list=>{count+=list.getEntries().length;if(active)setMetrics(x=>({...x,longTasks:count}));});
   observer.observe({type:'longtask',buffered:true});
  }
  const started=performance.now();
  let frames=0;
  const sample=(now:number)=>{
   if(!active)return;
   frames++;
   if(now-started<850){frame=requestAnimationFrame(sample);return;}
   setMetrics({
    navigation:navigation?Math.round(navigation.duration):null,
    resources:performance.getEntriesByType('resource').length,
    longTasks:types?.includes('longtask')?count:null,
    fps:Math.round(frames*1000/(now-started))
   });
  };
  frame=requestAnimationFrame(sample);
  return ()=>{active=false;cancelAnimationFrame(frame);observer?.disconnect();};
 },[]);
 return <div className="lab-panel" id="lab-performance" role="tabpanel" aria-labelledby="lab-tab-performance">
  <div className="lab-panel-intro"><span className="lab-eyebrow">PERFORMANCE OBSERVATORY / 04</span><h3>Medir antes de decidir.</h3><p>Os valores abaixo são observações locais do navegador nesta sessão. Não são métricas reais de utilizadores nem resultados de um benchmark controlado.</p></div>
  <dl className="lab-metrics">
   <div><dt>Documento / navegação</dt><dd>{metrics.navigation===null?'N/D':metrics.navigation+' ms'}</dd></div>
   <div><dt>Recursos carregados</dt><dd>{metrics.resources}</dd></div>
   <div><dt>Tarefas longas observadas</dt><dd>{metrics.longTasks===null?'Não suportado':metrics.longTasks}</dd></div>
   <div><dt>Frames / segundo (amostra)</dt><dd>{metrics.fps===null?'A medir…':metrics.fps}</dd></div>
  </dl>
  <p className="lab-note">Amostra de aproximadamente 850 ms enquanto este painel está aberto. Os tempos de navegação incluem o carregamento do documento, não apenas a mudança de rota.</p>
 </div>;
}
export default function ShushLab({onClose}:{onClose:()=>void}){
 const dialog=useRef<HTMLDialogElement>(null);
 const [page,setPage]=useState<Page>('overview');
 const {id,override,previewSeason}=useSeason();
 useModalDialog(dialog,true);
 useEffect(()=>()=>previewSeason(null),[previewSeason]);
 const commands=useMemo(()=>pages.filter(item=>item.id!=='overview'),[]);
 const choose=(next:Page)=>setPage(next);
 return <dialog ref={dialog} className="shush-lab" aria-label="SHUSH LAB" onCancel={event=>{event.preventDefault();onClose();}}>
  <div className="lab-shell">
   <header className="lab-top"><div><span className="lab-eyebrow">SHUSH / PRIVATE EXPERIMENTS</span><strong>LAB<span>.</span></strong></div><div className="lab-status"><span>LOCAL ONLY</span><button type="button" onClick={onClose} aria-label="Fechar SHUSH LAB">Fechar <span aria-hidden="true">×</span></button></div></header>
   <div className="lab-body"><nav className="lab-side" aria-label="Secções do laboratório">
    {pages.map((item,index)=><button id={'lab-tab-'+item.id} type="button" key={item.id} className={page===item.id?'is-active':''} aria-current={page===item.id?'page':undefined} onClick={()=>choose(item.id)}><span>0{index+1}</span>{item.label}<span aria-hidden="true">↗</span></button>)}
   </nav>
   <div className="lab-main">
    {page==='overview'?<section className="lab-panel" aria-labelledby="lab-overview-title"><div className="lab-panel-intro"><span className="lab-eyebrow">EXPERIMENTAL SPACE / 00</span><h3 id="lab-overview-title">A identidade não acaba na homepage.</h3><p>Este espaço reúne as ferramentas locais de direção artística, movimento e verificação. Nada do que testares aqui altera o site de outros visitantes.</p></div>
      <div className="lab-overview-grid"><div><span>ACTIVE SEASON</span><strong>{themes[id].label}</strong><small>{override==='auto'?'Definida pelo calendário':'Personalizada neste navegador'}</small></div><div><span>ROSTER</span><strong>{players.length.toString().padStart(2,'0')}</strong><small>Jogadores publicados</small></div><div><span>MATCH ARCHIVE</span><strong>{verifiedMatches.length.toString().padStart(2,'0')}</strong><small>Resultados documentados</small></div></div>
      <div className="lab-command-list" aria-label="Ferramentas">{commands.map(item=><button type="button" key={item.id} onClick={()=>choose(item.id)}><span>{item.label}</span><span aria-hidden="true">↗</span></button>)}</div>
     </section>:page==='seasons'?<SeasonStudio/>:page==='motion'?<MotionStudio/>:page==='components'?<ComponentStudio/>:<PerformanceStudio/>}
   </div></div>
   <footer className="lab-foot"><span>SHUSH LAB / LOCAL EXPERIMENTS</span><span>Alt + Shift + S · Escape para sair</span></footer>
  </div>
 </dialog>;
}
