import clsx from 'clsx';
import React, { type FC } from 'react';

import { formatText } from '~utils/intl.ts';
import PillsBase from '~v5/common/Pills/PillsBase.tsx';
import { TokenStatus } from '~v5/common/types.ts';

import { type TokenStatusPillProps } from './types.ts';

const TokenStatusPill: FC<TokenStatusPillProps> = ({ status }) => {
  const showNewLabel = status === TokenStatus.Added;
  const showRemovedLabel = status === TokenStatus.Removed;

  if (!showNewLabel && !showRemovedLabel) {
    return null;
  }

  return (
    <PillsBase
      className={clsx('flex-shrink-0', {
        'bg-negative-100 text-negative-400': showRemovedLabel,
        'bg-success-100 text-success-400': showNewLabel,
      })}
      text={formatText({
        id: showRemovedLabel ? 'badge.removed' : 'badge.new',
      })}
    />
  );
};

export default TokenStatusPill;
