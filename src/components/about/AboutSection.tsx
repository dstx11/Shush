import { motion, useReducedMotion } from 'framer-motion';
import { Cpu, EyeOff, Gem, Users } from 'lucide-react';

const principles = [
  {
    icon: EyeOff,
    title: 'Sem barulho',
    copy: 'Presença baixa, escura e controlada.',
  },
  {
    icon: Users,
    title: 'Equipa pequena',
    copy: 'Papéis claros sem escala inventada.',
  },
  {
    icon: Gem,
    title: 'Peça cuidada',
    copy: 'A jersey é o primeiro objeto forte da SHUSH.',
  },
  {
    icon: Cpu,
    title: 'Backora',
    copy: 'Parceiro técnico/digital da experiência.',
  },
];

export function AboutSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="about" className="about-section scroll-mt-24 px-5 py-28">
      <motion.div
        className="about-shell"
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-15%' }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="about-copy">
          <span className="section-kicker">About / SHUSH</span>
          <h2>Uma equipa, uma estética, zero encenação.</h2>
          <p>
            SHUSH é equipa gaming, identidade preta/roxa e Drop 01 como primeira peça oficial. Backora entra como parceiro técnico/digital, sem roubar o centro.
          </p>
          <p className="about-line">Sem barulho. Só rounds.</p>
        </div>

        <div className="about-principles">
          {principles.map((principle, index) => {
            const Icon = principle.icon;
            return (
              <motion.div
                key={principle.title}
                className="about-principle"
                initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{ duration: 0.42, delay: index * 0.06 }}
              >
                <Icon aria-hidden="true" className="h-7 w-7 text-shush-purpleGlow" />
                <h3>{principle.title}</h3>
                <p>{principle.copy}</p>
              </motion.div>
            );
          })}
        </div>

        <a href="https://backora.org/" target="_blank" rel="noreferrer" className="about-backora">
          <span className="section-kicker">Parceiro técnico/digital</span>
          <span>Backora apoia a camada técnica e digital da SHUSH.</span>
          <img src="/assets/brand/backora-logo.png" width="320" height="293" alt="Backora" loading="lazy" decoding="async" />
        </a>
      </motion.div>
    </section>
  );
}
