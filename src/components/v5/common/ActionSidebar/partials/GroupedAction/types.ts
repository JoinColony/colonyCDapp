import { type Icon } from '@phosphor-icons/react';

import { type Action } from '~constants/actions.ts';

export type ThemeColor = 'blue' | 'success' | 'purple' | 'warning';

export type GroupListItem = {
  title: string;
  description: string;
  Icon: Icon;
  action: Action;
  isNew?: boolean;
  isHidden?: boolean;
};
