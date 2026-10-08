import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { preloadRoute } from './lib/routes';
import './styles/base.css';
import './styles/system.css';
import './styles/editorial.css';
import './styles/players.css';
import './styles/premier.css';
import './styles/creators.css';
import './styles/drop.css';
import './styles/gallery.css';
import './styles/about.css';
import './styles/footer.css';

const PRELOAD_RECOVERY_KEY = 'shush:preload-recovery-at';

window.addEventListener('vite:preloadError', (event) => {
  const now = Date.now();
  try {
    const lastRecovery = Number(window.sessionStorage.getItem(PRELOAD_RECOVERY_KEY) ?? 0);
    if (now - lastRecovery < 30_000) return;
    window.sessionStorage.setItem(PRELOAD_RECOVERY_KEY, String(now));
  } catch {
    // Storage can be blocked. Leave the error boundary in control instead of
    // risking a reload loop without a persistent recovery timestamp.
    return;
  }
  event.preventDefault();
  window.location.reload();
});

preloadRoute(window.location.pathname);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
);
