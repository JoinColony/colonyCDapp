import { PropsGetterArgs } from 'react-popper-tooltip';
import { Colony, WatchListItem } from '~types';

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
  setTriggerRef?: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
}

export interface ColonyDropdownMobileProps {
  isOpen: boolean;
  userLoading?: boolean;
}

export interface ColonySwitcherProps {
  isCloseButtonVisible?: boolean;
  visible?: boolean;
  isMainMenuVisible?: boolean;
  setTooltipRef: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
  setTriggerRef: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
  getTooltipProps: (args?: PropsGetterArgs | undefined) => {
    'data-popper-interactive': boolean | undefined;
    style: React.CSSProperties;
  };
}
