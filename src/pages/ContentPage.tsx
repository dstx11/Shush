import { SceneLight } from '../components/motion/SceneLight';
import '../styles/creators.css';
import { ArrowIcon } from '../components/ui/ArrowIcon';
import { creators } from '../data/players';
import { Button } from '../components/ui/Button';
import { AppLink } from '../components/ui/AppLink';
import { ChannelPortrait } from '../components/ui/ChannelPortrait';

export function ContentPage() {
  return <section id="content-creators" className="creator-page" aria-labelledby="content-title">
    <div className="shell">
      <header className="creator-editorial-heading">
        <span className="section-kicker">SHUSH / TWITCH &amp; YOUTUBE</span>
        <h1 id="content-title">Creators.</h1>
        <div className="creator-heading-foot"><p>Duas vozes da SHUSH fora do servidor.</p><nav aria-label="Escolher creator">{creators.map(creator => <a key={creator.id} href={`#creator-${creator.id}`}>{creator.displayName}<span aria-hidden="true">↓</span></a>)}</nav></div>
      </header>
      <div className="creator-features">{creators.map((creator, index) => {
        const twitch = creator.creatorType === 'twitch';
        const platform = twitch ? 'Twitch' : 'YouTube';
        return <article key={creator.id} className="creator-feature" data-channel={creator.creatorType} id={`creator-${creator.id}`} aria-labelledby={`creator-title-${creator.id}`}>
          <div className="creator-art"><ChannelPortrait player={creator} eager={index === 0} sizes="(max-width: 767px) 100vw, 48vw"><SceneLight material="rays" /></ChannelPortrait></div>
          <div className="creator-feature-copy">
            <div className="creator-file-label"><span>{platform}</span><span>{creator.creatorHandle}</span></div>
            <h2 id={`creator-title-${creator.id}`}>{creator.displayName}</h2>
            <p className="creator-description">{twitch ? 'A conversa acontece no chat. Acompanha as transmissões do More e vê no canal quando está em direto.' : 'O jogo continua depois do último round. Explora os vídeos do Th0maz e acompanha as próximas publicações.'}</p>
            <div className="creator-channel-actions"><Button className="creator-channel" href={creator.creatorUrl!} target="_blank" rel="noopener noreferrer">Abrir {platform}</Button><AppLink className="editorial-link" href={`/esports/valorant/roster?player=${creator.id}`}>Conhecer o jogador <ArrowIcon /></AppLink></div>
          </div>
        </article>;
      })}</div>

    </div>
  </section>;
}
