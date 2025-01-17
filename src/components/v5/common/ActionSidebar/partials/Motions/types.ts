import { type MotionState } from '@colony/colony-js';

import { type CompletedActionProps } from '~v5/common/CompletedAction/types.ts';

export interface MotionsProps extends CompletedActionProps {
  motionData: NonNullable<CompletedActionProps['action']['motionData']>;
}

export enum CustomStep {
  StakedMotionOutcome = 'stakedmotionoutcome',
  VotedMotionOutcome = 'votedmotionoutcome',
  Finalize = 'finalize',
}

export type Steps = MotionState | CustomStep;
