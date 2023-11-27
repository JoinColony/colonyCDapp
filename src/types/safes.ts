import { Address, Token } from '~types';

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
