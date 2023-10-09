import { PollingControls } from '~common/ColonyActions/ActionDetailsPage/DefaultMotion/MotionPhaseWidget/MotionPhaseWidget';
import { MotionAction } from '~types/motions';

export interface FinalizeStepProps
  extends Omit<PollingControls, 'refetchAction'> {
  actionData: MotionAction;
}
