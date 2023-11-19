import { MessageDescriptor } from 'react-intl';

export interface UserSubmenuProps {
  submenuId: string;
}

export interface UserSubmenuItems {
  [key: string]: UserSubmenuItem[];
}

export interface UserSubmenuItem {
  id: string;
  label: MessageDescriptor;
  url: string;
  external?: boolean;
  icon: string;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}
