import { MotionStakes } from '~types';
import { MotionState } from '~utils/colonyMotions';
import { CountDownTimerProps } from '~v5/common/CountDownTimer/types';

export interface MotionCountDownTimerProps
  extends Pick<CountDownTimerProps, 'prefix' | 'className' | 'timerClassName'> {
  motionState: MotionState;
  motionId: string;
  motionStakes: MotionStakes;
  refetchMotionState: VoidFunction;
}
