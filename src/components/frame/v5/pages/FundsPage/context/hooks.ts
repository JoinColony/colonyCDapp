import { useEffect } from 'react';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import useColonyFundsClaims from '~hooks/useColonyFundsClaims.ts';
import usePrevious from '~hooks/usePrevious.ts';

export const useRefetchColonyData = (
  shouldRefetchColonyData: boolean,
  reset: () => void,
) => {
  const { startPollingColonyData, stopPollingColonyData } = useColonyContext();

  useEffect(() => {
    let timeoutId;
    if (shouldRefetchColonyData) {
      startPollingColonyData(1_000);
      timeoutId = setTimeout(() => {
        stopPollingColonyData();
        /**
         * Resets the context state if no incoming funds state update occurs
         * after colony polling is completed.
         */
        reset();
      }, 10_000);
    }

    return () => {
      if (timeoutId) {
        stopPollingColonyData();
        reset();
        clearTimeout(timeoutId);
      }
    };
  }, [
    shouldRefetchColonyData,
    reset,
    startPollingColonyData,
    stopPollingColonyData,
  ]);
};

export const useFundsStateUpdater = (
  pendingFundsTokenAddresses: string[],
  reset: () => void,
) => {
  const fundsClaims = useColonyFundsClaims();
  const unclaimedFundsClaims = fundsClaims.filter(
    (claim) =>
      claim.amount !== '0' &&
      !claim.isClaimed &&
      claim.token?.tokenAddress &&
      pendingFundsTokenAddresses.includes(claim.token?.tokenAddress),
  );
  const previousUnclaimedFundsClaims = usePrevious(unclaimedFundsClaims);

  const hasFundsClaimsStateChanged =
    !unclaimedFundsClaims?.length && !!previousUnclaimedFundsClaims?.length;

  useEffect(() => {
    if (hasFundsClaimsStateChanged) {
      reset();
    }
  }, [hasFundsClaimsStateChanged, reset]);
};
