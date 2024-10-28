import { type Icon } from '@phosphor-icons/react';
import { type PropsWithChildren, type ReactNode } from 'react';

type BannerStatus = 'success' | 'error' | 'warning' | 'info';
export type NotificationBannerProps = PropsWithChildren<{
  className?: string;
  status: BannerStatus;
  icon?: Icon;
  description?: ReactNode;
  callToAction?: ReactNode;
  descriptionClassName?: string;
  callToActionClassName?: string;
  contentClassName?: string;
}>;
