import { MessageDescriptor } from 'react-intl';

export interface NotificationBannerProps {
  status: StatusType;
  title: string | MessageDescriptor;
  actionText: string | MessageDescriptor;
  actionType: ActionType;
  isFullSize?: boolean;
  isAlt?: boolean;
  onClick?: () => void;
}

type ActionType = 'redirect' | 'copy-url' | 'call-to-action';

type StatusType = 'success' | 'warning' | 'error';

export interface CopyUrlProps {
  actionText: string;
}
