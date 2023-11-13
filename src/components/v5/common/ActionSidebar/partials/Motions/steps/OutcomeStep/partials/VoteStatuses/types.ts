import { MotionVote } from '~utils/colonyMotions';
import { UserAvatarsItem } from '~v5/shared/UserAvatars/types';

export interface VoteStatuses {
  key: string;
  iconName: string;
  label: string;
  progress: number;
  status: MotionVote;
}

export interface VoteStatusesProps {
  items: VoteStatuses[];
  voters: UserAvatarsItem[];
}
