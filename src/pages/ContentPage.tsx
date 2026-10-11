import { creators } from '../data/players';
import { Button } from '../components/ui/Button';

export function ContentPage() {
  return <section id="content-creators" className="creator-page" aria-labelledby="content-title"><div className="shell">
    <div className="page-heading creator-heading"><div><span className="section-kicker">SHUSH / Creators</span><h1 id="content-title">Outra forma<br /><span>de jogar.</span></h1></div></div>
    <div className="creator-features">{creators.map((creator, index) => {
      const twitch = creator.creatorType === 'twitch';
      const platform = twitch ? 'Twitch' : 'YouTube';
      return <article key={creator.id} className={`creator-feature is-${creator.creatorType}`} aria-labelledby={`creator-${creator.id}`}>
        <div className="creator-feature-meta"><span className="mono">0{index + 1} / {platform}</span><span className="mono">SHUSH / Creators</span></div>
        <div className="creator-art" aria-hidden="true"><div className="creator-lettering"><span>{twitch ? 'ON' : 'PLAY'}</span><svg className="platform-symbol" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2">{twitch ? <><path d="M8 6h34v25L30 42H20v-7H8z"/><path d="M24 14v12m9-12v12"/></> : <><rect x="3" y="9" width="42" height="30" rx="9"/><path d="m20 17 12 7-12 7z"/></>}</svg><span className="creator-frequency">SHUSH / {platform.toUpperCase()}</span></div></div>
        <div className="creator-feature-copy"><span className="platform-label">{platform}</span><h2 id={`creator-${creator.id}`}>{creator.displayName}</h2><p className="creator-handle">{twitch ? 'kandimba13' : '@Th0maaz_7'}</p><Button className="creator-channel" href={creator.creatorUrl!} target="_blank" rel="noopener noreferrer">Abrir {platform}</Button></div>
      </article>;
    })}</div>
  </div></section>;
}
