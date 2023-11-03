import { ButtonHTMLAttributes } from 'react';

export interface NavigationSidebarButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  iconName: string;
  label: string;
  isActive?: boolean;
  className?: string;
}
