import { PollingControls } from '~common/ColonyActions/ActionDetailsPage/DefaultMotion/MotionPhaseWidget/MotionPhaseWidget';
import { MotionAction } from '~types/motions';

export interface FinalizeStepProps extends PollingControls {
  actionData: MotionAction;
}

export enum FinalizeStepSections {
  Finalize = 'finalizeStep',
}
