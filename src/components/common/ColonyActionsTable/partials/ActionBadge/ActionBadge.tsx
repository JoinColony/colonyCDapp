import clsx from 'clsx';
import React, { type FC } from 'react';

import { MotionState } from '~utils/colonyMotions.ts';
import { useGetExpenditureData } from '~v5/common/ActionSidebar/hooks/useGetExpenditureData.ts';
import ExpenditureBadge from '~v5/common/ActionSidebar/partials/ExpenditureBadge/ExpenditureBadge.tsx';
import MotionStateBadge from '~v5/common/Pills/MotionStateBadge/MotionStateBadge.tsx';

import { type ActionBadgeProps } from './types.ts';

const ActionBadge: FC<ActionBadgeProps> = ({
  motionState,
  expenditureId,
  loading,
  className,
}) => {
  const { expenditure, loadingExpenditure } =
    useGetExpenditureData(expenditureId);

  const isLoading = loading || loadingExpenditure;

  return expenditureId ? (
    <ExpenditureBadge
      status={expenditure?.status}
      className={clsx(className, {
        skeleton: isLoading,
      })}
    />
  ) : (
    <MotionStateBadge
      state={motionState || MotionState.Unknown}
      className={clsx(className, {
        skeleton: isLoading,
      })}
    />
  );
};

export default ActionBadge;
