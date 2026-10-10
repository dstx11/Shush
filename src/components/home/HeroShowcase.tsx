import { AppLink } from '../ui/AppLink';
import { Button } from '../ui/Button';
import { players } from '../../data/players';

const coverPlayers = ['lyel', 'dstx', 'catty'].map(id => players.find(player => player.id === id)!);
export function HeroShowcase() {
  return <section id="top" className="opening team-opening" aria-labelledby="hero-title">
    <div className="shell opening-grid">
      <div className="opening-label"><span className="section-kicker">SHUSH / VALORANT + CREATORS</span></div>
      <div className="opening-copy">
        <span className="hero-wordmark" aria-hidden="true">SHUSH</span>
        <h1 id="hero-title" className="hero-copy-enter"><span>Sem barulho.</span> <span className="opening-accent">Só rounds.</span></h1>

        <div className="action-row"><Button href="/esports/valorant/roster">Conhecer o roster</Button><Button href="/esports/valorant/premier" variant="secondary">Match Center</Button></div>

      </div>
      <div className="team-cover" aria-label="Jogadores da SHUSH">
        {coverPlayers.map((player, index) => <AppLink className={`team-cover-player cover-${index}`} key={player.id} href={`/esports/valorant/roster?player=${player.id}`} aria-label={`Conhecer ${player.displayName}`}><img src={player.avatar} alt="" width="768" height="768" fetchPriority={index === 1 ? 'high' : 'auto'} decoding="async" /><span><small>{player.number} / {player.roles[0]}</small><strong>{player.displayName}</strong><i aria-hidden="true">↗</i></span></AppLink>)}

      </div>
      <div className="opening-foot"><span className="mono">VALORANT · EQUIPA · COMUNIDADE</span><a className="editorial-link" href="#home-roster-title">Explorar a SHUSH <span aria-hidden="true">↓</span></a></div>
    </div>
  </section>;
}
