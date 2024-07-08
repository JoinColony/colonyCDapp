import clsx from 'clsx';
import React, { type FC } from 'react';

import useGetExpenditureData from '~hooks/useGetExpenditureData.ts';
import { MotionState } from '~utils/colonyMotions.ts';
import ExpenditureActionStatusBadge from '~v5/common/ActionSidebar/partials/ExpenditureActionStatusBadge/ExpenditureActionStatusBadge.tsx';
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

  return expenditure ? (
    <ExpenditureActionStatusBadge
      expenditure={expenditure}
      className={clsx(className, {
        'overflow-hidden skeleton': isLoading,
      })}
    />
  ) : (
    <MotionStateBadge
      state={motionState || MotionState.Unknown}
      className={clsx(className, {
        'overflow-hidden skeleton': isLoading,
      })}
    />
  );
};

export default ActionBadge;
