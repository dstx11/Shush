import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { preloadRoute } from './lib/routes';
import './styles/base.css';
import './styles/fonts.css';
import './styles/system.css';
import './styles/editorial.css';
import './styles/footer.css';

const initialPath = window.location.pathname;
preloadRoute(initialPath).then((initialModule) => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <ErrorBoundary>
        <BrowserRouter>
          <App initialPage={initialModule?.default} initialPath={initialPath} />
        </BrowserRouter>
      </ErrorBoundary>
    </React.StrictMode>,
  );
}).catch(() => {
  // A failed module load must never leave a static prerender behind an overlay.
  document.getElementById('shush-boot-stage')?.remove();
});

import "./styles/v5.css";

import './styles/experience.css';
import './styles/seasonal.css';
import './styles/intro-v3.css';
import './styles/motion-v3.css';
