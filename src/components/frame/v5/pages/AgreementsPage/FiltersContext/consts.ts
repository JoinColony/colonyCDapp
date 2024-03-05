import { MotionState } from '~utils/colonyMotions.ts';

export const MOTION_FILTERS = {
  [MotionState.Failed]: [MotionState.Failed, MotionState.FailedNotFinalizable],
  [MotionState.Passed]: [MotionState.Passed],
  [MotionState.Staking]: [MotionState.Staking],
  [MotionState.Supported]: [MotionState.Supported],
  [MotionState.Voting]: [MotionState.Voting],
  [MotionState.Reveal]: [MotionState.Reveal],
  [MotionState.Opposed]: [MotionState.Opposed],
  [MotionState.Finalizable]: [MotionState.Finalizable],
  [MotionState.Invalid]: [MotionState.Invalid],
  [MotionState.Escalated]: [MotionState.Escalated],
  [MotionState.Forced]: [MotionState.Forced],
  [MotionState.Draft]: [MotionState.Draft],
  [MotionState.Unknown]: [MotionState.Unknown],
};
