import { creators } from '../../data/players';

export function AboutSection() {
  return (
    <section id="about" className="about-section audit-about scroll-mt-28 px-5 pb-28 pt-36">
      <div className="about-shell css-reveal">
        <div className="audit-about-intro">
          <span className="section-kicker">About / SHUSH</span>
          <h1>Competição, conteúdo e identidade.</h1>
          <p>A SHUSH junta Valorant Premier, creators e uma identidade visual própria. Competição, conteúdo e produto com a mesma linguagem.</p>
          <strong>Sem barulho. Só rounds.</strong>
        </div>

        <div className="audit-about-grid">
          <article>
            <span>01</span>
            <h2>Competitivo</h2>
            <p>Premier e roster apresentados a partir dos dados que a equipa realmente publica.</p>
          </article>
          <article>
            <span>02</span>
            <h2>Creators</h2>
            <p>Conteúdo ligado diretamente aos canais oficiais dos creators da SHUSH.</p>
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
            <p>A jersey é o primeiro produto visível da SHUSH, com personalização preparada para pedido manual.</p>
          </article>
        </div>

        <a id="partners" href="https://backora.org/" target="_blank" rel="noreferrer" className="audit-partner scroll-mt-28">
          <span>
            <small>Technical / digital partner</small>
            <strong>Backora</strong>
          </span>
          <p>Estrutura web e suporte técnico da SHUSH.</p>
          <img src="/assets/brand/backora-logo.png" width="320" height="293" alt="Backora" loading="lazy" decoding="async" />
          <span aria-hidden="true">↗</span>
        </a>
      </div>
    </section>
  );
}
