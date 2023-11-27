import { MotionState } from '~utils/colonyMotions';

export const hasMotionFailed = (motionState: MotionState) =>
  motionState === MotionState.Failed ||
  motionState === MotionState.Invalid ||
  motionState === MotionState.FailedNotFinalizable;

export const isMotionInProgress = (motionState?: MotionState) =>
  !!(
    motionState &&
    // motion is in progress, thus disable
    motionState !== MotionState.Failed &&
    motionState !== MotionState.Invalid &&
    motionState !== MotionState.FailedNotFinalizable &&
    motionState !== MotionState.Passed
  );
