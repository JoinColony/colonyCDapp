import { RefetchMotionState } from '~common/ColonyActions';
import { MotionStakes } from '~types';
import { MotionState } from '~utils/colonyMotions';

export interface MotionCountDownTimerProps {
  motionState: MotionState;
  motionId: string;
  motionStakes: MotionStakes;
  refetchMotionState: RefetchMotionState;
}
