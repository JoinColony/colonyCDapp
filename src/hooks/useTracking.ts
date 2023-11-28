import {
  useAnalyticsContext,
  AnalyticsEventAction,
  AnalyticsEventCategory,
  AnalyticsEventLabel,
  AnalyticsEventType,
} from '~context/AnalyticsContext';

const useTracking = (
  eventType: AnalyticsEventType,
  eventCategory: AnalyticsEventCategory,
  eventAction: AnalyticsEventAction,
  eventLabel: AnalyticsEventLabel,
) => {
  const { trackEvent } = useAnalyticsContext();

  return () => {
    trackEvent(eventType, eventCategory, eventAction, eventLabel);
  };
};

export default useTracking;
