import { MotionVote } from '~utils/colonyMotions';

export interface VoteStatusProps {
  status: MotionVote;
  iconName: string;
  label: string;
  progress: string;
}
