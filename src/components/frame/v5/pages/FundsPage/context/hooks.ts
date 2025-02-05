import { useEffect } from 'react';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import useColonyFundsClaims from '~hooks/useColonyFundsClaims.ts';
import usePrevious from '~hooks/usePrevious.ts';

import { type PendingFundsChainTokens } from './types.ts';

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
  pendingFundsTokenAddresses: PendingFundsChainTokens,
  reset: () => void,
) => {
  const fundsClaims = useColonyFundsClaims();
  const unclaimedFundsClaims = fundsClaims.filter(
    ({ amount, isClaimed, token }) => {
      const { tokenAddress, chainMetadata } = token || {};

      return (
        amount !== '0' &&
        !isClaimed &&
        tokenAddress &&
        pendingFundsTokenAddresses.some(
          ({ chainId, tokenAddresses }) =>
            chainId === chainMetadata?.chainId &&
            tokenAddresses.includes(tokenAddress),
        )
      );
    },
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
