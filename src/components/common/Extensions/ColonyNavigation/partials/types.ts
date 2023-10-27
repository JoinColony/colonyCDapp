import { SubMenuItem } from './SubMenu/types';

export interface NavItem {
  label: string;
  href?: string;
  subMenu?: SubMenuItem[];
  onToggle?: (state: boolean) => void;
  key: string;
}

export interface NavItemProps {
  item: NavItem;
}

export interface NavItemMobileProps extends NavItemProps {
  isOpen?: boolean;
  toggleItem?: () => void;
}

export interface NavProps {
  items: NavItem[];
}
