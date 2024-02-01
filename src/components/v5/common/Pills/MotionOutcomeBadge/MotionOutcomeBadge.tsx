import clsx from 'clsx';
import React, { type FC } from 'react';
import { type MessageDescriptor } from 'react-intl';

import { formatText } from '~utils/intl.ts';
import PillsBase from '~v5/common/Pills/PillsBase.tsx';

import type { MotionOutcome, MotionOutcomeBadgeProps } from './types.ts';

const displayName = 'v5.common.Pills.MotionOutcomeBadge';

const icons: Record<MotionOutcome, string> = {
  support: 'thumbs-up',
  oppose: 'thumbs-down',
};
const text: Record<MotionOutcome, MessageDescriptor> = {
  support: { id: 'motion.support' },
  oppose: { id: 'motion.oppose' },
};

const MotionOutcomeBadge: FC<MotionOutcomeBadgeProps> = ({
  outcome,
  text: textProp,
  iconName,
}) => {
  return (
    <PillsBase
      className={clsx({
        'bg-purple-100 text-purple-400': outcome === 'support',
        'bg-negative-100 text-negative-400': outcome === 'oppose',
      })}
      iconName={iconName || icons[outcome]}
    >
      {textProp || formatText(text[outcome])}
    </PillsBase>
  );
};

MotionOutcomeBadge.displayName = displayName;

export default MotionOutcomeBadge;
