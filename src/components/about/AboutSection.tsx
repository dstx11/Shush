import { motion, useReducedMotion } from 'motion/react';
import { Cpu, EyeOff, Shirt, Users } from 'lucide-react';
import { MotionRail, SectionBreadcrumb, SnakeLine } from '../motion/MotionPrimitives';

const principles = [
  {
    icon: EyeOff,
    title: 'Sem barulho',
    copy: 'Identidade escura, direta e controlada.',
  },
  {
    icon: Users,
    title: 'Grupo pequeno',
    copy: 'Gaming, esports e entertainment entre amigos.',
  },
  {
    icon: Shirt,
    title: 'Produto manual',
    copy: 'Jersey / Clothing com pedido manual.',
  },
  {
    icon: Cpu,
    title: 'Backora',
    copy: 'Partner técnico/digital da SHUSH.',
  },
];

export function AboutSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="about" className="about-section scroll-mt-28 px-5 pb-28 pt-36">
      <motion.div
        className="about-shell"
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-15%' }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="about-copy">
          <SectionBreadcrumb items={['Company', 'About']} />
          <span className="section-kicker">About / SHUSH</span>
          <h1>Grupo gaming, esports e entertainment.</h1>
          <MotionRail className="route-title-rail" />
          <p>SHUSH é um grupo gaming, esports e entertainment criado à volta de Valorant, creators e identidade própria.</p>
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

        <a id="partners" href="https://backora.org/" target="_blank" rel="noreferrer" className="about-backora scroll-mt-28">
          <SnakeLine className="backora-system-line" />
          <span className="section-kicker">Partners</span>
          <span>Backora é o partner técnico/digital por trás da estrutura web e suporte técnico.</span>
          <img src="/assets/brand/backora-logo.png" width="320" height="293" alt="Backora" loading="lazy" decoding="async" />
        </a>
      </motion.div>
    </section>
  );
}
