import { Reveal } from '../components/ui/Reveal';
import { creators } from '../data/players';
import { AppLink } from '../components/ui/AppLink';

export function ContentPage() {
  return (
    <section id="content-creators" className="audit-content-page px-5 pb-28 pt-36" aria-labelledby="content-title">
      <div className="audit-page-shell">
        <Reveal className="audit-content-head">
          <span className="section-kicker">Creators / SHUSH</span>
          <h1 id="content-title">Fora do servidor.</h1>
          <p>More na Twitch. Th0maz7 no YouTube.<br />Escolhe um canal e acompanha de perto.</p>
        </Reveal>

        <div className="audit-creator-grid">
          {creators.map((creator, index) => (
            <Reveal key={creator.id} delay={index * 0.06}>
              <article className="audit-creator-card" aria-labelledby={`creator-${creator.id}`}>
                <div className="audit-creator-visual">
                  {creator.avatar ? (
                    <img src={creator.avatar} alt={`Avatar de ${creator.displayName}`} width="768" height="768" loading="eager" decoding="async" />
                  ) : (
                    <span aria-hidden="true">{creator.initials}</span>
                  )}
                </div>
                <div className="audit-creator-copy">
                  <span>{creator.creatorType === 'twitch' ? 'Twitch' : 'YouTube'}</span>
                  <h2 id={`creator-${creator.id}`}>{creator.displayName}</h2>
                  <p>{creator.roles.join(' / ')}</p>
                  <a className="editorial-link creator-channel" href={creator.creatorUrl} target="_blank" rel="noreferrer">
                    Abrir {creator.creatorType === 'twitch' ? 'Twitch' : 'YouTube'}
                    <span aria-hidden="true">↗</span>
                  </a>
                  <AppLink className="editorial-link creator-roster" href={`/esports/valorant/roster?player=${creator.id}`}>Conhecer no roster <span aria-hidden="true">→</span></AppLink>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
