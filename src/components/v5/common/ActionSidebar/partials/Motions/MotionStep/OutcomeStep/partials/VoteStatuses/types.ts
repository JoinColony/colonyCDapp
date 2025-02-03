import { type Icon } from '@phosphor-icons/react';

import { type MotionVote } from '~utils/colonyMotions.ts';
import { type UserAvatarsItem } from '~v5/shared/UserAvatars/types.ts';

export interface VoteStatuses {
  key: string;
  icon: Icon;
  label: string;
  progress: number;
  status: MotionVote;
}

export interface VoteStatusesProps {
  items: VoteStatuses[];
  voters: UserAvatarsItem[];
}
