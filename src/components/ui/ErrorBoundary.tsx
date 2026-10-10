import { Component, type ErrorInfo, type ReactNode } from 'react';

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('SHUSH render error', error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="fatal-fallback" role="main">
        <div>
          <span className="section-kicker">SHUSH / recovery</span>
          <h1>Não foi possível carregar esta página.</h1>
          <p>Atualiza a versão do site e tenta novamente.</p>
          <div className="fatal-fallback-actions">
            <button type="button" onClick={() => window.location.reload()}>Recarregar</button>
            <a href="/">Voltar à Home</a>
          </div>
        </div>
      </main>
    );
  }
}
