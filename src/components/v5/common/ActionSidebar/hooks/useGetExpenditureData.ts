import { useEffect, useState } from 'react';

import { FAILED_LOADING_DURATION as POLLING_TIMEOUT } from '~frame/LoadingTemplate/index.ts';
import { useGetExpenditureQuery } from '~gql';
import noop from '~utils/noop.ts';
import { getSafePollingInterval } from '~utils/queries.ts';

export const useGetExpenditureData = (
  expenditureId: string | null | undefined,
) => {
  const pollInterval = getSafePollingInterval();
  const { data, loading, refetch, startPolling, stopPolling } =
    useGetExpenditureQuery({
      variables: {
        expenditureId: expenditureId || '',
      },
      skip: !expenditureId,
      pollInterval,
    });

  const expenditure = data?.getExpenditure;
  const [isPolling, setIsPolling] = useState(expenditureId && !expenditure);

  useEffect(() => {
    const shouldPoll = expenditureId && !expenditure;

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
  }, [pollInterval, expenditureId, expenditure, stopPolling, startPolling]);

  return {
    expenditure,
    loadingExpenditure: loading || isPolling,
    refetchExpenditure: refetch,
    startPolling,
    stopPolling,
  };
};
