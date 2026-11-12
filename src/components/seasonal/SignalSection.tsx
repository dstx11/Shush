import '../../styles/signal-v3.css';
import {AppLink} from '../ui/AppLink';
import {ArrowIcon} from '../ui/ArrowIcon';
import {creators, players} from '../../data/players';
import {verifiedMatches} from '../../data/verified-matches';
import {PlayerPortrait} from '../ui/PlayerPortrait';

/** Brand material sourced from real roster, match data and repository assets. */
export function SignalSection(){
 return <section className="shell shush-signals motion-section" aria-labelledby="shush-signals-title">
  <div className="shush-signals-heading">
   <div><span className="section-kicker">SHUSH / POR DENTRO</span><h2 id="shush-signals-title">Há mais por trás<br/><em>de cada round.</em></h2></div>
   <p>Começou entre amigos. Hoje, o mesmo nome reúne uma equipa de VALORANT, conteúdos e uma identidade que também existe fora do jogo.</p>
  </div>
  <div className="shush-signals-grid">
   <AppLink className="signal-panel signal-panel-competition" href="/esports/valorant/premier">
    <span className="signal-panel-meta"><span>01 / COMPETIÇÃO</span><span>PREMIER</span></span>
    <div className="signal-panel-target" aria-hidden="true"><svg viewBox="0 0 260 260" fill="none"><circle cx="130" cy="130" r="104"/><circle cx="130" cy="130" r="71"/><circle cx="130" cy="130" r="33"/><path d="M130 6V82 M130 178V254 M6 130H82 M178 130H254"/></svg><b>{String(verifiedMatches.length).padStart(2,'0')}</b></div>
    <div className="signal-panel-caption"><h3>O que fica no registo.</h3><p>{verifiedMatches.length} partidas com resultados publicados e verificados. Sem resultados inventados, nem próximos jogos por confirmar.</p><span>Match Center <ArrowIcon/></span></div>
   </AppLink>
   <AppLink className="signal-panel signal-panel-roster" href="/esports/valorant/roster">
    <span className="signal-panel-meta"><span>02 / ROSTER</span><span>VALORANT</span></span>
    <div className="signal-panel-faces" aria-hidden="true">{players.slice(0,4).map(player=><span key={player.id}><PlayerPortrait player={player} decorative sizes="(max-width:767px) 21vw, 120px"/></span>)}</div>
    <div className="signal-panel-caption"><h3>{String(players.length).padStart(2,'0')} nicks. A mesma tag.</h3><p>A equipa não cabe numa fotografia. Conhece quem joga, o que prefere e o que traz para o lobby.</p><span>Ver os jogadores <ArrowIcon/></span></div>
   </AppLink>
   <AppLink className="signal-panel signal-panel-origin" href="/company">
    <span className="signal-panel-meta"><span>03 / ORIGEM</span><span>EST. 2022</span></span>
    <div className="signal-panel-symbol" aria-hidden="true"><span>;</span><svg viewBox="0 0 320 180" fill="none"><path d="M0 30H320 M0 90H320 M0 150H320 M42 0V180 M160 0V180 M278 0V180"/><circle cx="160" cy="90" r="74"/><circle cx="160" cy="90" r="46"/></svg></div>
    <div className="signal-panel-caption"><h3>O contrário tornou-se nosso.</h3><p>Começou como uma referência a outra organização. Ficou como nome, grupo e história própria.</p><span>A nossa história <ArrowIcon/></span></div>
   </AppLink>
   <AppLink className="signal-panel signal-panel-jersey" href="/products/jersey">
    <span className="signal-panel-meta"><span>04 / DROP 01</span><span>PERSONALIZAÇÃO</span></span>
    <div className="signal-panel-shirt"><span className="signal-shirt-halo" aria-hidden="true"/><img src="/assets/jersey/frontjersey.webp" width="1254" height="1254" alt="Camisola SHUSH Drop 01, vista de frente" loading="lazy" decoding="async"/></div>
    <div className="signal-panel-caption"><h3>Também vestimos a tag.</h3><p>O teu nick e número numa versão da camisola. Pré-visualização e pedido manual, sem checkout fictício.</p><span>Explorar o Drop <ArrowIcon/></span></div>
   </AppLink>
  </div>
  <div className="shush-signals-bottom"><span className="mono">SHUSH / NO SERVIDOR E FORA DELE</span><AppLink href="/content" className="editorial-link">{creators.length} canais criativos da equipa <ArrowIcon/></AppLink></div>
 </section>;
}
