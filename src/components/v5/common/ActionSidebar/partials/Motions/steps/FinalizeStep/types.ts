import { PollingControls } from '~common/ColonyActions/ActionDetailsPage/DefaultMotion/MotionPhaseWidget/MotionPhaseWidget';
import { MotionAction } from '~types/motions';
import { MotionState } from '~utils/colonyMotions';

export interface FinalizeStepProps extends PollingControls {
  actionData: MotionAction;
  motionState?: MotionState;
}

export enum FinalizeStepSections {
  Finalize = 'finalizeStep',
}

export enum WinningsItms {
  Staked = 'staked',
  Winnings = 'winnings',
  Total = 'total',
}
