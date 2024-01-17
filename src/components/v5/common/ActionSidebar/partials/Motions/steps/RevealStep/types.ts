import { ColonyMotion } from '~types';

export interface RevealStepProps {
  startPollingAction: (pollingInterval: number) => void;
  stopPollingAction: () => void;
  motionData: ColonyMotion | undefined | null;
  motionState?: number;
  transactionId: string;
}
