import React, { FC, useState } from 'react';

import { useAppContext, useAsyncFunction, useEnabledExtensions } from '~hooks';
import { ActionTypes } from '~redux';
import { formatText } from '~utils/intl';

import { ClaimAllButtonProps } from './types';

const displayName = 'common.Extensions.UserHub.partials.StakesTab';

const ClaimAllButton: FC<ClaimAllButtonProps> = ({
  colonyAddress,
  claimableStakes,
  updateClaimedStakesCache,
}) => {
  const { user } = useAppContext();
  const { votingReputationAddress } = useEnabledExtensions();

  const [isLoading, setIsLoading] = useState(false);

  const claimAll = useAsyncFunction({
    submit: ActionTypes.MOTION_CLAIM_ALL,
    error: ActionTypes.MOTION_CLAIM_ALL_ERROR,
    success: ActionTypes.MOTION_CLAIM_ALL_SUCCESS,
  });

  const handleClick = async () => {
    setIsLoading(true);
    try {
      await claimAll({
        userAddress: user?.walletAddress ?? '',
        colonyAddress,
        extensionAddress: votingReputationAddress ?? '',
        motionIds: claimableStakes.map((stake) => stake.motionDataId),
      });
      updateClaimedStakesCache(claimableStakes.map((stake) => stake.key));
    } catch {
      //
    }

    setIsLoading(false);
  };

  if (!claimableStakes.length) {
    return null;
  }

  return (
    <button
      type="button"
      className="text-blue-400 text-4 enabled:hover:text-gray-900 disabled:text-gray-900 transition-all duration-normal"
      aria-label={formatText({ id: 'claimStakes' })}
      disabled={isLoading}
      onClick={handleClick}
    >
      {formatText({ id: 'claimStakes' })}
    </button>
  );
};

ClaimAllButton.displayName = displayName;

export default ClaimAllButton;
