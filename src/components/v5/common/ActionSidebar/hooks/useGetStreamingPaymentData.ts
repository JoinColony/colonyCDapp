import { useEffect } from 'react';

import { FAILED_LOADING_DURATION as POLLING_TIMEOUT } from '~frame/LoadingTemplate/index.ts';
import { useGetStreamingPaymentQuery } from '~gql';
import noop from '~utils/noop.ts';
import { getSafePollingInterval } from '~utils/queries.ts';

export const useGetStreamingPaymentData = (
  streamingPaymentId: string | null | undefined,
) => {
  const pollInterval = getSafePollingInterval();

  const { data, refetch, loading, startPolling, stopPolling } =
    useGetStreamingPaymentQuery({
      variables: {
        streamingPaymentId: streamingPaymentId || '',
      },
      skip: Number.isNaN(streamingPaymentId) || !streamingPaymentId,
      fetchPolicy: 'cache-and-network',
      pollInterval,
    });

  const streamingPayment = data?.getStreamingPayment;

  useEffect(() => {
    const shouldPoll = streamingPaymentId && !streamingPayment;

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

  return {
    streamingPaymentData: streamingPayment,
    loadingStreamingPayment: loading,
    refetchStreamingPayment: refetch,
    startPolling,
    stopPolling,
  };
};

export type UseGetStreamingPaymentDataReturnType = ReturnType<
  typeof useGetStreamingPaymentData
>;
