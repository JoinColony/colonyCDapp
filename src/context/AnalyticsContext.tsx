import React, {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import PiwikPro, {
  CustomEvent,
  PageViews,
  DownloadAndOutlink,
  GoalConversions,
} from '@piwikpro/react-piwik-pro';

// Define the shape of the analytics context
interface AnalyticsContextValue {
  trackEvent: (
    category: string,
    action: string,
    name?: string,
    value?: number,
  ) => void;
  trackPageView: (customTitle?: string) => void;
  enableLinkTracking: () => void;
  trackGoal: (id: string | number, revenue: number) => void;
}

// Create a context with a default implementation (no operation)
export const AnalyticsContext = createContext<AnalyticsContextValue>({
  trackEvent: () => {},
  trackPageView: () => {},
  enableLinkTracking: () => {},
  trackGoal: () => {},
});

// AnalyticsContextProvider component
export const AnalyticsContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const containerId = process.env.REACT_APP_PIWIK_CONTAINER_ID || '';
  const containerUrl = process.env.REACT_APP_PIWIK_CONTAINER_URL || '';

  useEffect(() => {
    if (containerId && containerUrl) {
      PiwikPro.initialize(containerId, containerUrl);
    }
  }, [containerId, containerUrl]);

  const contextValue = useMemo(
    () => ({
      trackPageView: (customTitle) => {
        PageViews.trackPageView(customTitle);
      },
      trackEvent: (category, action, name, value) => {
        CustomEvent.trackEvent(category, action, name, value);
      },
      enableLinkTracking: () => {
        DownloadAndOutlink.enableLinkTracking(true);
      },
      trackGoal: (id, revenue) => {
        GoalConversions.trackGoal(id, revenue);
      },
    }),
    // Dependencies array should be empty as these functions are not expected to change over time
    [],
  );

  return (
    <AnalyticsContext.Provider value={contextValue}>
      {children}
    </AnalyticsContext.Provider>
  );
};

// Custom hook to use the analytics context
export const useAnalyticsContext = () => useContext(AnalyticsContext);
