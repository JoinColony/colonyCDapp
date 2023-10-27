import { ColonyMotion } from '~types';
import { MotionState } from '~utils/colonyMotions';

export interface OutcomeStepProps {
  motionData: ColonyMotion | undefined | null;
  motionState?: MotionState;
}
