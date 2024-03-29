import { type Icon, ThumbsDown, ThumbsUp } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC } from 'react';
import { type MessageDescriptor } from 'react-intl';

import { MotionVote } from '~utils/colonyMotions.ts';
import { formatText } from '~utils/intl.ts';
import PillsBase from '~v5/common/Pills/PillsBase.tsx';

import type { MotionVoteBadgeProps } from './types.ts';

const displayName = 'v5.common.Pills.MotionVoteBadge';

const icons: Record<MotionVote, Icon> = {
  [MotionVote.Yay]: ThumbsUp,
  [MotionVote.Nay]: ThumbsDown,
};
const text: Record<MotionVote, MessageDescriptor> = {
  [MotionVote.Yay]: { id: 'motion.support' },
  [MotionVote.Nay]: { id: 'motion.oppose' },
};

const MotionVoteBadge: FC<MotionVoteBadgeProps> = ({
  vote,
  text: textProp,
  icon,
}) => {
  return (
    <PillsBase
      className={clsx({
        'bg-purple-100 text-purple-400': vote === MotionVote.Yay,
        'bg-negative-100 text-negative-400': vote === MotionVote.Nay,
      })}
      icon={icon || icons[vote]}
    >
      {textProp || formatText(text[vote])}
    </PillsBase>
  );
};

MotionVoteBadge.displayName = displayName;

export default MotionVoteBadge;
