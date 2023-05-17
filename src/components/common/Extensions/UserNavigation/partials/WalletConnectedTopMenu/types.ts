import { Token } from '~types';

export interface WalletConnectedTopMenuProps {
  userName?: string;
  isVerified?: boolean;
  copyUrl?: boolean;
  walletAddress?: string;
  userReputation?: string;
  totalReputation?: string;
  nativeToken?: Token;
}
