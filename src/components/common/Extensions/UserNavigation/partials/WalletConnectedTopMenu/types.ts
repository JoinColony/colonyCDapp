import { NetworkInfo } from '~constants';
import { UserAvatarDetailsProps } from '~v5/shared/UserAvatarDetails/types';

export interface WalletConnectedTopMenuProps extends UserAvatarDetailsProps {
  nativeToken?: NetworkInfo;
  hideColonies?: boolean;
}
