import { MotionState } from '@colony/colony-js';

import { UseGetColonyActionReturnType } from '../../hooks';

export enum CustomStep {
  StakedMotionOutcome = 'stakedmotionoutcome',
  VotedMotionOutcome = 'votedmotionoutcome',
  Finalize = 'finalize',
}

export type Steps = MotionState | CustomStep;

export type MotionsProps = Omit<UseGetColonyActionReturnType, 'action'> & {
  action: Exclude<UseGetColonyActionReturnType['action'], undefined>;
};
