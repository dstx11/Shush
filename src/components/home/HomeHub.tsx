import { creators, players } from '../../data/players';
import { AppLink } from '../ui/AppLink';
import { HomePlayerRail } from './HomePlayerRail';
import { RecentMatches } from '../competition/RecentMatches';

export function HomeHub() {
  return (
    <div className="home-editorial home-editorial-next">
      <section className="home-roster" aria-labelledby="home-roster-title">
        <div className="shell">
          <div className="section-index"><span className="section-kicker">01 / O COLETIVO</span><span className="mono">VALORANT · {players.length} JOGADORES</span></div>
          <div className="section-heading"><div><h2 id="home-roster-title">Conhece quem<br /><span>faz a SHUSH.</span></h2><p className="body-copy">Sete personalidades. Diferentes maneiras de jogar. O mesmo lado do servidor.</p></div><AppLink className="editorial-link" href="/esports/valorant/roster">Escolher jogador <span aria-hidden="true">↗</span></AppLink></div>
          <HomePlayerRail />
        </div>
      </section>
      <section id="match-day" className="home-competition" aria-label="Partidas recentes">
        <div className="shell"><div className="section-index"><span className="section-kicker">02 / COMPETIÇÃO</span><span className="mono">RESULTADOS VERIFICADOS · PREMIER</span></div><RecentMatches compact /></div>
      </section>
      <section id="creator-pulse" className="home-creators" aria-labelledby="home-creators-title">
        <div className="shell">
          <div className="section-index"><span className="section-kicker">03 / FORA DO SERVIDOR</span><span className="mono">TWITCH + YOUTUBE</span></div>
          <div className="section-heading"><h2 id="home-creators-title">A equipa não acaba<br /><span>no último round.</span></h2><AppLink className="editorial-link" href="/content">Descobrir creators <span aria-hidden="true">↗</span></AppLink></div>
          <div className="home-channel-list">{creators.map((creator) => <a key={creator.id} href={creator.creatorUrl} target="_blank" rel="noopener noreferrer" className={`home-channel is-${creator.creatorType}`}><div className="home-channel-art" aria-hidden="true">{creator.avatar ? <img src={creator.avatar} alt="" width="768" height="768" loading="lazy" decoding="async" /> : <span>{creator.initials}</span>}</div><div className="home-channel-copy"><span className="platform-name">{creator.creatorType === 'twitch' ? 'Twitch' : 'YouTube'}</span><strong>{creator.displayName}</strong><span className="channel-destination">Abrir canal <span aria-hidden="true">↗</span></span></div></a>)}</div>
          <div className="home-ending"><span className="section-kicker">SHUSH / DROP 01</span><p>Uma identidade para além do jogo.</p><AppLink className="editorial-link" href="/products/jersey">Conhecer o Drop 01 <span aria-hidden="true">↗</span></AppLink></div>
        </div>
      </section>
    </div>
  );
}
