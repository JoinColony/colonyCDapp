import { PropsGetterArgs } from 'react-popper-tooltip';
import { Token } from '~types';

export interface UserMenuProps {
  tooltipProps: (args?: PropsGetterArgs) => {
    'data-popper-interactive'?: boolean;
    style: React.CSSProperties;
  };
  setTooltipRef: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
  isWalletConnected: boolean;
  userName?: string;
  isVerified?: boolean;
  copyUrl?: boolean;
  walletAddress?: string;
  userReputation?: string;
  totalReputation?: string;
  nativeToken?: Token;
}
