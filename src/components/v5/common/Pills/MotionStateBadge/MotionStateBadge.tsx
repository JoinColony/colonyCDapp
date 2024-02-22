import clsx from 'clsx';
import React, { type FC } from 'react';

import { formatText } from '~utils/intl.ts';

import PillsBase from '../PillsBase.tsx';

import { MOTION_STATE_TO_CLASSNAME_MAP } from './consts.ts';
import { type MotionStateBadgeProps } from './types.ts';

const displayName = 'v5.common.Pills.MotionStateBadge';

const MotionStateBadge: FC<MotionStateBadgeProps> = ({
  state,
  className,
  icon: Icon,
  ...rest
}) => {
  return (
    <PillsBase
      {...rest}
      className={clsx(
        className,
        'font-medium text-sm',
        MOTION_STATE_TO_CLASSNAME_MAP[state],
        {
          'text-gray-500 bg-gray-100': !MOTION_STATE_TO_CLASSNAME_MAP[state],
        },
      )}
      textClassName={clsx({ 'flex items-center gap-1': Icon })}
    >
      {Icon && <Icon className="text-inherit" size={12} />}
      {formatText({ id: 'motion.state' }, { state })}
    </PillsBase>
  );
};

MotionStateBadge.displayName = displayName;

export default MotionStateBadge;
