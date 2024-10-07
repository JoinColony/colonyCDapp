import { useCallback, useEffect, useState } from 'react';

import { FAILED_LOADING_DURATION as POLLING_TIMEOUT } from '~frame/LoadingTemplate/index.ts';
import { useGetStreamingPaymentQuery } from '~gql';
import useCurrentBlockTime from '~hooks/useCurrentBlockTime.ts';
import { type StreamingPayment } from '~types/graphql.ts';
import { StreamingPaymentStatus } from '~types/streamingPayments.ts';
import noop from '~utils/noop.ts';
import { getSafePollingInterval } from '~utils/queries.ts';
import {
  getStreamingPaymentAmountsLeft,
  getStreamingPaymentStatus,
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

  const [paymentStatus, setPaymentStatus] = useState<StreamingPaymentStatus>(
    StreamingPaymentStatus.NotStarted,
  );
  const [expectedPaymentStatus, setExpectedPaymentStatus] =
    useState<StreamingPaymentStatus | null>(null);

  const { currentBlockTime: blockTime, fetchCurrentBlockTime } =
    useCurrentBlockTime();

  useEffect(() => {
    if (expectedPaymentStatus === paymentStatus) {
      setExpectedPaymentStatus(null);
    }
  }, [expectedPaymentStatus, paymentStatus, setExpectedPaymentStatus]);

  const [amounts, setAmounts] = useState<{
    amountAvailableToClaim: string;
    amountClaimedToDate: string;
  }>({
    amountAvailableToClaim: '0',
    amountClaimedToDate: '0',
  });

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

      const status = getStreamingPaymentStatus({
        streamingPayment: payment,
        currentTimestamp,
        isMotion,
        amountAvailableToClaim,
      });

      setPaymentStatus(status);
      setAmounts({ amountAvailableToClaim, amountClaimedToDate });
    },
    [],
  );

  const isLoading = loading || !!isPolling;

  useEffect(() => {
    if (!isLoading) {
      fetchCurrentBlockTime();
    }
  }, [fetchCurrentBlockTime, isLoading]);

  useEffect(() => {
    if (streamingPayment && !isLoading) {
      const currentTimestamp = Math.floor(blockTime ?? Date.now() / 1000);

      updateAmountsAndStatus(streamingPayment, currentTimestamp);
    }
  }, [blockTime, isLoading, streamingPayment, updateAmountsAndStatus]);

  return {
    streamingPaymentData: streamingPayment,
    loadingStreamingPayment: isLoading,
    refetchStreamingPayment: refetch,
    startPolling,
    stopPolling,
    updateAmountsAndStatus,
    paymentStatus,
    amounts,
    setExpectedPaymentStatus,
    expectedPaymentStatus,
  };
};

export type UseGetStreamingPaymentDataReturnType = ReturnType<
  typeof useGetStreamingPaymentData
>;
