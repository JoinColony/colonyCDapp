import { type ColonyAvatarProps } from '~v5/shared/ColonyAvatar/types.ts';

import { type NavigationSidebarMainMenuProps } from './partials/NavigationSidebarMainMenu/types.ts';
import { type NavigationSidebarSecondLevelProps } from './partials/NavigationSidebarSecondLevel/types.ts';

import type React from 'react';

export interface NavigationSidebarColonySwitcherProps {
  avatarProps?: ColonyAvatarProps;
  content: Omit<
    NavigationSidebarSecondLevelProps,
    'isExpanded' | 'onArrowClick'
  >;
}

export interface NavigationSidebarProps {
  colonySwitcherProps: NavigationSidebarColonySwitcherProps;
  mainMenuItems?: NavigationSidebarMainMenuProps['mainMenuItems'];
  additionalMobileContent?: React.ReactNode;
  mobileBottomContent?: React.ReactNode;
  hamburgerLabel?: string;
  className?: string;
  isThirdLevelMenuOpen?: boolean;
}
