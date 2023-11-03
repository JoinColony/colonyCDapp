import { ButtonHTMLAttributes } from 'react';

export interface NavigationSidebarThirdLevelItem
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  key: string;
  label: string;
  href?: string;
}

export interface NavigationSidebarThirdLevelProps {
  items: NavigationSidebarThirdLevelItem[];
  title?: string;
}
