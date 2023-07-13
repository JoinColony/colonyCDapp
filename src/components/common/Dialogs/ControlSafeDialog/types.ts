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
