import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/main.scss';

// Detect whether the current page load is due to a browser refresh / reload
const isReload = (() => {
  try {
    const navEntries = performance.getEntriesByType('navigation');
    if (navEntries.length > 0) {
      return (navEntries[0] as PerformanceNavigationTiming).type === 'reload';
    }
    return (window.performance as unknown as { navigation?: { type?: number } })?.navigation?.type === 1;
  } catch {
    return false;
  }
})();

const wasRefreshed = isReload || sessionStorage.getItem('so_beau_is_refresh') === 'true';
sessionStorage.removeItem('so_beau_is_refresh');

// If the page was refreshed, always start on the home page ('/')
if (wasRefreshed) {
  if (window.location.pathname !== '/' || window.location.search || window.location.hash) {
    window.history.replaceState(null, '', '/');
  }
}

// Disable browser's automatic scroll restoration on refresh so it always starts at the top
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

window.scrollTo(0, 0);

// Record refresh intent before page unload
window.addEventListener('beforeunload', () => {
  sessionStorage.setItem('so_beau_is_refresh', 'true');
});

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
