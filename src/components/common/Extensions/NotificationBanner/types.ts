import { MessageDescriptor } from 'react-intl';
import { STATUS_TYPES } from '~v5/shared/IconedText/types';

export interface NotificationBannerProps {
  status: (typeof STATUS_TYPES)[keyof typeof STATUS_TYPES];
  title?: string | MessageDescriptor;
  isFullSize?: boolean;
  isAlt?: boolean;
  action?:
    | {
        type: 'copy';
        copyContent: string;
        actionText: string | MessageDescriptor;
      }
    | {
        type: 'redirect';
        href: string;
        actionText: string | MessageDescriptor;
      }
    | {
        type: 'call-to-action';
        onClick: () => void;
        actionText: string | MessageDescriptor;
      };
}

export interface CopyUrlProps {
  actionText: string;
}
