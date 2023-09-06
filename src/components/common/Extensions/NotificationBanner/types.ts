import { MessageDescriptor } from 'react-intl';
import { STATUS_TYPES } from '~v5/shared/StatusText/consts';

export interface NotificationBannerProps {
  status: (typeof STATUS_TYPES)[keyof typeof STATUS_TYPES];
  title?: string | MessageDescriptor;
  isFullSize?: boolean;
  isAlt?: boolean;
  action?: { actionText: React.ReactNode } & (
    | {
        type: 'copy';
        copyContent: string;
      }
    | {
        type: 'redirect';
        href: string;
      }
    | {
        type: 'call-to-action';
        onClick?: () => void;
      }
  );
}

export interface CopyUrlProps {
  actionText: string;
}
