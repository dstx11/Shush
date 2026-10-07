import { Button } from '../components/ui/Button';

export function NotFoundPage() {
  return (
    <section className="audit-not-found px-5 pb-24 pt-36">
      <div className="audit-page-shell">
        <span className="section-kicker">404 / SHUSH</span>
        <h1>Página não encontrada.</h1>
        <p>Esta rota não faz parte do site público atual.</p>
        <Button href="/">Voltar à Home</Button>
      </div>
    </section>
  );
}
