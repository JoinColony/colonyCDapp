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

export interface TransactionSectionProps
  extends Pick<ControlSafeProps, 'colony'> {
  disabledInput: boolean;
  transactionIndex: number;
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
