import { PropsWithChildren, ReactNode } from 'react';

type BannerStatus = 'success' | 'error' | 'warning' | 'info';
export type NotificationBannerProps = PropsWithChildren<{
  className?: string;
  status: BannerStatus;
  icon?: string;
  description?: ReactNode;
  callToAction?: ReactNode;
  isAlt?: boolean;
}>;
