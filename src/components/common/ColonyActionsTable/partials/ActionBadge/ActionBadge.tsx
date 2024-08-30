import React, { type FC } from 'react';

import LoadingSkeleton from '~common/LoadingSkeleton/LoadingSkeleton.tsx';
import { MotionState } from '~utils/colonyMotions.ts';
import { useGetExpenditureData } from '~v5/common/ActionSidebar/hooks/useGetExpenditureData.ts';
import { useGetStreamingPaymentData } from '~v5/common/ActionSidebar/hooks/useGetStreamingPaymentData.ts';
import ExpenditureActionStatusBadge from '~v5/common/ActionSidebar/partials/ExpenditureActionStatusBadge/ExpenditureActionStatusBadge.tsx';
import StreamingPaymentStatusPill from '~v5/common/ActionSidebar/partials/StreamingPaymentStatusPill/StreamingPaymentStatusPill.tsx';
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

  const { streamingPaymentData, paymentStatus, loadingStreamingPayment } =
    useGetStreamingPaymentData(expenditureId);

  const isLoading = loading || loadingExpenditure || loadingStreamingPayment;

  return (
    <LoadingSkeleton
      isLoading={isLoading}
      className="h-[1.625rem] w-full rounded"
    >
      {streamingPaymentData ? (
        <StreamingPaymentStatusPill status={paymentStatus} />
      ) : (
        <>
          {expenditure ? (
            <ExpenditureActionStatusBadge
              expenditure={expenditure}
              className={className}
            />
          ) : (
            <MotionStateBadge
              state={motionState || MotionState.Unknown}
              className={className}
            />
          )}
        </>
      )}
    </LoadingSkeleton>
  );
};

export default ActionBadge;
