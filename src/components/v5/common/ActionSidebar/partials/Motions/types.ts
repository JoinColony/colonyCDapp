import { type MotionState } from '@colony/colony-js';

import { type ICompletedAction } from '~v5/common/CompletedAction/types.ts';

export interface ICompletedMotionAction extends ICompletedAction {
  motionData: NonNullable<ICompletedAction['action']['motionData']>;
}

export enum CustomStep {
  StakedMotionOutcome = 'stakedmotionoutcome',
  VotedMotionOutcome = 'votedmotionoutcome',
  Finalize = 'finalize',
}

export type Steps = MotionState | CustomStep;
