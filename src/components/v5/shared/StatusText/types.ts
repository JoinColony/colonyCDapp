import { type Icon } from '@phosphor-icons/react';

import { type STATUS_TYPES } from './consts.ts';

export interface StatusTextProps {
  status: (typeof STATUS_TYPES)[keyof typeof STATUS_TYPES];
  className?: string;
  icon?: Icon;
  iconSize?: number;
  iconClassName?: string;
  withIcon?: boolean;
  textClassName?: string;
  iconAlignment?: 'top' | 'center';
}
