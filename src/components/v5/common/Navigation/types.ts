import { MessageDescriptor } from 'react-intl';

export interface NavItemProps {
  disabled?: boolean;
  linkTo: string;
  label: MessageDescriptor | string;
}

export interface NavigationProps {
  className?: string;
  navigationItems: NavigationItem[];
}

export interface NavigationItem {
  id: number;
  linkTo: string;
  label: string;
  value: string;
}
