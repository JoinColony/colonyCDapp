import { type MessageDescriptor } from 'react-intl';

import { type SelectOption } from '../Fields/Select/types.ts';

export interface NavItemProps {
  disabled?: boolean;
  linkTo: string;
  label: MessageDescriptor | string;
}

export type NavigationItem = SelectOption;

export interface NavigationProps {
  className?: string;
  navigationItems: NavigationItem[];
}
