import { creators, players } from '../../data/players';
import { activePremierSeason as season } from '../../data/season';
import { calculatePremierScore, calculatePublicMatchDayState, formatDate } from '../../lib/premier';
import { usePremierClock } from '../../lib/use-premier-clock';
import { Button } from '../ui/Button';
import { AppLink } from '../ui/AppLink';

export function HomeHub() {
  const state = calculatePublicMatchDayState(season, usePremierClock());
  const score = calculatePremierScore(season);
  const last = season.results[season.results.length - 1];
  return (
    <div className="home-editorial">
      <section id="match-day" className="shell home-competition" aria-labelledby="home-premier-title">
        <div className="section-index"><span className="section-kicker">01 / Competitivo</span><span className="mono">Junho — Julho 2026</span></div>
        <div className="home-competition-grid">
          <div><h2 id="home-premier-title">Os rounds<br />ficam aqui.</h2><p className="body-copy">{season.name}. {state.detail}</p><Button href="/esports/valorant/premier" variant="secondary">Abrir Match Center</Button></div>
          <div className="home-score"><span className="mono">Pontuação publicada</span><strong>{score}<small> / {season.qualificationPoints}</small></strong><span className="state-label">{state.title}</span></div>
        </div>
        {last ? <div className="home-result"><span className="mono">Último resultado publicado</span><span><time dateTime={last.date}>{formatDate(last.date)}</time> / {last.map}</span><strong>SHUSH <span>{last.shushScore} : {last.opponentScore}</span></strong><small>Adversário não publicado</small></div> : null}
      </section>
      <section className="home-roster" aria-labelledby="home-roster-title">
        <div className="shell"><div className="section-index"><span className="section-kicker">02 / Roster</span><span className="mono">{players.length} jogadores</span></div><div className="section-heading"><h2 id="home-roster-title">Quem entra<br />no lobby.</h2><AppLink className="editorial-link" href="/esports/valorant/roster">Ver roster <span aria-hidden="true">↗</span></AppLink></div>
          <div className="home-player-rail" aria-label="Jogadores SHUSH">
            {players.map((player) => <AppLink key={player.id} href={`/esports/valorant/roster?player=${player.id}`} className="home-player" aria-label={`Conhecer ${player.displayName}`}><div className="home-player-image">{player.avatar ? <img src={player.avatar} alt="" width="768" height="768" loading="lazy" decoding="async" /> : <span className="initial-art" aria-hidden="true">{player.initials}</span>}<span className="mono">{player.number}</span></div><span className="home-player-name">{player.displayName}<span aria-hidden="true">↗</span></span><small>{player.roles[0]}</small></AppLink>)}
          </div>
        </div>
      </section>
      <section id="creator-pulse" className="shell home-creators" aria-labelledby="home-creators-title"><div className="section-index"><span className="section-kicker">03 / Creators</span><span className="mono">Fora do servidor</span></div><div className="section-heading"><h2 id="home-creators-title">Outro canal.<br />A mesma SHUSH.</h2><AppLink className="editorial-link" href="/content">Ver creators <span aria-hidden="true">↗</span></AppLink></div><div className="home-channel-list">{creators.map((creator) => <a key={creator.id} href={creator.creatorUrl} target="_blank" rel="noopener noreferrer" className={`home-channel is-${creator.creatorType}`}><span className="mono">{creator.creatorType === 'twitch' ? 'Twitch' : 'YouTube'}</span><strong>{creator.displayName}</strong><span className="channel-destination">Abrir canal <span aria-hidden="true">↗</span></span></a>)}</div></section>
      <section className="home-drop" aria-labelledby="home-drop-title"><div className="shell home-drop-grid"><div className="home-drop-copy"><span className="section-kicker">04 / Drop 01</span><h2 id="home-drop-title">Preto.<br />Roxo.<br /><span>O teu nick.</span></h2><p className="body-copy">A identidade da SHUSH, na tua camisola.</p><Button href="/products/jersey">Criar a minha versão</Button></div><div className="home-drop-image"><span className="home-drop-watermark" aria-hidden="true">01</span><img src="/assets/jersey/backjersey.webp" width="1254" height="1254" alt="Verso da jersey SHUSH Drop 01" loading="lazy" decoding="async" /></div></div></section>
    </div>
  );
}
