import { MotionState } from '~utils/colonyMotions.ts';

export const MOTION_STATE_TO_CLASSNAME_MAP: Record<MotionState, string> = {
  [MotionState.Supported]: 'text-purple-400 bg-purple-100',
  [MotionState.Staking]: 'text-purple-400 bg-purple-100',
  [MotionState.Voting]: 'text-teams-teal-500 bg-teams-teal-50',
  [MotionState.Reveal]: 'text-teams-pink-500 bg-teams-pink-100',
  [MotionState.Opposed]: 'text-negative-400 bg-negative-100',
  [MotionState.Motion]: 'text-indigo-400 bg-indigo-100',
  [MotionState.Failed]: 'text-negative-400 bg-negative-100',
  [MotionState.Finalizable]: 'text-indigo-400 bg-indigo-100',
  [MotionState.Passed]: 'text-success-400 bg-success-100',
  [MotionState.FailedNotFinalizable]: 'text-negative-400 bg-negative-100',
  [MotionState.Invalid]: 'text-negative-400 bg-negative-100',
  [MotionState.Escalated]: 'text-blue-400 bg-blue-100',
  [MotionState.Forced]: 'text-teams-blue-400 bg-teams-blue-50',
  [MotionState.Draft]: 'text-teams-grey-500 bg-teams-grey-50',
  [MotionState.Open]: 'text-teams-blue-400 bg-teams-blue-50',
  [MotionState.Rejected]: 'text-negative-400 bg-negative-100',
  [MotionState.Unknown]: 'text-teams-grey-500 bg-teams-grey-50',
};
