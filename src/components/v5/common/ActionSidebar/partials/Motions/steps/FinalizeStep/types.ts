import { MotionAction } from '~types/motions.ts';
import { MotionState } from '~utils/colonyMotions.ts';
import { RefetchAction } from '~v5/common/ActionSidebar/hooks/index.ts';

export interface FinalizeStepProps {
  startPollingAction: (pollingInterval: number) => void;
  stopPollingAction: () => void;
  refetchAction: RefetchAction;
  actionData: MotionAction;
  motionState?: MotionState;
}

export enum FinalizeStepSections {
  Finalize = 'finalizeStep',
}

export enum WinningsItems {
  Staked = 'staked',
  Winnings = 'winnings',
  Total = 'total',
}
