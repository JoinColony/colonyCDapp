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
  // this is optional only while porting and is non optional when finished
  transactionFormIndex?: number;
  handleInputChange: () => void;
  handleValidation: () => void;
}
