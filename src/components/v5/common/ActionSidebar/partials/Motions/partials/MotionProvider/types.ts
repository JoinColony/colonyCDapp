import { SetStateFn } from '~types';
import { MotionAction } from '~types/motions';

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
