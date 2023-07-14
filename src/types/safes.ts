import { Address } from '~types';

export type ModuleAddress = Address;

export interface SelectedSafe {
  id: ModuleAddress; // Making explicit that this is the module address
  profile: {
    displayName: string;
    walletAddress: Address; // And this is the safe address
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

export type SafeBalanceToken = Erc20Token | SafeNativeToken;

export type Erc20Token = {
  name: string;
  decimals: number;
  symbol: string;
  logoUri: string;
  address: string;
};

export type SafeNativeToken = {
  name: string;
  decimals: number;
  symbol: string;
  address: string;
  networkName: string;
};

export type SafeTransaction = {
  transactionType: string;
  tokenAddress?: string;
  tokenData?: SafeBalanceToken;
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
  token: SafeBalanceToken | null;
}
