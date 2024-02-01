import { type MotionVote } from '~utils/colonyMotions.ts';

export interface MotionVoteBadgeProps {
  vote: MotionVote;
  text?: React.ReactNode;
  iconName?: string;
}
