import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/main.scss';

// Disable browser's automatic scroll restoration on refresh so it stays consistent
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

// Ensure top scroll position after assets load
window.addEventListener('load', () => {
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
});

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find root element');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
