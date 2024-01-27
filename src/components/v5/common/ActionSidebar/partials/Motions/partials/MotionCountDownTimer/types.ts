import { MotionStakes } from '~types/graphql.ts';
import { MotionState } from '~utils/colonyMotions.ts';
import { CountDownTimerProps } from '~v5/common/CountDownTimer/types.ts';

export interface MotionCountDownTimerProps
  extends Pick<CountDownTimerProps, 'prefix' | 'className' | 'timerClassName'> {
  motionState: MotionState;
  motionId: string;
  motionStakes: MotionStakes;
  refetchMotionState: VoidFunction;
}
