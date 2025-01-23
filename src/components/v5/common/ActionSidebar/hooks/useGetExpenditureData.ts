import { useEffect, useState } from 'react';

import { useGetExpenditureQuery } from '~gql';
import { getSafePollingInterval } from '~utils/queries.ts';

export const useGetExpenditureData = (
  expenditureId: string | null | undefined,
  // Forces the polling to continue until the attached component unmounts
  options?: {
    pollUntilUnmount?: boolean;
  },
) => {
  const pollInterval = getSafePollingInterval();

  const [isPolling, setIsPolling] = useState(false);

  const { data, loading, refetch, startPolling, stopPolling } =
    useGetExpenditureQuery({
      variables: {
        expenditureId: expenditureId || '',
      },
      skip: !expenditureId,
      pollInterval,
    });

  const expenditure = data?.getExpenditure;

  const shouldPoll =
    (expenditureId && !expenditure) || !!options?.pollUntilUnmount;

  useEffect(() => {
    setIsPolling(shouldPoll);

    if (!shouldPoll) {
      stopPolling();

      return;
    }

    if (!isPolling) {
      startPolling(pollInterval);
    }
  }, [isPolling, pollInterval, shouldPoll, startPolling, stopPolling]);

  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  return {
    expenditure,
    loadingExpenditure: loading || (isPolling && !expenditure),
    refetchExpenditure: refetch,
    startPolling,
    stopPolling,
  };
};
