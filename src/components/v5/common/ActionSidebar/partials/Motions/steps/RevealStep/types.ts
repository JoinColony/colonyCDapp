import { ColonyMotion } from '~types/graphql';

export interface RevealStepProps {
  startPollingAction: (pollingInterval: number) => void;
  stopPollingAction: () => void;
  motionData: ColonyMotion | undefined | null;
  motionState?: number;
  transactionId: string;
}
