import { type MotionState } from '@colony/colony-js';

export interface MotionsProps {
  transactionId: string;
}

export enum CustomStep {
  StakedMotionOutcome = 'stakedmotionoutcome',
  VotedMotionOutcome = 'votedmotionoutcome',
  Finalize = 'finalize',
}

export type Steps = MotionState | CustomStep;

export interface MotionBoxProps {
  transactionId: string;
  isActionCancelled?: boolean;
}
