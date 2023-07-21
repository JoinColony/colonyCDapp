import { Colony } from '~types';
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
  // loadingState: [boolean, React.Dispatch<React.SetStateAction<boolean>>][];
  // stepIndex: number;
  // setStepIndex: React.Dispatch<React.SetStateAction<number>>;
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
