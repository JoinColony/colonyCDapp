import { UserFragment } from '~gql';
import { Token } from '~types';

export interface WalletConnectedTopMenuProps {
  userName?: string;
  isVerified?: boolean;
  walletAddress?: string;
  userReputation?: string;
  totalReputation?: string;
  nativeToken?: Token;
  avatar?: string;
  user?: UserFragment | null;
}
