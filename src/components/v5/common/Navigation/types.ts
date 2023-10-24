import { MessageDescriptor } from 'react-intl';

export interface NavItemProps {
  disabled?: boolean;
  linkTo: string;
  label: MessageDescriptor | string;
}

export type NavigationName = 'members' | 'extensions' | 'profile';

export interface NavigationProps {
  pageName: NavigationName;
  className?: string;
}
