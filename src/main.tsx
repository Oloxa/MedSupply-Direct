// Ensure window.fetch has both getter and setter for external browser instrumentation extensions
try {
  if (typeof window !== 'undefined') {
    let _activeFetch = window.fetch;
    Object.defineProperty(window, 'fetch', {
      get: () => _activeFetch,
      set: (fn) => {
        _activeFetch = fn;
      },
      configurable: true,
      enumerable: true,
    });
  }
} catch {
  // Ignored
}

import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(<App />);
