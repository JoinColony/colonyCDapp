import clsx from 'clsx';
import React, { type FC } from 'react';

import { ExpenditureStatus } from '~gql';
import { formatText } from '~utils/intl.ts';
import PillsBase from '~v5/common/Pills/PillsBase.tsx';

import { EXPENDITURE_STATE_TO_CLASSNAME_MAP } from './consts.ts';
import { type ExpenditureBadgeProps } from './types.ts';

const ExpenditureBadge: FC<ExpenditureBadgeProps> = ({ status }) => {
  const badgeTexts = {
    [ExpenditureStatus.Draft]: formatText({ id: 'expenditure.draft' }),
    [ExpenditureStatus.Cancelled]: formatText({ id: 'expenditure.cancelled' }),
    [ExpenditureStatus.Finalized]: formatText({ id: 'expenditure.finalized' }),
    [ExpenditureStatus.Locked]: formatText({ id: 'expenditure.locked' }),
  };

  return (
    <PillsBase
      className={clsx(
        EXPENDITURE_STATE_TO_CLASSNAME_MAP[status],
        'bg-gray-100 text-sm font-medium text-gray-500',
      )}
    >
      {badgeTexts[status]}
    </PillsBase>
  );
};

export default ExpenditureBadge;
