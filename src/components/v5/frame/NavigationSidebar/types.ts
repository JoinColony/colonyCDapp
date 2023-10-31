import React from 'react';
import { ColonyAvatarProps } from '~v5/shared/ColonyAvatar/types';
import { NavigationSidebarMainMenuProps } from './partials/NavigationSidebarMainMenu/types';
import { NavigationSidebarSecondLevelProps } from './partials/NavigationSidebarSecondLevel/types';

export interface NavigationSidebarColonySwitcherProps {
  avatarProps: ColonyAvatarProps;
  content: Omit<
    NavigationSidebarSecondLevelProps,
    'isExpanded' | 'onArrowClick'
  >;
}

export interface NavigationSidebarProps {
  mainMenuItems: NavigationSidebarMainMenuProps['mainMenuItems'];
  colonySwitcherProps: NavigationSidebarColonySwitcherProps;
  logo?: React.ReactNode;
  additionalMobileContent?: React.ReactNode;
  mobileBottomContent?: React.ReactNode;
  hamburgerLabel?: string;
  className?: string;
}
