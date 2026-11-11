import { AppLink } from '../ui/AppLink';
import { WinterCardStudio } from './WinterCardStudio';

export function WinterPostcard() {
  return (
    <section className="shell winter-postcard" aria-labelledby="winter-postcard-title">
      <div className="winter-postcard-inner">
        <div className="winter-postcard-content">
          <div className="winter-postcard-eyebrow"><span aria-hidden="true">✳</span> UMA MENSAGEM DO NOSSO LOBBY <span> / DEZEMBRO 2026</span></div>
          <h2 id="winter-postcard-title">Que nunca faltem<br /><em>bons rounds.</em><br />E boas pessoas.</h2>
          <p>Nem tudo se conta em vitórias. Há calls que viram memórias, risos que ficam depois do jogo e amigos que fazem de qualquer servidor um sítio especial. Boas festas, da SHUSH.</p>
          <WinterCardStudio />
          <AppLink href="/company" className="winter-postcard-link">Conhece a nossa história <span aria-hidden="true">↗</span></AppLink>
          <span className="winter-postcard-signature">WITH LOVE, SHUSH <span aria-hidden="true">✦</span></span>
        </div>
        <div className="winter-postcard-art" aria-hidden="true">
          <span className="winter-postcard-star">✳</span>
          <span className="winter-postcard-ornament winter-postcard-ornament-a"><i /></span>
          <span className="winter-postcard-ornament winter-postcard-ornament-b"><i /></span>
          <span className="winter-postcard-ornament winter-postcard-ornament-c"><i /></span>
          <span className="winter-postcard-glow" />
          <span className="winter-postcard-line">MERRY &amp; BRIGHT</span>
          <span className="winter-postcard-shush">SHUSH</span>
        </div>
      </div>
    </section>
  );
}
