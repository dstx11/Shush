import { AboutSection } from '../components/about/AboutSection';
import { SectionBreadcrumb } from '../components/motion/MotionPrimitives';
import { AppLink } from '../components/ui/AppLink';
import { Reveal } from '../components/ui/Reveal';

export function CompanyPage() {
  return (
    <>
      <AboutSection />
      <section id="contact" className="company-contact scroll-mt-28 px-5 py-20" aria-labelledby="company-contact-title">
        <Reveal className="page-shell">
          <SectionBreadcrumb items={['Company', 'Contact']} />
          <span className="section-kicker">Contact</span>
          <h2 id="company-contact-title">Contacto direto.</h2>
          <p>Para roster, produto ou site: contacto direto da equipa SHUSH. Backora fica como partner técnico/digital.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <AppLink className="footer-link" href="/company/partners">Partners</AppLink>
            <AppLink className="footer-link" href="/company/contact">Contacto</AppLink>
          </div>
        </Reveal>
      </section>
    </>
  );
}
