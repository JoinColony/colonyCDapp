import { ButtonHTMLAttributes } from 'react';
import { NavigationSidebarSecondLevelProps } from '../NavigationSidebarSecondLevel/types';

export interface NavigationSidebarButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  iconName: string;
  label: string;
  isActive?: boolean;
  isExpanded?: boolean;
  hideMobile?: boolean;
  secondLevelMenuProps?: NavigationSidebarSecondLevelProps;
  className?: string;
}
