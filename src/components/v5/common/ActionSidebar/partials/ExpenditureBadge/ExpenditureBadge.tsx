import clsx from 'clsx';
import React, { type FC } from 'react';

import { ExpenditureStatus } from '~gql';
import Tooltip from '~shared/Extensions/Tooltip/index.ts';
import { formatText } from '~utils/intl.ts';
import PillsBase from '~v5/common/Pills/PillsBase.tsx';

import { EXPENDITURE_STATE_TO_CLASSNAME_MAP } from './consts.ts';
import { type ExpenditureBadgeProps } from './types.ts';

const ExpenditureBadge: FC<ExpenditureBadgeProps> = ({ status, className }) => {
  const badgeTexts = {
    [ExpenditureStatus.Draft]: formatText({ id: 'expenditure.draft' }),
    [ExpenditureStatus.Cancelled]: formatText({ id: 'expenditure.cancelled' }),
    [ExpenditureStatus.Finalized]: formatText({ id: 'expenditure.finalized' }),
    [ExpenditureStatus.Locked]: formatText({ id: 'expenditure.locked' }),
  };

  const pill = (
    <PillsBase
      className={clsx(
        className,
        EXPENDITURE_STATE_TO_CLASSNAME_MAP[status || ExpenditureStatus.Draft],
        'bg-gray-100 text-sm font-medium text-gray-500',
      )}
    >
      {status ? badgeTexts[status] : formatText({ id: 'expenditure.unknown' })}
    </PillsBase>
  );

  return status === ExpenditureStatus.Draft ? (
    <Tooltip
      tooltipContent={formatText({ id: 'expenditure.reviewStage.tooltip' })}
    >
      {pill}
    </Tooltip>
  ) : (
    pill
  );
};

export default ExpenditureBadge;
