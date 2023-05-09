import { Colony, WatchListItem } from '~types';

export interface IColonySwitcher {
  watchlistMock?: (WatchListItem | null)[];
}

export interface IColoniesDropdown {
  watchlist: (WatchListItem | null)[];
}

export interface IColonyItem {
  colony: Colony;
  chainName: string;
}

export interface IColonyAvatar {
  colonyToDisplay: Colony;
  colonyToDisplayAddress?: string;
  isMobile: boolean;
  isOpen?: boolean;
  setTriggerRef: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
}

export interface IColonyDropdownMobile {
  isOpen: boolean;
  isMobile: boolean;
  userLoading?: boolean;
}
