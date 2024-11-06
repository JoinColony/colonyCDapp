import clsx from 'clsx';
import React, { type FC } from 'react';
import { FormattedDate } from 'react-intl';

import ActionBadge from '~common/ColonyActionsTable/partials/ActionBadge/ActionBadge.tsx';
import { usePaymentBuilderContext } from '~context/PaymentBuilderContext/PaymentBuilderContext.ts';
import { MotionState } from '~utils/colonyMotions.ts';
import useGetColonyAction from '~v5/common/ActionSidebar/hooks/useGetColonyAction.ts';

import { type FundingRequestItemProps } from './types.ts';

const FundingRequestItem: FC<FundingRequestItemProps> = ({ action }) => {
  const { motionState, loadingAction } = useGetColonyAction(
    action.transactionHash,
  );
  const { selectedFundingAction, setSelectedFundingAction } =
    usePaymentBuilderContext();

  const isSelected =
    selectedFundingAction?.transactionHash === action.transactionHash;

  const isMotion = !!action.motionData || !!action.multiSigData;

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
        setSelectedFundingAction(action);
      }}
    >
      <span
        className={clsx('text-sm', {
          underline: isSelected,
        })}
      >
        <FormattedDate
          value={new Date(action.createdAt)}
          day="numeric"
          month="short"
          year="numeric"
        />
      </span>
      {loadingAction ? (
        <div className="h-[1.625rem] w-14 overflow-hidden rounded-xl skeleton" />
      ) : (
        <ActionBadge
          motionState={isMotion ? motionState : MotionState.Passed}
        />
      )}
    </button>
  );
};

export default FundingRequestItem;
