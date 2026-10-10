import { creators, players } from '../../data/players';
import { activePremierSeason as season } from '../../data/season';
import { calculatePremierScore, calculatePublicMatchDayState, formatDate } from '../../lib/premier';
import { usePremierClock } from '../../lib/use-premier-clock';
import { Button } from '../ui/Button';
import { AppLink } from '../ui/AppLink';
import { HomePlayerRail } from './HomePlayerRail';

export function HomeHub() {
  const state = calculatePublicMatchDayState(season, usePremierClock());
  const score = calculatePremierScore(season);
  const last = season.results[season.results.length - 1];
  const lastDay = season.weeks.flatMap(week => week.selectedDays.map(day => ({ week, day }))).find(item => last && item.day.date === last.date && item.week.map === last.map);
  return (
    <div className="home-editorial">
      <section className="home-roster" aria-labelledby="home-roster-title">
        <div className="shell">
          <div className="section-index"><span className="section-kicker">01 / A equipa</span><span className="mono">Valorant · {players.length} jogadores</span></div>
          <div className="section-heading"><div><h2 id="home-roster-title">Nomes diferentes.<br /><span>A mesma SHUSH.</span></h2><p className="body-copy">Quem joga, quem cria, quem entra contigo no lobby.</p></div><AppLink className="editorial-link" href="/esports/valorant/roster">Conhecer o roster <span aria-hidden="true">↗</span></AppLink></div>
          <HomePlayerRail />
        </div>
      </section>
      <section id="creator-pulse" className="home-creators" aria-labelledby="home-creators-title">
        <div className="shell">
          <div className="section-index"><span className="section-kicker">02 / Creators</span><span className="mono">Twitch + YouTube</span></div>
          <div className="section-heading"><h2 id="home-creators-title">O round acaba.<br /><span>O canal continua.</span></h2><AppLink className="editorial-link" href="/content">Ver creators <span aria-hidden="true">↗</span></AppLink></div>
          <div className="home-channel-list">{creators.map((creator) => <a key={creator.id} href={creator.creatorUrl} target="_blank" rel="noopener noreferrer" className={`home-channel is-${creator.creatorType}`}><div className="home-channel-art" aria-hidden="true">{creator.avatar ? <img src={creator.avatar} alt="" width="768" height="768" loading="lazy" decoding="async" /> : <span>{creator.initials}</span>}</div><div className="home-channel-copy"><span className="platform-name">{creator.creatorType === 'twitch' ? 'Twitch' : 'YouTube'}</span><strong>{creator.displayName}</strong><span className="channel-destination">Abrir canal <span aria-hidden="true">↗</span></span></div></a>)}</div>
        </div>
      </section>
      <section id="match-day" className="home-competition" aria-labelledby="home-premier-title">
        <div className="shell home-archive">
          <div className="archive-intro"><span className="section-kicker">03 / Premier · Junho — Julho 2026</span><h2 id="home-premier-title">Os rounds<br />ficam no registo.</h2><p className="body-copy">{state.detail}</p><Button href="/esports/valorant/premier" variant="secondary">Abrir Match Center</Button>{lastDay ? <AppLink className="editorial-link" href={`/?matchday=${lastDay.day.id}#top`}>Rever Matchday · {lastDay.week.map} ↗</AppLink> : null}</div>
          <div className="archive-record"><div className="home-score"><span className="mono">Pontuação publicada · {season.name}</span><strong>{score}<small> / {season.qualificationPoints}</small></strong><span className="state-label">{state.title}</span></div>{last ? <div className="home-result"><span className="mono">Último resultado publicado</span><time dateTime={last.date}>{formatDate(last.date)} / {last.map}</time><strong>SHUSH <span>{last.shushScore} : {last.opponentScore}</span></strong><small>Adversário não publicado</small></div> : null}</div>
        </div>
      </section>
      <section className="home-drop" aria-labelledby="home-drop-title"><div className="shell home-drop-grid"><div className="home-drop-copy"><span className="section-kicker">04 / Drop 01</span><h2 id="home-drop-title">Veste a<br /><span>SHUSH.</span></h2><p className="body-copy">Preto, roxo e o teu nick.<br />A mesma assinatura. A tua versão.</p><Button href="/products/jersey">Personalizar a minha jersey</Button></div><div className="home-drop-image"><img src="/assets/jersey/backjersey.webp" width="1254" height="1254" alt="Verso da jersey SHUSH Drop 01" loading="lazy" decoding="async" /></div></div></section>
    </div>
  );
}
