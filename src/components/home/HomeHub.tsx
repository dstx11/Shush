import { AppLink } from '../ui/AppLink';

export function HomeHub() {
  return <section className="home-discover shell" id="discover" aria-labelledby="discover-title">
    <div className="section-index"><h2 id="discover-title">Dentro da SHUSH.</h2><span className="mono">Escolhe o teu caminho</span></div>
    <div className="discovery-grid">
      <AppLink href="/esports/valorant/roster" className="discovery-roster"><span className="mono">01 / A equipa</span><strong>Sete identidades.<br />O mesmo nome.</strong><span className="discovery-mark" aria-hidden="true">07</span><span>Entrar no Roster ↗</span></AppLink>
      <AppLink href="/esports/valorant/premier" className="discovery-premier"><span className="mono">02 / Competição</span><strong>Match Center</strong><span className="round-lines" aria-hidden="true"><i /><i /><i /><i /><i /></span><span>Explorar partidas ↗</span></AppLink>
      <AppLink href="/content" className="discovery-creators"><span className="mono">03 / Twitch + YouTube</span><strong>Creators</strong><span className="play-mark" aria-hidden="true">▷</span><span>Abrir canais ↗</span></AppLink>
      <AppLink href="/products/jersey" className="discovery-drop"><span className="mono">04 / Drop 01</span><strong>O teu nick.<br />A nossa camisola.</strong><span>Personalizar ↗</span></AppLink>
      <AppLink href="/company" className="discovery-company"><span className="mono">05 / Company</span><strong>De onde vimos.</strong><span>Conhecer a SHUSH ↗</span></AppLink>
    </div>
  </section>;
}
