import { type SetStateFn } from '~types/index.ts';
import { type MotionAction } from '~types/motions.ts';

export interface MotionContextValues {
  motionAction: MotionAction;
  isRefetching: boolean;
  setIsRefetching: SetStateFn;
}

export interface MotionProviderProps {
  motionAction: MotionAction;
}
