import { useEffect, useLayoutEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const ScrollToTop = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // On initial mount / refresh: ensure scroll restoration is manual and check if refresh should redirect
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

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

    if (isReload && pathname !== '/') {
      navigate('/', { replace: true });
    }

    // Scroll to top immediately and after a short tick to prevent browser jumps
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' as ScrollBehavior,
    });

    const timer = setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant' as ScrollBehavior,
      });
    }, 10);

    return () => clearTimeout(timer);
  }, []);

  // When pathname changes (client-side route navigation), scroll to top
  useLayoutEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' as ScrollBehavior,
    });
  }, [pathname]);

  return null;
};
