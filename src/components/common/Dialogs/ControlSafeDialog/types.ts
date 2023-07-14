import { Colony } from '~types';
import { EnabledExtensionData } from '~hooks';

export interface ControlSafeProps {
  back: () => void;
  colony: Colony;
  enabledExtensionData: EnabledExtensionData;
  // loadingState: [boolean, React.Dispatch<React.SetStateAction<boolean>>][];
  // stepIndex: number;
  // setStepIndex: React.Dispatch<React.SetStateAction<number>>;
}

/* NOTE: this will be removed when the original is ported to the saga helpers */
export interface SelectedSafe {
  id: string; // Making explicit that this is the module address
  walletAddress: string; // And this is the safe address
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
