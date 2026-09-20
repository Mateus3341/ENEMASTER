import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './contexts/AuthContext';
import { BackgroundTasksProvider } from './contexts/BackgroundTasksContext';
import { SavedWorkProvider } from './contexts/SavedWorkContext';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <BackgroundTasksProvider>
        <SavedWorkProvider>
          <App />
        </SavedWorkProvider>
      </BackgroundTasksProvider>
    </AuthProvider>
  </StrictMode>,
);

// Clean up stale Service Workers and invalidate obsolete caches
serviceWorkerRegistration.register();


