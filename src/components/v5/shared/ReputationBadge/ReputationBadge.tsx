import React, { FC } from 'react';
import clsx from 'clsx';

import Icon from '~shared/Icon';

import { ReputationBadgeProps } from './types';

const displayName = 'v5.ReputationBadge';

const ReputationBadge: FC<ReputationBadgeProps> = ({
  reputation,
  className,
}) => (
  <div className={clsx(className, 'flex items-center gap-1 text-gray-900')}>
    <Icon name="star" appearance={{ size: 'tiny' }} />
    <span className="text-sm inline-block mt-0.5">
      {reputation.toFixed(2)}%
    </span>
  </div>
);

ReputationBadge.displayName = displayName;

export default ReputationBadge;
