import { creators } from '../data/players';
import { AppLink } from '../components/ui/AppLink';
import { Button } from '../components/ui/Button';

export function ContentPage() {
  return (
    <section id="content-creators" className="creator-page" aria-labelledby="content-title">
      <div className="shell">
        <div className="page-heading creator-heading"><div><span className="section-kicker">SHUSH / Creators</span><h1 id="content-title">Fora do<br /><span>servidor.</span></h1></div></div>
        <div className="creator-features">
          {creators.map((creator, index) => {
            const platform = creator.creatorType === 'twitch' ? 'Twitch' : 'YouTube';
            return <article key={creator.id} className={`creator-feature is-${creator.creatorType}`} aria-labelledby={`creator-${creator.id}`}>
              <div className="creator-feature-meta"><span className="mono">0{index + 1} / {platform}</span><span className="mono">SHUSH / Creator + Player</span></div>
              <div className="creator-art">
                {creator.avatar ? <img src={creator.avatar} alt={`Avatar de ${creator.displayName}`} width="768" height="768" loading="lazy" decoding="async" /> : <div className="creator-lettering" aria-hidden="true"><span>{creator.initials}</span><span className="lettering-line" /></div>}
                <span className="creator-number mono" aria-hidden="true">SHS / {creator.number}</span>
              </div>
              <div className="creator-feature-copy">
                <span className="platform-label"><span aria-hidden="true">{creator.creatorType === 'twitch' ? '◧' : '▷'}</span> Canal {platform}</span>
                <h2 id={`creator-${creator.id}`}>{creator.displayName}</h2>
                <div className="creator-player-context"><span className="mono">Também no roster</span><p>{creator.roles.join(' / ')}</p></div>
                <Button className="creator-channel" href={creator.creatorUrl!} target="_blank" rel="noopener noreferrer">Abrir {platform}</Button>
                <AppLink className="editorial-link creator-roster" href={`/esports/valorant/roster?player=${creator.id}`}>Conhecer no roster <span aria-hidden="true">↗</span></AppLink>
              </div>
            </article>;
          })}
        </div>

      </div>
    </section>
  );
}
