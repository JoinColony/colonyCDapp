import { type MotionAction } from '~types/motions.ts';

export interface RevealStepProps {
  startPollingAction: (pollingInterval: number) => void;
  stopPollingAction: () => void;
  actionData: MotionAction | undefined | null;
  rootHash: string | undefined;
  transactionId: string;
  motionState?: number;
}
