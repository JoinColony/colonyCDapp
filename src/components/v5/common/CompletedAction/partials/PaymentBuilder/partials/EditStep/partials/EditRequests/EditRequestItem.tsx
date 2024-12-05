import clsx from 'clsx';
import React, { type FC } from 'react';

import ActionBadge from '~common/ColonyActionsTable/partials/ActionBadge/ActionBadge.tsx';
import { usePaymentBuilderContext } from '~context/PaymentBuilderContext/PaymentBuilderContext.ts';
import { type ExpenditureAction } from '~types/graphql.ts';
import { MotionState } from '~utils/colonyMotions.ts';
import { formatText } from '~utils/intl.ts';
import useGetColonyAction from '~v5/common/ActionSidebar/hooks/useGetColonyAction.ts';

import useCountChanges from './hooks.ts';

interface EditingRequestItemProps {
  action: ExpenditureAction;
}

const EditRequestItem: FC<EditingRequestItemProps> = ({ action }) => {
  const { transactionHash, expenditureSlotChanges } = action;
  const { motionState, loadingAction } = useGetColonyAction(transactionHash);
  const changesCount = useCountChanges(
    expenditureSlotChanges?.newSlots || [],
    expenditureSlotChanges?.oldSlots || [],
  );

  const { selectedEditingAction, setSelectedEditingAction } =
    usePaymentBuilderContext();

  const isSelected =
    selectedEditingAction?.transactionHash === action.transactionHash;

  const isMotion = !!action.motionData;

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
        setSelectedEditingAction(action);
      }}
    >
      <span
        className={clsx('text-sm', {
          underline: isSelected,
        })}
      >
        {formatText(
          {
            id: isMotion
              ? 'expenditure.editingRequest.itemMotion'
              : 'expenditure.editingRequest.item',
          },
          { changes: changesCount },
        )}
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

export default EditRequestItem;
