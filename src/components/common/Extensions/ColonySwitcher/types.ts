import { Colony, WatchListItem } from '~types';

export interface ColonySwitcherProps {
  watchListMock?: (WatchListItem | null)[];
}

export interface ColoniesDropdownProps {
  watchlist: (WatchListItem | null)[];
  isMobile?: boolean;
}

export interface ColonyItemProps {
  colony: Colony;
  chainName: string;
}

export interface ColonyAvatarProps {
  colonyToDisplay?: Colony;
  colonyToDisplayAddress?: string;
  isMobile: boolean;
  isOpen?: boolean;
  setTriggerRef: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
}

export interface ColonyDropdownMobileProps {
  isOpen: boolean;
  userLoading?: boolean;
}
