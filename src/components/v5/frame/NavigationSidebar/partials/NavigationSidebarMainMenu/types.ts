import { NavigationSidebarButtonProps } from '../NavigationSidebarButton/types';
import { NavigationSidebarSecondLevelProps } from '../NavigationSidebarSecondLevel/types';
import { NavigationSidebarThirdLevelProps } from '../NavigationSidebarThirdLevel/types';

export interface NavigationSidebarItem
  extends Omit<NavigationSidebarButtonProps, 'hasSecondLevel'> {
  key: string;
  secondLevelMenuProps?: Omit<
    NavigationSidebarSecondLevelProps,
    'isExpanded' | 'onArrowClick'
  >;
  relatedActionsProps?: NavigationSidebarThirdLevelProps;
  hideMobile?: boolean;
}

export interface NavigationSidebarMainMenuProps {
  mainMenuItems: NavigationSidebarItem[];
}
