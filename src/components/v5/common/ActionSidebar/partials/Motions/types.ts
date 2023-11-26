import { MotionState } from '@colony/colony-js';

export interface MotionsProps {
  transactionId: string;
}

export enum CustomStep {
  StakedMotionOutcome = 'stakedmotionoutcome',
  VotedMotionOutcome = 'votedmotionoutcome',
}

export type Steps = MotionState | CustomStep;
