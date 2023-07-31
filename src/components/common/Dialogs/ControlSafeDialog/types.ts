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
