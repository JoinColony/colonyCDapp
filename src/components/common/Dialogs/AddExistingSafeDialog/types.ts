import { MessageDescriptor } from 'react-intl';

import { Address, SimpleMessageValues } from '~types';

export interface AddExistingSafeProps {
  back: () => void;
  networkOptions: NetworkOption[];
  colonySafes: Array<any>; // ColonySafe[];
  colonyAddress: Address;
  loadingState: [boolean, React.Dispatch<React.SetStateAction<boolean>>][];
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
