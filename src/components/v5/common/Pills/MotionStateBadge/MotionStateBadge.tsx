import clsx from 'clsx';
import React, { FC } from 'react';

import { formatText } from '~utils/intl.ts';

import PillsBase from '../PillsBase.tsx';

import { MOTION_STATE_TO_CLASSNAME_MAP } from './consts.ts';
import { MotionStateBadgeProps } from './types.ts';

const displayName = 'v5.common.Pills.MotionStateBadge';

const MotionStateBadge: FC<MotionStateBadgeProps> = ({
  state,
  className,
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
    >
      {formatText({ id: 'motion.state' }, { state })}
    </PillsBase>
  );
};

MotionStateBadge.displayName = displayName;

export default MotionStateBadge;
