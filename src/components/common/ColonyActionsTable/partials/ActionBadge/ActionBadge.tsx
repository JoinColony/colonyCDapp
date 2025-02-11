import React, { useMemo, type FC, useEffect } from 'react';

import LoadingSkeleton from '~common/LoadingSkeleton/LoadingSkeleton.tsx';
import useCurrentBlockTime from '~hooks/useCurrentBlockTime.ts';
import { useExpenditureActionStatus } from '~hooks/useExpenditureActionStatus.ts';
import { MotionState } from '~utils/colonyMotions.ts';
import { getStreamingPaymentStatus } from '~utils/streamingPayments.ts';
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

  const expenditureStatus = useExpenditureActionStatus(expenditure);
  const { streamingPaymentData, loadingStreamingPayment } =
    useGetStreamingPaymentData(expenditureId);

  const { currentBlockTime: blockTime, fetchCurrentBlockTime } =
    useCurrentBlockTime();

  const currentTime = useMemo(
    () => Math.floor(blockTime ?? Date.now() / 1000),
    [blockTime],
  );

  const streamingPaymentStatus = getStreamingPaymentStatus({
    streamingPayment: streamingPaymentData,
    currentTimestamp: currentTime,
    isMotion: !!motionState,
  });

  useEffect(() => {
    fetchCurrentBlockTime();
  }, [fetchCurrentBlockTime]);

  const isLoading =
    loading || !!loadingExpenditure || !!loadingStreamingPayment;

  return (
    <LoadingSkeleton
      isLoading={isLoading}
      className="h-[1.625rem] w-full rounded"
    >
      {streamingPaymentData ? (
        <StreamingPaymentStatusPill status={streamingPaymentStatus} />
      ) : (
        <>
          {expenditure ? (
            <ExpenditureActionStatusBadge
              status={expenditureStatus}
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
