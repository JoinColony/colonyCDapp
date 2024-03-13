import clsx from 'clsx';
import React, { type FC } from 'react';

import { ExpenditureStatus } from '~gql';
import PillsBase from '~v5/common/Pills/PillsBase.tsx';

import { EXPENDITURE_STATE_TO_CLASSNAME_MAP } from './consts.ts';
import { type ExpenditureBadgeProps } from './types.ts';

const ExpenditureBadge: FC<ExpenditureBadgeProps> = ({ status }) => {
  const badgeTexts = {
    [ExpenditureStatus.Draft]: 'Review',
    [ExpenditureStatus.Cancelled]: 'Pending',
    [ExpenditureStatus.Finalized]: 'Approved',
    [ExpenditureStatus.Locked]: 'Rejected',
  };

  return (
    <PillsBase
      className={clsx(
        EXPENDITURE_STATE_TO_CLASSNAME_MAP[status],
        'font-medium text-sm text-gray-500 bg-gray-100',
      )}
    >
      {badgeTexts[status]}
    </PillsBase>
  );
};

export default ExpenditureBadge;
