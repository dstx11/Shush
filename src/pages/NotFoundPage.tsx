import { Button } from '../components/ui/Button';

export function NotFoundPage() {
  return (
    <section className="page-hero px-5 pb-24 pt-36">
      <div className="page-shell">
        <span className="section-kicker">404</span>
        <h1>Pagina nao encontrada.</h1>
        <p>Esta rota nao faz parte da experiencia publica da Fase 1.</p>
        <Button href="/">Voltar a Home</Button>
      </div>
    </section>
  );
}
