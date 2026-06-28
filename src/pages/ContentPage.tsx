import { ExternalLink } from 'lucide-react';
import { creators } from '../data/players';

export function ContentPage() {
  return (
    <section className="content-page px-5 pb-24 pt-36" aria-labelledby="content-title">
      <div className="page-shell">
        <span className="section-kicker">Content</span>
        <h1 id="content-title">More e Th0maz7.</h1>
        <p>Entertainment da SHUSH com links manuais. Sem live detection, sem API e sem embeds pesados nesta fase.</p>

        <div className="creator-grid">
          {creators.map((creator) => (
            <a key={creator.id} href={creator.creatorUrl} target="_blank" rel="noreferrer" className="creator-card">
              <span>{creator.creatorType === 'twitch' ? 'Twitch creator' : 'YouTube creator'}</span>
              <strong>{creator.displayName}</strong>
              <ExternalLink aria-hidden="true" className="h-5 w-5" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
