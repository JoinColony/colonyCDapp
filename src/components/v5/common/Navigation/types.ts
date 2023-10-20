import { MessageDescriptor } from 'react-intl';

export interface NavItemProps {
  disabled?: boolean;
  linkTo: string;
  label: MessageDescriptor | string;
}

export interface NavigationProps {
  navigationItems: NavigationItem[];
}

export interface NavigationItem {
  id: number;
  linkTo: string;
  label: string;
  value: string;
}
