import { MessageDescriptor } from 'react-intl';

import { Address, SimpleMessageValues } from '~types';

export interface AddExistingSafeProps {
  back: () => void;
  networkOptions: NetworkOption[];
  colonyAddress: Address;
  loadingModuleState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  stepIndex: number;
  setStepIndex: React.Dispatch<React.SetStateAction<number>>;
}

export interface NetworkOption {
  label: string;
  value: number;
}

export interface StatusText {
  status: MessageDescriptor;
  statusValues?: SimpleMessageValues;
}
