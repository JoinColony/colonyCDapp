import { NavigationSidebarButtonProps } from '../NavigationSidebarButton/types.ts';
import { NavigationSidebarSecondLevelProps } from '../NavigationSidebarSecondLevel/types.ts';
import { NavigationSidebarThirdLevelProps } from '../NavigationSidebarThirdLevel/types.ts';

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
