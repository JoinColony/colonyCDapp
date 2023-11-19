import React, {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
} from 'react';

// Define the shape of the analytics context
interface AnalyticsEvent {
  event: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
}

interface AnalyticsContextValue {
  trackEvent: (event: AnalyticsEvent) => void;
  trackPageView: (path: string) => void;
}

// Create a context with a default implementation (no operation)
export const AnalyticsContext = createContext<AnalyticsContextValue>({
  trackEvent: () => {},
  trackPageView: () => {},
});

// AnalyticsContextProvider component
export const AnalyticsContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const gtmId = process.env.GOOGLE_TAG_MANAGER_ID; // GTM ID from environment variable

  useEffect(() => {
    // Inject GTM script only if gtmId is available
    if (gtmId && (!window.dataLayer || window.dataLayer.length === 0)) {
      const script = document.createElement('script');
      script.innerHTML = `
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer', '${gtmId}');
      `;
      document.head.appendChild(script);
    }
  }, [gtmId]);

  const contextValue = useMemo(
    () => ({
      trackPageView: (path) => {
        if (gtmId && window.dataLayer) {
          window.dataLayer.push({
            event: 'pageview',
            path,
          });
        }
      },
      trackEvent: (event: AnalyticsEvent) => {
        if (gtmId && window.dataLayer) {
          window.dataLayer.push(event);
        }
      },
    }),
    [gtmId],
  );

  return (
    <AnalyticsContext.Provider value={contextValue}>
      {children}
    </AnalyticsContext.Provider>
  );
};

// Custom hook to use the analytics context
export const useAnalyticsContext = () => useContext(AnalyticsContext);
