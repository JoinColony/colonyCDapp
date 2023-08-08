import { PropsGetterArgs } from 'react-popper-tooltip';
import { NetworkInfo } from '~constants';
import { UserFragment } from '~gql';

export interface UserMenuProps {
  tooltipProps: (args?: PropsGetterArgs) => {
    'data-popper-interactive'?: boolean;
    style: React.CSSProperties;
  };
  setTooltipRef: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
  isWalletConnected: boolean;
  user?: UserFragment | null;
  isVerified?: boolean;
  walletAddress?: string;
  nativeToken?: NetworkInfo;
  hideColonies?: boolean;
}
