export interface UserSubmenuProps {
  submenuId: string;
}

export interface UserSubmenuItems {
  [key: string]: UserSubmenuItem[];
}

export interface UserSubmenuItem {
  id: string;
  label: string;
  url: string;
  icon: string;
}
