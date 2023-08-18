import { Colony, SetStateFn, Token, User, SafeTransactionData } from '~types';
import { EnabledExtensionData } from '~hooks';
import { AbiItemExtended } from '~utils/safes';

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
  handleIsForceChange: SetStateFn<boolean>;
  isForce: boolean;
}

export interface FunctionParamType {
  name: string;
  type: string;
}

export interface SafeTransaction
  extends Omit<
    SafeTransactionData,
    'functionParams' | 'rawAmount' | 'recipient' | 'token'
  > {
  token?: Token;
  rawAmount?: number;
  recipient?: User;
  functionParamTypes?: FunctionParamType[];
}

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
