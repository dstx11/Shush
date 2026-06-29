import { ExternalLink } from 'lucide-react';
import { SectionBreadcrumb, SignalBars } from '../components/motion/MotionPrimitives';
import { Reveal } from '../components/ui/Reveal';
import { creators } from '../data/players';

export function ContentPage() {
  return (
    <section id="content-creators" className="content-page scroll-mt-28 px-5 pb-24 pt-36" aria-labelledby="content-title">
      <div className="page-shell">
        <Reveal>
          <SectionBreadcrumb items={['Content']} />
          <span className="section-kicker">Content Creators</span>
          <h1 id="content-title">More e Th0maz7.</h1>
          <p>Links oficiais dos creators da SHUSH. More na Twitch, Th0maz7 no YouTube.</p>
        </Reveal>

        <div className="creator-grid">
          {creators.map((creator, index) => (
            <Reveal
              key={creator.id}
              id={creator.creatorType === 'twitch' ? 'more-twitch' : 'th0maz7-youtube'}
              as="a"
              href={creator.id === 'more' ? '/content/more' : '/content/th0maz7'}
              className="creator-card scroll-mt-28"
              delay={index * 0.08}
            >
              <SignalBars className={creator.creatorType === 'twitch' ? 'is-twitch' : 'is-youtube'} />
              <span>{creator.creatorType === 'twitch' ? 'Twitch' : 'YouTube'}</span>
              <strong>{creator.displayName}</strong>
              <small>Abrir canal oficial</small>
              <ExternalLink aria-hidden="true" className="h-5 w-5" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
