import { Address, SelectedPickerItem, Token, User } from '~types';

export type ModuleAddress = Address;

export interface SelectedSafe {
  id: ModuleAddress; // Making explicit that this is the module address
  walletAddress: Address; // And this is the safe address
  profile: {
    displayName: string;
  };
}

export type FunctionParamType = {
  name?: string;
  type?: string;
};

export type NftProfile = {
  displayName: string;
  walletAddress: string;
};

export type Nft = {
  id: string;
  profile: NftProfile;
};

export type NftData = {
  address: string;
  description?: string;
  id: string;
  imageUri?: string;
  logoUri: string;
  name?: string;
  tokenName: string;
  tokenSymbol: string;
  uri: string;
};

export type SafeTransaction = {
  transactionType: string;
  tokenData?: Token;
  amount?: string;
  rawAmount?: string;
  recipient?: User;
  data: string;
  contract?: User;
  abi: string;
  contractFunction: string;
  functionParamTypes?: FunctionParamType[];
  nft?: SelectedPickerItem;
  nftData?: NFTData;
};

export interface SafeBalance {
  balance: number;
  token: Token | null;
}

export interface SafeBalanceApiData {
  balance: number;
  tokenAddress: Address | null;
  token: {
    name: string;
    symbol: string;
    decimals: number;
    logoUri: string;
  } | null;
}

export interface NFTData {
  address: string;
  id: string;
  logoUri: string;
  tokenName: string;
  tokenSymbol: string;
  uri: string;
  description?: string | null;
  imageUri?: string | null;
  name?: string | null;
}
