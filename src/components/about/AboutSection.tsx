import { creators } from '../../data/players';
import { AppLink } from '../ui/AppLink';

export function AboutSection() {
  return (
    <section id="about" className="about-section audit-about scroll-mt-28 px-5 pb-28 pt-36" aria-labelledby="about-title">
      <div className="about-shell css-reveal">
        <div className="audit-about-intro">
          <span className="section-kicker">About / SHUSH</span>
          <h1 id="about-title">Uma equipa.<br />A mesma linguagem.</h1>
          <p>Somos uma pequena organização de gaming. Jogamos Valorant Premier, reunimos creators e levamos a nossa identidade para o Drop 01.</p>
          <strong>Sem barulho. Só rounds.</strong>
        </div>

        <div className="audit-about-grid">
          <article>
            <span>01</span>
            <h2>Competitivo</h2>
            <p>Os rounds, o calendário e as pessoas que entram no servidor.</p>
            <AppLink className="editorial-link" href="/esports/valorant/premier">Match Center <span aria-hidden="true">→</span></AppLink>
          </article>
          <article>
            <span>02</span>
            <h2>Creators</h2>
            <p>More e Th0maz7. A SHUSH também se acompanha fora do jogo.</p>
            <div className="audit-creator-links">
              {creators.map((creator) => (
                <a key={creator.id} href={creator.creatorUrl} target="_blank" rel="noreferrer">
                  {creator.displayName}<span aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          </article>
          <article>
            <span>03</span>
            <h2>Drop 01</h2>
            <p>Preto, roxo e o teu nick. A nossa identidade, na tua camisola.</p>
            <AppLink className="editorial-link" href="/products/jersey">Explorar Drop 01 <span aria-hidden="true">→</span></AppLink>
          </article>
        </div>

        <a id="partners" href="https://backora.org/" target="_blank" rel="noreferrer" className="audit-partner scroll-mt-28">
          <span>
            <small>Parceiro técnico / digital</small>
            <strong>Backora</strong>
          </span>
          <p>Estrutura web e suporte técnico da SHUSH.</p>
          <img src="/assets/brand/backora-logo.png" width="320" height="293" alt="" loading="lazy" decoding="async" />
          <span aria-hidden="true">↗</span>
        </a>
      </div>
    </section>
  );
}
