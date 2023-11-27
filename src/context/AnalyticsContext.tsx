import React, {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useBeamer } from '~hooks/useBeamer';

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

const defaultAnalyticsContext = {
  trackEvent: () => {},
  trackPageView: () => {},
};

// Create a context with a default implementation (no operation)
export const AnalyticsContext = createContext<AnalyticsContextValue>(
  defaultAnalyticsContext,
);

// AnalyticsContextProvider component
export const AnalyticsContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const [isAnalyticsActive, setIsAnalyticsActive] = useState(false);
  const gtmId = process.env.GOOGLE_TAG_MANAGER_ID; // GTM ID from environment variable
  useBeamer();

  useEffect(() => {
    setIsAnalyticsActive(!!gtmId);
    if (gtmId) {
      // Inject GTM script only if gtmId is available
      if (!window.dataLayer || window.dataLayer.length === 0) {
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
    }
  }, [gtmId]);

  const contextValue = useMemo(() => {
    if (!isAnalyticsActive) {
      return defaultAnalyticsContext;
    }

    return {
      trackPageView: (path) => {
        if (window.dataLayer) {
          window.dataLayer.push({ event: 'pageview', path });
        }
      },
      trackEvent: (event: AnalyticsEvent) => {
        if (window.dataLayer) {
          window.dataLayer.push(event);
        }
      },
    };
  }, [isAnalyticsActive]);

  return (
    <AnalyticsContext.Provider value={contextValue}>
      {children}
    </AnalyticsContext.Provider>
  );
};

// Custom hook to use the analytics context
export const useAnalyticsContext = () => useContext(AnalyticsContext);
