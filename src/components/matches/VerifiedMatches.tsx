import { ArrowIcon } from '../ui/ArrowIcon';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { copyText } from '../../lib/browser-transfer';
import { CopyIcon } from '../ui/CopyIcon';
import { verifiedMatches, verifiedMatchHref, type VerifiedMatch } from '../../data/verified-matches';
import { formatDate } from '../../lib/premier';
import { filterMatches, mapPerformance, type Outcome } from '../../lib/match-explorer';
import { MatchPoster } from './MatchPoster';

export function VerifiedMatches() {
  const {hash}=useLocation();
  const selected=verifiedMatches.find(match=>`#match-${match.id}`===hash)?.id;
  return <MatchExplorer key={hash} selected={selected}/>;
}

function MatchExplorer({selected}:{selected?:string}) {
  const allControl=useRef<HTMLButtonElement>(null);
  const [outcome, setOutcome] = useState<Outcome>('all');
  const [map, setMap] = useState('all');
  const [query, setQuery] = useState('');
  const [order, setOrder] = useState('newest');
  const [poster, setPoster] = useState<VerifiedMatch | null>(null);
  const matches = filterMatches(verifiedMatches, outcome, map, query).sort((a, b) => order === 'oldest' ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date));
  const maps = [...new Set(filterMatches(verifiedMatches, outcome, 'all').map(match => match.map))];
  const clearFilters=()=>{setOutcome('all');setMap('all');setQuery('');setOrder('newest');requestAnimationFrame(()=>allControl.current?.focus({preventScroll:true}));};
  return <>
    <div className="match-explorer-filters"><div className="calendar-filters" role="group" aria-label="Filtrar resultados">{(['all', 'win', 'loss'] as const).map(value => <button key={value} ref={value==='all'?allControl:undefined} type="button" aria-pressed={outcome === value} onClick={() => { setOutcome(value); setMap('all'); }}>{value === 'all' ? 'Todas' : value === 'win' ? 'Vitórias' : 'Derrotas'}</button>)}</div><label htmlFor="match-map-filter">Mapa<select id="match-map-filter" aria-label="Mapa" value={map} onChange={event => setMap(event.target.value)}><option value="all">Todos os mapas</option>{maps.map(value => <option key={value}>{value}</option>)}</select></label><label className="match-search" htmlFor="match-opponent">Procurar adversário<input id="match-opponent" type="search" placeholder="Nome da equipa" value={query} onChange={event => setQuery(event.target.value)} maxLength={80} autoComplete="off" spellCheck={false} /></label><label htmlFor="match-order">Ordenar<select id="match-order" value={order} onChange={event => setOrder(event.target.value)}><option value="newest">Mais recentes</option><option value="oldest">Mais antigas</option></select></label>{(outcome!=='all'||map!=='all'||query!==''||order!=='newest')&&<button type="button" className="utility-button" onClick={clearFilters}>Limpar filtros</button>}<p className="mono" role="status">{matches.length} de {verifiedMatches.length} partidas</p></div>
    {matches.length===0&&<p className="matchday-empty">Não há partidas com estes filtros. <button type="button" className="utility-button" onClick={clearFilters}>Mostrar todas as partidas</button></p>}
    <div className="verified-match-list">{matches.map(match => <article key={match.id} id={`match-${match.id}`} tabIndex={-1} aria-label={`SHUSH vs ${match.opponent}, ${formatDate(match.date)}`} className={`verified-match ${match.shushScore > match.opponentScore ? 'is-win' : 'is-loss'}${selected===match.id?' is-linked':''}`}>
      <div className="verified-match-meta"><span className="result-mark">{match.shushScore > match.opponentScore ? 'Vitória' : 'Derrota'}</span><time dateTime={match.date}>{formatDate(match.date)}</time><span>{match.map}</span></div>
      <div className="verified-match-score"><strong>SHUSH</strong><span aria-label={`SHUSH ${match.shushScore}, ${match.opponent} ${match.opponentScore}`}>{match.shushScore}<small>:</small>{match.opponentScore}</span><strong>{match.opponent}</strong></div>
      <details className="match-detail" open={selected===match.id?true:undefined}><summary>Detalhes da partida <span aria-hidden="true">+</span></summary><div className="verified-match-source"><span>Verificado em <time dateTime={match.verifiedAt}>{formatDate(match.verifiedAt)}</time></span><a href={match.source} target="_blank" rel="noopener noreferrer" aria-label={`Ver SHUSH vs ${match.opponent} no Tracker.gg (nova janela)`}>Fonte · Tracker.gg <ArrowIcon /></a></div><div className="action-row" style={{alignItems:'flex-start'}}><button className="utility-button" type="button" onClick={event => { event.currentTarget.focus(); setPoster(match); }}>Criar cartaz <ArrowIcon /></button><MatchLink match={match}/></div></details>
    </article>)}</div>
    <section className="map-performance" aria-labelledby="maps-title"><div><h3 id="maps-title">Mapa a mapa.</h3><p>{verifiedMatches.length} partidas verificadas. Uma amostra, não uma classificação.</p></div><div className="map-performance-list">{mapPerformance(verifiedMatches).map(item => <div className="map-performance-row" key={item.map}><strong>{item.map}</strong><span>{item.played} {item.played === 1 ? 'partida' : 'partidas'} · {item.wins} V / {item.losses} D</span><meter min={0} max={100} value={item.rate} aria-label={`Taxa de vitória em ${item.map}`}>{item.rate}%</meter><b>{item.wins}/{item.played}</b></div>)}</div></section>
    {poster && <MatchPoster match={poster} onClose={() => setPoster(null)} />}
  </>;
}

function MatchLink({match}:{match:VerifiedMatch}) {
  const [state,setState]=useState<'idle'|'pending'|'copied'|'manual'>('idle');
  const mounted=useRef(true);
  useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;};},[]);
  const link=typeof window==='undefined'?'':new URL(verifiedMatchHref(match),window.location.origin).href;
  const copy=async()=>{
    setState('pending');
    const success=await copyText(link);
    if(mounted.current)setState(success?'copied':'manual');
  };
  return <div style={{minWidth:0,maxWidth:'100%'}}>
    <button type="button" className="utility-button" style={{minWidth:'10rem'}} aria-label="Copiar ligação desta partida" aria-busy={state==='pending'} disabled={state==='pending'} onClick={copy}>{state==='copied'?'Copiado':state==='pending'?'A copiar…':'Copiar ligação'} <CopyIcon done={state==='copied'}/></button>
    <p className="action-feedback" role="status">{state==='copied'?'Ligação da partida copiada.':state==='manual'?'Seleciona a ligação abaixo para copiar.':''}</p>
    {state==='manual'&&<label className="manual-copy">Ligação da partida<input readOnly value={link} onFocus={event=>event.target.select()}/></label>}
  </div>;
}
