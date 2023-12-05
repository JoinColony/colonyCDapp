import { IconSize } from '~shared/Icon/Icon';
import { STATUS_TYPES } from './consts';

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
