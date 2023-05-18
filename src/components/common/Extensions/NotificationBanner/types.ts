export interface NotificationBannerProps {
  status: StatusType;
  title: string;
  actionText: string;
  actionType: ActionType;
  isFullSize?: boolean;
  isAlt?: boolean;
}

type ActionType = 'redirect' | 'copy-url' | 'call-to-action';

type StatusType = 'success' | 'warning' | 'error';

export interface CopyUrlProps {
  actionText: string;
}
