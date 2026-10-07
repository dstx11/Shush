import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import './styles/base.css';
import './styles/audit.css';

const PRELOAD_RECOVERY_KEY = 'shush:preload-recovery-at';

window.addEventListener('vite:preloadError', (event) => {
  const lastRecovery = Number(window.sessionStorage.getItem(PRELOAD_RECOVERY_KEY) ?? 0);
  const now = Date.now();

  if (now - lastRecovery < 30_000) return;

  event.preventDefault();
  window.sessionStorage.setItem(PRELOAD_RECOVERY_KEY, String(now));
  window.location.reload();
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
);
