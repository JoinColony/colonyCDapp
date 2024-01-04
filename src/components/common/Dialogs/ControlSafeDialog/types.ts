import { ActionDialogProps } from '~shared/Dialog';
import {
  SetStateFn,
  Token,
  User,
  SafeTransactionData,
  SafeTransactionType,
} from '~types';
import { AbiItemExtended } from '~utils/safes';

export interface ControlSafeProps extends ActionDialogProps {
  selectedContractMethods?: UpdatedMethods;
  setSelectedContractMethods: React.Dispatch<
    React.SetStateAction<UpdatedMethods | undefined>
  >;
  showPreview: boolean;
  handleShowPreviewChange: (showPreview: boolean) => void;
  handleIsForceChange: SetStateFn<boolean>;
  isForce: boolean;
}

export interface FunctionParamType {
  name: string;
  type: string;
}

export interface FormSafeTransaction
  extends Omit<
    SafeTransactionData,
    'functionParams' | 'rawAmount' | 'recipient' | 'token' | 'transactionType'
  > {
  transactionType: SafeTransactionType | undefined;
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
