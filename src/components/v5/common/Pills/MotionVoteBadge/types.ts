import { type Icon } from '@phosphor-icons/react';

import { type MotionVote } from '~utils/colonyMotions.ts';

export interface MotionVoteBadgeProps {
  vote: MotionVote;
  text?: React.ReactNode;
  icon?: Icon;
}
