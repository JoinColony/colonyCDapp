import React from 'react';
import { ColonyAvatarProps } from '~v5/shared/ColonyAvatar/types';
import { NavigationSidebarButtonProps } from './partials/NavigationSidebarButton/types';
import { NavigationSidebarSecondLevelProps } from './partials/NavigationSidebarSecondLevel/types';
import { NavigationSidebarThirdLevelProps } from './partials/NavigationSidebarThirdLevel/types';

export interface NavigationSidebarItem extends NavigationSidebarButtonProps {
  key: string;
  secondLevelMenuProps: Omit<
    NavigationSidebarSecondLevelProps,
    'isExpanded' | 'onArrowClick'
  >;
  relatedActionsProps?: NavigationSidebarThirdLevelProps;
}

export interface NavigationSidebarColonySwitcherProps {
  avatarProps: ColonyAvatarProps;
  content: Omit<
    NavigationSidebarSecondLevelProps,
    'isExpanded' | 'onArrowClick'
  >;
}

export interface NavigationSidebarProps {
  mainMenuItems: NavigationSidebarItem[];
  colonySwitcherProps: NavigationSidebarColonySwitcherProps;
  logo?: React.ReactNode;
  additionalMobileContent?: React.ReactNode;
  mobileBottomContent?: React.ReactNode;
  hamburgerLabel?: string;
  className?: string;
}
