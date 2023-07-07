import { UserFragment } from '~gql';
import { Token } from '~types';
import { UserAvatarDetailsProps } from '~v5/shared/UserAvatarDetails/types';

export interface WalletConnectedTopMenuProps extends UserAvatarDetailsProps {
  userReputation?: string;
  totalReputation?: string;
  nativeToken?: Token;
  user?: UserFragment | null;
}
