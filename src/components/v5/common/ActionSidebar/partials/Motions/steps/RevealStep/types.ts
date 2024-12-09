import { type ColonyMotion } from '~types/graphql.ts';

export interface RevealStepProps {
  startPollingAction: (pollingInterval: number) => void;
  stopPollingAction: () => void;
  motionData: ColonyMotion | undefined | null;
  rootHash: string | undefined;
  transactionId: string;
  motionState?: number;
  isActionCancelled?: boolean;
}
