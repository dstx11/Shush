import { ExternalLink } from 'lucide-react';
import { creators } from '../../data/players';

export function CreatorsPulse() {
  return (
    <section className="pulse-section px-5 py-20" aria-labelledby="creators-title">
      <div className="pulse-shell">
        <div>
          <span className="section-kicker">Content creators</span>
          <h2 id="creators-title">More e Th0maz7.</h2>
        </div>
        <div className="pulse-links">
          {creators.map((creator) => (
            <a key={creator.id} href={creator.creatorUrl} target="_blank" rel="noreferrer">
              <span>{creator.displayName}</span>
              <strong>{creator.creatorType === 'twitch' ? 'Twitch' : 'YouTube'}</strong>
              <ExternalLink aria-hidden="true" className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
