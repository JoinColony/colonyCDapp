import { IconSize } from '~shared/Icon/Icon.tsx';

import { STATUS_TYPES } from './consts.ts';

export interface StatusTextProps {
  status: (typeof STATUS_TYPES)[keyof typeof STATUS_TYPES];
  className?: string;
  iconName?: string;
  iconSize?: IconSize;
  iconClassName?: string;
  withIcon?: boolean;
  textClassName?: string;
  iconAlignment?: 'top' | 'center';
}
