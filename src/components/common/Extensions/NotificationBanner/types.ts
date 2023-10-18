import React from 'react';
import { STATUS_TYPES } from '~v5/shared/StatusText/consts';

export interface NotificationBannerProps {
  status: (typeof STATUS_TYPES)[keyof typeof STATUS_TYPES];
  title?: React.ReactNode;
  isFullSize?: boolean;
  isAlt?: boolean;
  className?: string;
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
