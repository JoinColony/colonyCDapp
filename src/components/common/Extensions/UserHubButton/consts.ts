import {
  AnalyticsEvent,
  AnalyticsEventAction,
  AnalyticsEventCategory,
  AnalyticsEventLabel,
  AnalyticsEventType,
} from '~context/AnalyticsContext';

export const OPEN_USER_HUB_EVENT: AnalyticsEvent = {
  event: AnalyticsEventType.CUSTOM_EVENT,
  category: AnalyticsEventCategory.USER,
  action: AnalyticsEventAction.CLICK,
  label: AnalyticsEventLabel.OPEN_USER_HUB,
};
