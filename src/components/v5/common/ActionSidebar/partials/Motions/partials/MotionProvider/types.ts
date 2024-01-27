import { SetStateFn } from '~types/index.ts';
import { MotionAction } from '~types/motions.ts';

export interface MotionContextValues {
  motionAction: MotionAction;
  isRefetching: boolean;
  setIsRefetching: SetStateFn;
  startPollingAction: (pollingInterval: number) => void;
}

export interface MotionProviderProps {
  motionAction: MotionAction;
  startPollingAction: (pollingInterval: number) => void;
  stopPollingAction: () => void;
}
