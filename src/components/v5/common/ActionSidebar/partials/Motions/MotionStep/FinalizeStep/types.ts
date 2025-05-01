import { type MotionState } from '~utils/colonyMotions.ts';
import { type ICompletedMotionAction } from '~v5/common/ActionSidebar/partials/Motions/types.ts';

export interface FinalizeStepProps extends ICompletedMotionAction {
  motionState?: MotionState;
}

export enum FinalizeStepSections {
  Finalize = 'finalizeStep',
}

export enum WinningsItems {
  Staked = 'staked',
  Winnings = 'winnings',
  Total = 'total',
  Completed = 'completed',
}
