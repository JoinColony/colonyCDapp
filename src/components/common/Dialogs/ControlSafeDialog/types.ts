import { Colony, NFTData, SelectedPickerItem, User } from '~types';
import { EnabledExtensionData } from '~hooks';
import { AbiItemExtended } from '~utils/safes';
import { SafeBalanceToken } from '~gql';

export interface ControlSafeProps {
  back: () => void;
  colony: Colony;
  enabledExtensionData: EnabledExtensionData;
  selectedContractMethods?: UpdatedMethods;
  setSelectedContractMethods: React.Dispatch<
    React.SetStateAction<UpdatedMethods | undefined>
  >;
  showPreview: boolean;
  setShowPreview: (showPreview: boolean) => void;
  // loadingState: [boolean, React.Dispatch<React.SetStateAction<boolean>>][];
  // stepIndex: number;
  // setStepIndex: React.Dispatch<React.SetStateAction<number>>;
}

export interface FunctionParamType {
  name: string;
  type: string;
}

export type SafeTransaction = {
  transactionType: string;
  token?: SafeBalanceToken;
  amount?: string;
  rawAmount?: number;
  recipient?: User;
  data: string;
  contract?: User;
  abi: string;
  contractFunction: string;
  functionParamTypes?: FunctionParamType[];
  nft?: SelectedPickerItem;
  nftData?: NFTData;
};

export interface TransactionSectionProps
  extends Pick<ControlSafeProps, 'colony'> {
  disabledInput: boolean;
  transactionIndex: number;
}

export type UpdatedMethods = {
  [key: number]: AbiItemExtended | undefined;
};

export interface ABIResponse {
  status: string;
  message: string;
  result: string;
}
