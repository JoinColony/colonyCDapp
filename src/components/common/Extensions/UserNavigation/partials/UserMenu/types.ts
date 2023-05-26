import { PropsGetterArgs } from 'react-popper-tooltip';
import { UserFragment } from '~gql';
import { Token } from '~types';

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
  userReputation?: string;
  totalReputation?: string;
  nativeToken?: Token;
}
