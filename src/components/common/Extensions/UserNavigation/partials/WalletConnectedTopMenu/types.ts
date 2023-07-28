import { Token } from '~types';
import { UserAvatarDetailsProps } from '~v5/shared/UserAvatarDetails/types';

export interface WalletConnectedTopMenuProps extends UserAvatarDetailsProps {
  nativeToken?: Token;
  hideColonies?: boolean;
}
