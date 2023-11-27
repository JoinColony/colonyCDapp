import { SubMenuItem } from '../SubMenu/types';

export interface NavItem {
  label: string;
  href: string;
  subMenu?: SubMenuItem[];
  onToggle?: (state: boolean) => void;
  isLink?: boolean;
  key: string;
}

export interface NavItemProps {
  item: NavItem;
}

export interface NavProps {
  items: NavItem[];
}
