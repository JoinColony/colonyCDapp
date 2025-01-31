import React, { type FC } from 'react';

import LoadingSkeleton from '~common/LoadingSkeleton/LoadingSkeleton.tsx';
import { useActionStatusContext } from '~context/ActionStatusContext/ActionStatusContext.ts';
import { ColonyActionType } from '~gql';
import { type ExpenditureActionStatus } from '~types/expenditures.ts';
import { type StreamingPaymentStatus } from '~types/streamingPayments.ts';
import { type MotionState } from '~utils/colonyMotions.ts';
import { formatText } from '~utils/intl.ts';
import PillsBase from '~v5/common/Pills/PillsBase.tsx';

import ExpenditureActionStatusBadge from '../ExpenditureActionStatusBadge/ExpenditureActionStatusBadge.tsx';
import MotionOutcomeBadge from '../MotionOutcomeBadge/MotionOutcomeBadge.tsx';
import StreamingPaymentStatusPill from '../StreamingPaymentStatusPill/StreamingPaymentStatusPill.tsx';

const ActionSidebarStatusPill: FC = () => {
  const { actionType, actionStatus, isLoading } = useActionStatusContext();

  if (!actionType || !actionStatus) {
    return null;
  }

  const getStatuPill = () => {
    switch (actionType) {
      case ColonyActionType.CreateExpenditure: {
        return (
          <ExpenditureActionStatusBadge
            status={actionStatus as ExpenditureActionStatus}
          />
        );
      }
      case ColonyActionType.CreateStreamingPayment: {
        return (
          <StreamingPaymentStatusPill
            status={actionStatus as StreamingPaymentStatus}
          />
        );
      }
      case ColonyActionType.CancelStreamingPayment: {
        return (
          <StreamingPaymentStatusPill
            status={actionStatus as StreamingPaymentStatus}
          />
        );
      }
      default: {
        if (actionType.endsWith('Motion') || actionType.endsWith('Multisig')) {
          return (
            <MotionOutcomeBadge motionState={actionStatus as MotionState} />
          );
        }

        return (
          <PillsBase
            className="bg-success-100 text-success-400"
            isCapitalized={false}
          >
            {formatText({ id: 'action.passed' })}
          </PillsBase>
        );
      }
    }
  };

  return (
    <LoadingSkeleton
      isLoading={isLoading}
      className="h-[1.625rem] w-full rounded"
    >
      {getStatuPill()}
    </LoadingSkeleton>
  );
};

export default ActionSidebarStatusPill;
