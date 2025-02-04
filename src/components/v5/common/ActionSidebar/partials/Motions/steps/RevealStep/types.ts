import { type ColonyAction } from '~types/graphql.ts';

export interface RevealStepProps {
  startPollingAction: (pollingInterval: number) => void;
  stopPollingAction: () => void;
  actionData: ColonyAction | undefined | null;
  rootHash: string | undefined;
  transactionId: string;
  motionState?: number;
  isActionCancelled?: boolean;
}
