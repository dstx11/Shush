import { AppLink } from '../ui/AppLink';
import { Button } from '../ui/Button';
import { players } from '../../data/players';

export function HeroShowcase() {
  const featured = players.filter((player) => player.avatar).slice(0, 3);
  return (
    <section id="top" className="opening opening-next" aria-labelledby="hero-title">
      <div className="shell opening-grid">
        <div className="opening-label"><span className="section-kicker">SHUSH / VALORANT + CREATORS</span><span className="mono">O coletivo por trás dos rounds.</span></div>
        <div className="opening-copy">
          <p className="opening-eyebrow">AQUI JOGA-SE EM EQUIPA.</p>
          <h1 id="hero-title" className="hero-copy-enter"><span>Sem barulho.</span><span className="opening-accent">Só rounds.</span></h1>
          <p>Uma equipa de VALORANT, pessoas reais e uma identidade que não fica no servidor.</p>
          <div className="action-row">
            <Button href="/esports/valorant/roster">Conhecer os jogadores</Button>
            <Button href="/esports/valorant/premier" variant="secondary">Últimas partidas</Button>
          </div>
          <AppLink className="opening-team" href="/esports/valorant/roster">
            <span className="opening-faces" aria-hidden="true">{players.filter((player) => player.avatar).slice(0, 4).map((player) => <img key={player.id} src={player.avatar} alt="" width="768" height="768" decoding="async" />)}</span>
            <span><strong>7 jogadores. Uma equipa.</strong><small>Descobre quem está deste lado do ecrã ↗</small></span>
          </AppLink>
        </div>
        <div className="opening-squad" aria-label="Destaque de jogadores da SHUSH">
          <div className="opening-squad-top"><span className="section-kicker">PLAYER SELECT / SHUSH</span><span className="mono">01 — 07</span></div>
          <div className="opening-squad-art">
            {featured.map((player, index) => <AppLink key={player.id} href={`/esports/valorant/roster?player=${player.id}`} className={`opening-squad-player is-${index}`} aria-label={`Conhecer ${player.displayName}`}>
              <img src={player.avatar} alt="" width="768" height="768" decoding="async" fetchPriority={index === 1 ? 'high' : 'auto'} />
              <span className="opening-squad-number">{player.number}</span><strong>{player.displayName}</strong>
            </AppLink>)}
          </div>
          <div className="opening-squad-bottom"><span className="mono">PESSOAS PRIMEIRO. JOGO SEMPRE.</span><AppLink className="editorial-link" href="/esports/valorant/roster">Explorar roster ↗</AppLink></div>
        </div>
        <div className="opening-foot"><span className="mono">SHUSH / Uma identidade, dentro e fora do jogo.</span><a className="editorial-link" href="#home-roster-title">Explorar <span aria-hidden="true">↓</span></a></div>
      </div>
    </section>
  );
}
