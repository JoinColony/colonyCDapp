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

export enum AnalyticsEventType {
  CUSTOM_EVENT = 'custom_event',
}

export enum AnalyticsEventCategory {
  USER = 'user',
  ACTION_PANEL = 'action_panel',
  ADMIN = 'admin',
}

export enum AnalyticsEventAction {
  CLICK = 'CLICK',
  TRIGGER = 'TRIGGER',
  TRANSACTION = 'TRANSACTION',
}

export enum AnalyticsEventLabel {
  OPEN_USER_HUB = 'Open user hub',
  OPEN_ACTION_PANEL = 'Open action panel',
}

// Analytics event
export interface AnalyticsEvent {
  event: AnalyticsEventType;
  category: AnalyticsEventCategory;
  action: AnalyticsEventAction;
  label?: AnalyticsEventLabel;
  value?: number;
}

// Helper function to create an analytics event
const createAnalyticsEvent = (
  eventType: AnalyticsEventType,
  eventCategory: AnalyticsEventCategory,
  eventAction: AnalyticsEventAction,
  eventLabel: AnalyticsEventLabel,
  value?: number,
): AnalyticsEvent => {
  return {
    event: eventType,
    category: eventCategory,
    action: eventAction,
    label: eventLabel,
    value,
  };
};

interface AnalyticsContextValue {
  trackEvent: (
    eventType: AnalyticsEventType,
    eventCategory: AnalyticsEventCategory,
    eventAction: AnalyticsEventAction,
    eventLabel: AnalyticsEventLabel,
    value?: number,
  ) => void;
  trackPageView: (path: string) => void;
}

const defaultAnalyticsContext = {
  trackEvent: () => {},
  trackPageView: () => {},
};

// Create a context with a default implementation
export const AnalyticsContext = createContext<AnalyticsContextValue>(
  defaultAnalyticsContext,
);

// AnalyticsContextProvider
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
    return isAnalyticsActive
      ? {
          trackEvent: (
            eventType,
            eventCategory,
            eventAction,
            eventLabel,
            value,
          ) => {
            const event = createAnalyticsEvent(
              eventType,
              eventCategory,
              eventAction,
              eventLabel,
              value,
            );
            if (window.dataLayer) {
              window.dataLayer.push(event);
            }
          },
          trackPageView: (path) => {
            if (window.dataLayer) {
              window.dataLayer.push({ event: 'pageview', path });
            }
          },
        }
      : defaultAnalyticsContext;
  }, [isAnalyticsActive]);

  return (
    <AnalyticsContext.Provider value={contextValue}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalyticsContext = () => useContext(AnalyticsContext);
