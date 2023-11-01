import { Colony, WatchedColony, WatchListItem } from '~types';

export interface ColoniesDropdownProps {
  activeColony?: Colony;
  activeColonyAddress?: string;
  coloniesByCategory: ColoniesByCategory;
  isMobile?: boolean;
}

export interface ColonyItemProps {
  colony: Colony;
  chainName: string;
}

export interface ColonyAvatarProps {
  colony?: Colony | WatchedColony;
  colonyAddress?: string;
  isMobile: boolean;
  setTriggerRef?: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
}

export interface ColonyDropdownMobileProps {
  isOpen: boolean;
  userLoading?: boolean;
}

export interface ColonySwitcherProps {
  activeColony?: Colony;
  isCloseButtonVisible?: boolean;
  isColonyDropdownOpen?: boolean;
}

export type ColoniesByCategory = Record<string, WatchListItem[]>;
