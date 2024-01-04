import clsx from 'clsx';
import React, { FC } from 'react';

import { formatText } from '~utils/intl';
import PillsBase from '~v5/common/Pills/PillsBase';

import { MOTION_BADGE_STATUS } from './consts';
import { MotionBadgeProps } from './types';

const displayName =
  'v5.common.ActionSidebar.partials.motions.MotionSimplePayment.partials.MotionBadge';

const MotionBadge: FC<MotionBadgeProps> = ({
  status,
  text: textProp,
  iconName,
}) => {
  const icons = {
    [MOTION_BADGE_STATUS.support]: 'thumbs-up',
    [MOTION_BADGE_STATUS.oppose]: 'thumbs-down',
  };
  const text = {
    [MOTION_BADGE_STATUS.support]: { id: 'motion.support' },
    [MOTION_BADGE_STATUS.oppose]: { id: 'motion.oppose' },
  };

  return (
    <PillsBase
      className={clsx({
        'bg-purple-100 text-purple-400': status === MOTION_BADGE_STATUS.support,
        'bg-negative-100 text-negative-400':
          status === MOTION_BADGE_STATUS.oppose,
      })}
      iconName={iconName || icons[status]}
    >
      {textProp || formatText(text[status])}
    </PillsBase>
  );
};

MotionBadge.displayName = displayName;

export default MotionBadge;
