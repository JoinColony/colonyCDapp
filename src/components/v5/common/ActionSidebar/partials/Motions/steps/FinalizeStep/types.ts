import { MotionAction } from '~types/motions';
import { MotionState } from '~utils/colonyMotions';
import { RefetchAction } from '~v5/common/ActionSidebar/hooks';

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
