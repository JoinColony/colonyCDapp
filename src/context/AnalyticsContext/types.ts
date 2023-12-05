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
