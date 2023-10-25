import { MotionVote } from '~utils/colonyMotions';

export interface VoteStatuses {
  key: string;
  iconName: string;
  label: string;
  progress: number;
  status: MotionVote;
}

export interface VoteStatusesProps {
  items: VoteStatuses[];
}
