import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { useAnalyticsContext } from '~context/AnalyticsContext/AnalyticsContext.ts';

const RouteTracker = () => {
  const location = useLocation();
  const { trackPageView } = useAnalyticsContext();

  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location, trackPageView]);

  return null;
};

export default RouteTracker;
