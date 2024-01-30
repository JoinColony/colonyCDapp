import {
  type AnalyticsEvent,
  AnalyticsEventAction,
  AnalyticsEventCategory,
  AnalyticsEventLabel,
  AnalyticsEventType,
} from '~context/AnalyticsContext/index.ts';

export const OPEN_USER_HUB_EVENT: AnalyticsEvent = {
  event: AnalyticsEventType.CUSTOM_EVENT,
  category: AnalyticsEventCategory.USER,
  action: AnalyticsEventAction.CLICK,
  label: AnalyticsEventLabel.OPEN_USER_HUB,
};
