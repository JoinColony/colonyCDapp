import { Star } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC } from 'react';

import { type ReputationBadgeProps } from './types.ts';

const displayName = 'v5.ReputationBadge';

const ReputationBadge: FC<ReputationBadgeProps> = ({
  reputation,
  fractionDigits,
  className,
}) => (
  <div className={clsx(className, 'flex items-center gap-1 text-sm')}>
    <Star size={14} className="flex-shrink-0" />
    <span className="inline-block">
      {reputation.toFixed(fractionDigits !== undefined ? fractionDigits : 2)}%
    </span>
  </div>
);

ReputationBadge.displayName = displayName;

export default ReputationBadge;
