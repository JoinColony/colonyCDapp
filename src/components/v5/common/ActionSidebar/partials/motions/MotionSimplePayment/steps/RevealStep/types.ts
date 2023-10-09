import { PollingControls } from '~common/ColonyActions/ActionDetailsPage/DefaultMotion/MotionPhaseWidget/MotionPhaseWidget';
import { ColonyMotion } from '~types';
import { MotionState } from '~utils/colonyMotions';

export interface RevealStepProps extends PollingControls {
  motionData: ColonyMotion;
  motionState: MotionState;
}
