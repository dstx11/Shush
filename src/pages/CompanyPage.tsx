import { AboutSection } from '../components/about/AboutSection';

export function CompanyPage() {
  return (
    <>
      <AboutSection />
      <section className="company-contact px-5 py-20" aria-labelledby="company-contact-title">
        <div className="page-shell">
          <span className="section-kicker">Contact</span>
          <h2 id="company-contact-title">Contacto simples.</h2>
          <p>Para roster, produto ou site: contacto direto pela equipa SHUSH. Backora fica como parceiro tecnico/digital.</p>
        </div>
      </section>
    </>
  );
}
