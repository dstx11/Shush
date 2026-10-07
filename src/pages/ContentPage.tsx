import { ExternalLink } from 'lucide-react';
import { Reveal } from '../components/ui/Reveal';
import { creators } from '../data/players';

export function ContentPage() {
  return (
    <section id="content-creators" className="audit-content-page px-5 pb-28 pt-36" aria-labelledby="content-title">
      <div className="audit-page-shell">
        <Reveal className="audit-content-head">
          <span className="section-kicker">Creators / SHUSH</span>
          <h1 id="content-title">Conteúdo sem intermediários.</h1>
          <p>Os canais oficiais dos creators ligados à SHUSH, com acesso direto à Twitch e ao YouTube.</p>
        </Reveal>

        <div className="audit-creator-grid">
          {creators.map((creator, index) => (
            <Reveal key={creator.id} delay={index * 0.06}>
              <a
                href={creator.creatorUrl}
                target="_blank"
                rel="noreferrer"
                className={`audit-creator-card is-${creator.creatorType}`}
              >
                <div className="audit-creator-visual">
                  {creator.avatar ? (
                    <img src={creator.avatar} alt="" width="768" height="768" loading="eager" decoding="async" />
                  ) : (
                    <span>{creator.initials}</span>
                  )}
                </div>
                <div className="audit-creator-copy">
                  <span>{creator.creatorType === 'twitch' ? 'Twitch' : 'YouTube'}</span>
                  <h2>{creator.displayName}</h2>
                  <p>{creator.quote}</p>
                  <strong>
                    Abrir canal oficial
                    <ExternalLink aria-hidden="true" className="h-4 w-4" />
                  </strong>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
