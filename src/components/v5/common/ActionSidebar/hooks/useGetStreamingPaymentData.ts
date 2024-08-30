import { useCallback, useEffect, useState } from 'react';

import { FAILED_LOADING_DURATION as POLLING_TIMEOUT } from '~frame/LoadingTemplate/index.ts';
import { useGetStreamingPaymentQuery } from '~gql';
import useCurrentBlockTime from '~hooks/useCurrentBlockTime.ts';
import { type StreamingPayment } from '~types/graphql.ts';
import { StreamingPaymentStatus } from '~types/streamingPayments.ts';
import noop from '~utils/noop.ts';
import { getSafePollingInterval } from '~utils/queries.ts';
import {
  getStatus,
  getStreamingPaymentAmountsLeft,
} from '~utils/streamingPayments.ts';

export const useGetStreamingPaymentData = (
  streamingPaymentId: string | null | undefined,
) => {
  const pollInterval = getSafePollingInterval();

  const { data, refetch, loading, startPolling, stopPolling } =
    useGetStreamingPaymentQuery({
      variables: {
        streamingPaymentId: streamingPaymentId || '',
      },
      skip: Number.isNaN(streamingPaymentId),
      fetchPolicy: 'cache-and-network',
      pollInterval,
    });

  const streamingPayment = data?.getStreamingPayment;
  const [isPolling, setIsPolling] = useState(
    streamingPaymentId && !streamingPayment,
  );
  const [amounts, setAmounts] = useState<{
    amountAvailableToClaim: string;
    amountClaimedToDate: string;
  }>({
    amountAvailableToClaim: '0',
    amountClaimedToDate: '0',
  });
  const [paymentStatus, setPaymentStatus] = useState<StreamingPaymentStatus>(
    StreamingPaymentStatus.NotStarted,
  );
  const { currentBlockTime: blockTime, fetchCurrentBlockTime } =
    useCurrentBlockTime();

  useEffect(() => {
    const shouldPoll = streamingPaymentId && !streamingPayment;

    setIsPolling(shouldPoll);

    if (!shouldPoll) {
      return noop;
    }

    const cancelPollingTimer = setTimeout(stopPolling, POLLING_TIMEOUT);

    startPolling(pollInterval);

    return () => {
      if (cancelPollingTimer) {
        clearTimeout(cancelPollingTimer);
      }

      stopPolling();
    };
  }, [
    streamingPayment,
    streamingPaymentId,
    stopPolling,
    startPolling,
    pollInterval,
  ]);

  const updateAmountsAndStatus = useCallback(
    (
      payment: StreamingPayment,
      currentTimestamp: number,
      isMotion?: boolean,
    ) => {
      const { amountAvailableToClaim, amountClaimedToDate } =
        getStreamingPaymentAmountsLeft(payment, currentTimestamp);

      const status = getStatus({
        streamingPayment,
        currentTimestamp,
        isMotion,
        amountAvailableToClaim: amounts.amountAvailableToClaim,
      });

      setPaymentStatus(status);
      setAmounts({ amountAvailableToClaim, amountClaimedToDate });
    },
    [amounts.amountAvailableToClaim, streamingPayment],
  );

  useEffect(() => {
    if (!loading) {
      fetchCurrentBlockTime();
    }
  }, [fetchCurrentBlockTime, loading]);

  useEffect(() => {
    if (streamingPayment) {
      const currentTimestamp = Math.floor(blockTime ?? Date.now() / 1000);

      updateAmountsAndStatus(streamingPayment, currentTimestamp);
    }
  }, [blockTime, streamingPayment, updateAmountsAndStatus]);

  return {
    streamingPaymentData: streamingPayment,
    loadingStreamingPayment: loading || !!isPolling,
    refetchStreamingPayment: refetch,
    startPolling,
    stopPolling,
    updateAmountsAndStatus,
    paymentStatus,
    amounts,
  };
};

export type UseGetStreamingPaymentDataReturnType = ReturnType<
  typeof useGetStreamingPaymentData
>;
