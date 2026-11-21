import '../styles/premier.css';
import { lazy, Suspense, useState, useRef, useEffect, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { MatchBoard } from '../components/matches/MatchBoard';
import { matchSource, verifiedMatches } from '../data/verified-matches';
import { VerifiedMatches } from '../components/matches/VerifiedMatches';
import { formatDate } from '../lib/premier';

const wins=verifiedMatches.filter(match=>match.shushScore>match.opponentScore).length;
const lastVerification = verifiedMatches.map(match => match.verifiedAt).sort().reverse()[0];
const SeasonArchive = lazy(() => import('../components/matches/SeasonArchive'));

export function PremierPage({ staticArchive }: { staticArchive?: ReactNode } = {}) {
  const { hash } = useLocation();
  const linked = ['#archive', '#calendar', '#results'].includes(hash);
  const [visited, setVisited] = useState(linked);
  const archive = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    if (linked && archive.current) {
      archive.current.open = true;
      setVisited(true);
    }
  }, [linked, hash]);
  return (
    <div className="match-page">
      <section className="shell match-opening" aria-labelledby="premier-title">
        <div className="premier-cover">
          <div className="match-heading"><span className="section-kicker">VALORANT / ARQUIVO COMPETITIVO</span><h1 id="premier-title">Premier.</h1>
            <div className="action-row"><a href="#verified-results" className="editorial-link">Ver partidas ↓</a><Button href={matchSource} target="_blank" rel="noopener noreferrer" variant="secondary">Tracker da equipa</Button></div>
          </div>
          <MatchBoard />
        </div>
        <dl className="match-record-summary" aria-label="Resumo das partidas verificadas"><div><dt>Partidas documentadas</dt><dd>{verifiedMatches.length}</dd></div><div><dt>Vitórias / derrotas</dt><dd>{wins} <span>/ {verifiedMatches.length-wins}</span></dd></div><div><dt>Período do registo</dt><dd>Abr–Jun <span>2026</span></dd></div></dl><nav className="match-section-nav" aria-label="Explorar o Match Center"><a className="editorial-link" href="#verified-results">Partidas verificadas</a><a className="editorial-link" href="#maps-title">Mapa a mapa</a><a className="editorial-link" href="#archive" onClick={()=>{if (archive.current) archive.current.open = true;}}>Arquivo interno</a></nav><p className="matchday-empty">Próxima partida: ainda sem data confirmada.</p><section id="verified-results" aria-labelledby="verified-title"><div className="section-index"><h2 id="verified-title">Partidas registadas</h2><span className="mono">Verificação manual · {lastVerification ? formatDate(lastVerification) : 'sem registos'}</span></div><VerifiedMatches /><p className="match-provenance">Registo de abril a junho de 2026, transcrito do Tracker.gg. Não é uma atualização em direto.</p></section>
      </section>
      <details ref={archive} onToggle={event => { if (event.currentTarget.open) setVisited(true); }} id="archive" className="shell legacy-archive"><summary>Arquivo interno <span>Jun — Jul 2026</span><span aria-hidden="true">+</span></summary><p className="body-copy">Calendário e registos anteriores da equipa. Não foi confirmada a correspondência com as partidas do Tracker.gg apresentadas acima.</p>
      {staticArchive ?? (visited && <Suspense fallback={<p role="status">A abrir o calendário…</p>}><SeasonArchive /></Suspense>)}
      </details>
    </div>
  );
}
