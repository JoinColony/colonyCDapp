import { MessageDescriptor } from 'react-intl';

import { SelectOption } from '../Fields/Select/types';

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
