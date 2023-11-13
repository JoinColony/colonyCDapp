import { NavigationSidebarButtonProps } from '../NavigationSidebarButton/types';
import { NavigationSidebarSecondLevelProps } from '../NavigationSidebarSecondLevel/types';
import { NavigationSidebarThirdLevelProps } from '../NavigationSidebarThirdLevel/types';

export interface NavigationSidebarItem extends NavigationSidebarButtonProps {
  key: string;
  secondLevelMenuProps?: Omit<
    NavigationSidebarSecondLevelProps,
    'isExpanded' | 'onArrowClick'
  >;
  relatedActionsProps?: NavigationSidebarThirdLevelProps;
  onClick?: () => void;
  hideMobile?: boolean;
  customClassName?: string;
}

export interface NavigationSidebarMainMenuProps {
  mainMenuItems: NavigationSidebarItem[];
}
