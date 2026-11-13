import '../../styles/signal-v3.css';
import {AppLink} from '../ui/AppLink';
import {ArrowIcon} from '../ui/ArrowIcon';
import {players} from '../../data/players';
import {verifiedMatches} from '../../data/verified-matches';

const chapters=[
 {number:'01',index:'THE ORIGIN',title:'Começou pelo contrário.',body:'Em 2022, uma ideia entre amigos ganhou identidade própria. O nome ficou. O que fazemos com ele continua a mudar.',href:'/company',action:'Conhecer a origem'},
 {number:'02',index:'THE PEOPLE',title:'Sete maneiras de entrar no round.',body:'Não somos todos iguais a jogar, nem precisamos de ser. O roster é feito das pessoas que aparecem quando é preciso mais uma.',href:'/esports/valorant/roster',action:'Descobrir o roster'},
 {number:'03',index:'THE RECORD',title:'O resultado não precisa de efeitos.',body:'Um arquivo de partidas reais, com mapas, adversários e datas de verificação. A competição fala por si.',href:'/esports/valorant/premier#verified-results',action:'Explorar partidas'}
] as const;

export function SignalSection(){
 return <section className="shell shush-signals motion-section" aria-labelledby="shush-signals-title">
  <div className="shush-signals-heading">
   <div><span className="section-kicker">SHUSH / ENTRE ROUNDS</span><h2 id="shush-signals-title">O servidor fecha.<br/><em>O grupo fica.</em></h2></div>
   <div className="shush-signals-story"><p>Uma chamada no Discord. Uma equipa para entrar no servidor. A conversa que continua depois da última partida.</p><AppLink href="/company" className="editorial-link">De onde viemos <ArrowIcon/></AppLink></div>
  </div>
  <div className="shush-signals-line" aria-hidden="true"><span>2022</span><i/><span>SEM BARULHO. SÓ ROUNDS.</span><i/><span>SHUSH</span></div>
  <div className="shush-signal-storyboard">
   <div className="shush-signal-stage" aria-hidden="true">
    <div className="shush-signal-illumination"/>
    <svg viewBox="0 0 600 600" fill="none" className="shush-signal-orbit"><circle cx="300" cy="300" r="248" strokeDasharray="2 14"/><circle cx="300" cy="300" r="178"/><circle cx="300" cy="300" r="107" strokeDasharray="16 16"/><path d="M300 0V96M300 504V600M0 300H96M504 300H600"/></svg>
    <div className="shush-signal-portraits">{players.slice(0,3).map(player=><img key={player.id} src={player.avatar?.replace('.webp','-384.webp')} width="384" height="384" loading="lazy" decoding="async" alt=""/>)}</div>
    <strong>SHUSH<span>;</span></strong>
    <span className="shush-signal-system-label">IDENTITY SIGNAL / EST. 2022</span>
    <span className="shush-signal-system-foot">VALORANT / PORTUGAL</span>
   </div>
   <ol className="shush-signal-chapters">{chapters.map(chapter=><li key={chapter.number}>
    <div className="shush-signal-index"><b>{chapter.number}</b><span>{chapter.index}</span></div>
    <h3>{chapter.title}</h3><p>{chapter.body}</p>
    <AppLink href={chapter.href} className="editorial-link">{chapter.action} <ArrowIcon/></AppLink>
   </li>)}</ol>
  </div>
  <div className="shush-signal-outro"><span>{players.length} jogadores</span><span>{verifiedMatches.length} partidas documentadas</span><span>SHUSH / SEM BARULHO. SÓ ROUNDS.</span></div>
 </section>;
}
