import { Safe } from '~types';

export interface ControlSafeProps {
  back: () => void;
  safes: Safe[];
  // networkOptions: NetworkOption[];
  // colonySafes: Array<any>; // ColonySafe[];
  // colonyAddress: Address;
  // loadingState: [boolean, React.Dispatch<React.SetStateAction<boolean>>][];
  // stepIndex: number;
  // setStepIndex: React.Dispatch<React.SetStateAction<number>>;
}
