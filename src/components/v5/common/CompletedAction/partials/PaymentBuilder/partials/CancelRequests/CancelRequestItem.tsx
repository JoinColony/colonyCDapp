import clsx from 'clsx';
import React, { type FC } from 'react';
import { FormattedDate } from 'react-intl';

import ActionBadge from '~common/ColonyActionsTable/partials/ActionBadge/ActionBadge.tsx';
import { usePaymentBuilderContext } from '~context/PaymentBuilderContext/PaymentBuilderContext.ts';
import { MotionState } from '~utils/colonyMotions.ts';
import useGetColonyAction from '~v5/common/ActionSidebar/hooks/useGetColonyAction.ts';
import PenaliseBadge from '~v5/common/Pills/PenaliseBadge/PenaliseBadge.tsx';

import { type CancelRequestItemProps } from './types.ts';

const CancelRequestItem: FC<CancelRequestItemProps> = ({ action }) => {
  const {
    motionState,
    loadingAction,
    action: colonyAction,
  } = useGetColonyAction(action.transactionHash);
  const { selectedCancellingAction, setSelectedCancellingAction } =
    usePaymentBuilderContext();

  const isSelected =
    selectedCancellingAction?.transactionHash === action.transactionHash;

  const isMotion = !!action.motionData;
  const isExpenditureStaked = colonyAction?.expenditure?.isStaked;
  const shouldPenalise = action?.motionData?.willPunishExpenditureStaker;

  return (
    <button
      type="button"
      className={clsx(
        'group flex w-full items-center justify-between outline-none transition-all',
        {
          'text-blue-400': isSelected,
          'text-gray-600': !isSelected,
        },
      )}
      onClick={() => {
        setSelectedCancellingAction(action);
      }}
    >
      <span
        className={clsx(
          'text-sm group-hover:text-blue-400 group-hover:underline',
          {
            underline: isSelected,
          },
        )}
      >
        <FormattedDate
          value={new Date(action.createdAt)}
          day="numeric"
          month="short"
          year="numeric"
        />
      </span>
      <div className="flex items-center gap-2">
        {isExpenditureStaked && (
          <>
            {shouldPenalise ? (
              <PenaliseBadge isPenalised text="Penalise" />
            ) : (
              <PenaliseBadge isPenalised={false} text="No penalty" />
            )}
          </>
        )}
        {loadingAction ? (
          <div className="h-[1.625rem] w-14 overflow-hidden rounded-xl skeleton" />
        ) : (
          <ActionBadge
            motionState={isMotion ? motionState : MotionState.Passed}
          />
        )}
      </div>
    </button>
  );
};

export default CancelRequestItem;
