import { creators } from '../data/players';
import { Button } from '../components/ui/Button';
import { AppLink } from '../components/ui/AppLink';
import { PlayerPortrait } from '../components/ui/PlayerPortrait';

export function ContentPage() {
  return <section id="content-creators" className="creator-page" aria-labelledby="content-title"><div className="shell">
    <div className="page-heading creator-heading"><div><span className="section-kicker">SHUSH / Creators</span><h1 id="content-title">Vídeos e<br /><span>transmissões.</span></h1></div></div>
    <div className="creator-features">{creators.map((creator, index) => {
      const twitch = creator.creatorType === 'twitch';
      const platform = twitch ? 'Twitch' : 'YouTube';
      return <article key={creator.id} className={`creator-feature is-${creator.creatorType}`} aria-labelledby={`creator-${creator.id}`}>
        <div className="creator-art"><PlayerPortrait player={creator} decorative eager={index === 0} sizes="(max-width: 767px) 100vw, 50vw" /></div>
        <div className="creator-feature-copy"><span className="platform-label">{platform}</span><h2 id={`creator-${creator.id}`}>{creator.displayName}</h2><p className="creator-handle">{twitch ? 'kandimba13' : '@Th0maaz_7'}</p><Button className="creator-channel" href={creator.creatorUrl!} target="_blank" rel="noopener noreferrer">Abrir {platform}</Button><AppLink className="editorial-link" href={`/esports/valorant/roster?player=${creator.id}`}>Conhecer o jogador ↗</AppLink></div>
      </article>;
    })}</div>
  </div></section>;
}
