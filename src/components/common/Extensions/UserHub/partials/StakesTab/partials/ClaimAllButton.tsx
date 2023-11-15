import React, { useState } from 'react';
import { useIntl } from 'react-intl';

import { useAppContext, useAsyncFunction, useEnabledExtensions } from '~hooks';
import { ActionTypes } from '~redux';
import { UserStakeWithStatus } from '~types';

const displayName = 'common.Extensions.UserHub.partials.StakesTab';

interface ClaimAllButtonProps {
  colonyAddress: string;
  claimableStakes: UserStakeWithStatus[];
  updateClaimedStakesCache: (stakesIds: string[]) => void;
}

const ClaimAllButton = ({
  colonyAddress,
  claimableStakes,
  updateClaimedStakesCache,
}: ClaimAllButtonProps) => {
  const { formatMessage } = useIntl();

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
        motionIds: claimableStakes.map(
          (stake) => stake.action?.motionData?.id ?? '',
        ),
      });
      updateClaimedStakesCache(claimableStakes.map((stake) => stake.id));
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
      aria-label={formatMessage({ id: 'claimStakes' })}
      disabled={isLoading}
      onClick={handleClick}
    >
      {formatMessage({ id: 'claimStakes' })}
    </button>
  );
};

ClaimAllButton.displayName = displayName;

export default ClaimAllButton;
