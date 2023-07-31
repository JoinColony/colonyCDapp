import { Dispatch } from 'react';
import { PropsGetterArgs } from 'react-popper-tooltip';

export interface UserNavigationProps {
  hideColonies?: boolean;
  isWalletButtonVisible?: boolean;
  isWalletOpen?: boolean;
  isUserMenuOpen?: boolean;
  userMenuSetTooltipRef: React.Dispatch<
    React.SetStateAction<HTMLElement | null>
  >;
  userMenuSetTriggerRef: React.Dispatch<
    React.SetStateAction<HTMLElement | null>
  >;
  userMenuGetTooltipProps: (args?: PropsGetterArgs | undefined) => {
    'data-popper-interactive': boolean | undefined;
    style: React.CSSProperties;
  };
  setWalletTriggerRef?: Dispatch<React.SetStateAction<HTMLElement | null>>;
}
