import React, { useState, useEffect } from 'react';

import { apolloClient } from '~apollo';
import LoadingSkeleton from '~common/LoadingSkeleton/LoadingSkeleton.tsx';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import useAsyncFunction from '~hooks/useAsyncFunction.ts';
import useColonyFundsClaims from '~hooks/useColonyFundsClaims.ts';
import { useTimeout } from '~hooks/useTimeout.ts';
import { ActionTypes } from '~redux/actionTypes.ts';
import Tooltip from '~shared/Extensions/Tooltip/Tooltip.tsx';
import { getGroupedUnclaimedClaimsByChain } from '~utils/claims.ts';
import { formatText } from '~utils/intl.ts';
import Button from '~v5/shared/Button/Button.tsx';

import { MSG } from '../consts.ts';

export const ClaimFundsButton = () => {
  const {
    colony,
    canInteractWithColony,
    startPollingColonyData,
    stopPollingColonyData,
  } = useColonyContext();

  const claims = useColonyFundsClaims();
  const unclaimedClaims = claims.filter(
    (claim) => !claim.isClaimed && claim.amount !== '0',
  );
  const hasUnclaimedClaims = !!unclaimedClaims.length;

  const tokenAddressesGroupedByChain =
    getGroupedUnclaimedClaimsByChain(unclaimedClaims);

  const [isClaimed, setIsClaimed] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [isVisible, setIsVisible] = useState(hasUnclaimedClaims);
  const [shouldRefetchData, setShouldRefetchData] = useState(false);

  useEffect(() => {
    if (hasUnclaimedClaims) {
      setIsVisible(true);
      setIsClaimed(false);
    }
  }, [hasUnclaimedClaims]);

  // We need to use a timeout here as the claimed funds might not yet be present in the DB
  useTimeout({
    shouldTriggerCallback: shouldRefetchData,
    callback: async () => {
      setShouldRefetchData(false);
      await apolloClient.refetchQueries({
        include: ['GetDomainBalance'],
      });
    },
  });

  useTimeout({
    shouldTriggerCallback: isClaimed,
    callback: () => {
      setIsVisible(false);
      setShouldRefetchData(true);
    },
  });

  const claimTokensOnChains = useAsyncFunction({
    submit: ActionTypes.CLAIM_TOKENS_ON_CHAINS,
    error: ActionTypes.CLAIM_TOKENS_ON_CHAINS_ERROR,
    success: ActionTypes.CLAIM_TOKENS_ON_CHAINS_SUCCESS,
  });

  if (!isVisible) {
    return null;
  }

  const handleClick = async () => {
    setIsClaiming(true);
    try {
      await claimTokensOnChains({
        colonyAddress: colony?.colonyAddress,
        tokenAddressesGroupedByChain,
      });
      setIsClaimed(true);
      startPollingColonyData(1_000);
      setTimeout(stopPollingColonyData, 10_000);
    } catch {
      //
    } finally {
      setIsClaiming(false);
    }
  };

  return isClaimed ? (
    <Button
      text={formatText(MSG.fundsClaimedCTA)}
      size="small"
      className="pointer-events-none h-8.5 border border-success-400 bg-success-400 px-3 py-2 !text-base-white"
    />
  ) : (
    <LoadingSkeleton isLoading={isClaiming} className="h-8.5 w-14 rounded-lg">
      <Tooltip
        tooltipContent={formatText(MSG.claimFundsTooltip)}
        placement="top"
      >
        <Button
          onClick={handleClick}
          disabled={!canInteractWithColony}
          text={formatText(MSG.claimFundsCTA)}
          mode="primaryOutlineFull"
          size="small"
          className="h-fit border-gray-900 px-3 text-gray-900"
        />
      </Tooltip>
    </LoadingSkeleton>
  );
};
