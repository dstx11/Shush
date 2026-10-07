import { motion, useReducedMotion } from 'motion/react';
import { ExternalLink } from 'lucide-react';
import { creators } from '../../data/players';

export function AboutSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="about" className="about-section audit-about scroll-mt-28 px-5 pb-28 pt-36">
      <motion.div
        className="about-shell"
        initial={reduceMotion ? false : { opacity: 0, y: 20 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-12%' }}
        transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="audit-about-intro">
          <span className="section-kicker">About / SHUSH</span>
          <h1>Pequena por escala. Clara por identidade.</h1>
          <p>A SHUSH junta um grupo de jogadores, Valorant Premier, creators e uma identidade visual própria. O site existe para mostrar isso com clareza — sem inventar dimensão, resultados ou história.</p>
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
            <p>Conteúdo ligado diretamente aos canais oficiais, sem páginas vazias a fingir catálogo.</p>
            <div className="audit-creator-links">
              {creators.map((creator) => (
                <a key={creator.id} href={creator.creatorUrl} target="_blank" rel="noreferrer">
                  {creator.displayName}<ExternalLink aria-hidden="true" className="h-4 w-4" />
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
          <ExternalLink aria-hidden="true" className="h-5 w-5" />
        </a>
      </motion.div>
    </section>
  );
}
