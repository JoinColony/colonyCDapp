import { ColonyMotion } from '~types';
import { MotionState, MotionVote } from '~utils/colonyMotions';

export interface OutcomeStepProps {
  motionData: ColonyMotion | undefined | null;
  motionState?: MotionState;
}
export interface VoteStatuses {
  id: string;
  iconName: string;
  label: string | undefined;
  progress: number;
  status: MotionVote;
}
