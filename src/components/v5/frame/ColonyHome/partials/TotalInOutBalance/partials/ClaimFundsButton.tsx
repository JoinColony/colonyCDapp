import React, { useState, useEffect, type FC } from 'react';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import useColonyFundsClaims from '~hooks/useColonyFundsClaims.ts';
import { useTimeout } from '~hooks/useTimeout.ts';
import { ActionTypes } from '~redux/actionTypes.ts';
import Tooltip from '~shared/Extensions/Tooltip/Tooltip.tsx';
import { mergePayload } from '~utils/actions.ts';
import { formatText } from '~utils/intl.ts';
import ActionButton from '~v5/shared/Button/ActionButton.tsx';
import Button from '~v5/shared/Button/Button.tsx';

import { MSG } from '../consts.ts';

interface ClaimFundsButtonProps {
  refetchData: () => void;
}

export const ClaimFundsButton: FC<ClaimFundsButtonProps> = ({
  refetchData,
}) => {
  const {
    colony,
    canInteractWithColony,
    startPollingColonyData,
    stopPollingColonyData,
  } = useColonyContext();

  const claims = useColonyFundsClaims();
  const unclaimedClaims = claims.filter((claim) => !claim.isClaimed);
  const hasUnclaimedClaims = !!unclaimedClaims.length;
  const allClaimableTokenAddresses = Array.from(
    new Set(unclaimedClaims.map((claim) => claim.token?.tokenAddress || '')),
  );

  const [isClaimed, setIsClaimed] = useState(false);
  const [isVisible, setIsVisible] = useState(hasUnclaimedClaims);

  useEffect(() => {
    if (hasUnclaimedClaims) {
      setIsVisible(true);
      setIsClaimed(false);
    }
  }, [hasUnclaimedClaims]);

  useTimeout({
    shouldTriggerCallback: isClaimed,
    callback: () => {
      setIsVisible(false);
      refetchData();
    },
  });

  const transform = mergePayload({
    colonyAddress: colony?.colonyAddress,
    tokenAddresses: allClaimableTokenAddresses,
  });

  const handleClaimSuccess = () => {
    setIsClaimed(true);
    startPollingColonyData(1_000);
    setTimeout(stopPollingColonyData, 10_000);
  };

  if (!isVisible) {
    return null;
  }

  return isClaimed ? (
    <Button
      text={formatText(MSG.fundsClaimedCTA)}
      mode="completed"
      size="small"
      className="pointer-events-none h-fit border-gray-900 px-3 py-2 !text-base-white"
    />
  ) : (
    <Tooltip tooltipContent={formatText(MSG.claimFundsTooltip)} placement="top">
      <ActionButton
        actionType={ActionTypes.CLAIM_TOKEN}
        transform={transform}
        onSuccess={handleClaimSuccess}
        disabled={!canInteractWithColony}
        text={formatText(MSG.claimFundsCTA)}
        mode="primaryOutlineFull"
        size="small"
        className="h-fit border-gray-900 px-3 py-2 text-gray-900"
      />
    </Tooltip>
  );
};
