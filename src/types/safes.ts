import { Address, Token } from '~types';

export type ModuleAddress = Address;

export interface SelectedSafe {
  id: ModuleAddress; // Making explicit that this is the module address
  walletAddress: Address; // And this is the safe address
  profile: {
    displayName: string;
  };
}

export type SimpleUserProfile = {
  avatarHash?: string;
  displayName?: string;
  username?: string;
  walletAddress: string;
};

export type SimpleUser = {
  id: string;
  profile: SimpleUserProfile;
};

export type FunctionParamType = {
  name: string;
  type: string;
};

export interface SafeToken extends Token {
  logoUri?: string;
}

export type SafeTransaction = {
  transactionType: string;
  tokenAddress?: string;
  tokenData?: SafeToken;
  amount?: string;
  rawAmount?: string;
  recipient?: SimpleUser;
  data: string;
  contract?: SimpleUser;
  abi: string;
  contractFunction: string;
  functionParamTypes?: FunctionParamType[];
};

export interface SafeBalance {
  balance: number;
  tokenAddress: string | null;
  token: SafeToken | null;
}
