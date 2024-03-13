import React, { useState } from 'react';
import { useIntl } from 'react-intl';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import useAsyncFunction from '~hooks/useAsyncFunction.ts';
import useEnabledExtensions from '~hooks/useEnabledExtensions.tsx';
import { ActionTypes } from '~redux/index.ts';
import { type UserStakeWithStatus } from '~types/userStake.ts';

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
          (stake) => stake.action?.motionData?.databaseMotionId ?? '',
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
      className="text-blue-400 transition-all duration-normal text-4 enabled:hover:text-gray-900 disabled:text-gray-900"
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
