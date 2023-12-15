import { Star } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { FC } from 'react';

import { ReputationBadgeProps } from './types';

const displayName = 'v5.ReputationBadge';

const ReputationBadge: FC<ReputationBadgeProps> = ({
  reputation,
  fractionDigits,
  className,
}) => (
  <div
    className={clsx(className, 'flex items-center gap-1 text-gray-900 text-sm')}
  >
    <Star size={14} className="flex-shrink-0" />
    <span className="inline-block">
      {reputation.toFixed(fractionDigits !== undefined ? fractionDigits : 2)}%
    </span>
  </div>
);

ReputationBadge.displayName = displayName;

export default ReputationBadge;
