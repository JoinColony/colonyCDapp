import { useEffect } from 'react';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import useColonyFundsClaims from '~hooks/useColonyFundsClaims.ts';
import usePrevious from '~hooks/usePrevious.ts';

export const useRefetchColonyData = (
  isAcceptLoading: boolean,
  reset: () => void,
) => {
  const { startPollingColonyData, stopPollingColonyData } = useColonyContext();

  useEffect(() => {
    let timeoutId;
    if (isAcceptLoading) {
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

    return () => clearTimeout(timeoutId);
  }, [isAcceptLoading, reset, startPollingColonyData, stopPollingColonyData]);
};

const useFundsStateUpdater = (
  isFundsUpdatePending: boolean,
  reset: () => void,
) => {
  const fundsClaims = useColonyFundsClaims();
  const unclaimedFundsClaims = fundsClaims.filter((claim) => !claim.isClaimed);
  const previousUnclaimedFundsClaims = usePrevious(unclaimedFundsClaims);

  const hasFundsClaimsStateChanged =
    unclaimedFundsClaims.some((unclaimedFundsClaim, index) => {
      const previousUnclaimedFundsClaim = previousUnclaimedFundsClaims?.[index];
      return (
        previousUnclaimedFundsClaim?.isClaimed !== unclaimedFundsClaim.isClaimed
      );
    }) || unclaimedFundsClaims.length !== previousUnclaimedFundsClaims?.length;

  useEffect(() => {
    if (isFundsUpdatePending && hasFundsClaimsStateChanged) {
      reset();
    }
  }, [isFundsUpdatePending, hasFundsClaimsStateChanged, reset]);
};

export default useFundsStateUpdater;
